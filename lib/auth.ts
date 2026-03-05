import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email:    { label: "Email",    type: "email"    },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required.");
        }

        await connectDB();

        const user = await User.findOne({
          email: credentials.email.toLowerCase(),
        }).select("+password");

        if (!user) {
          throw new Error("No account found with that email address.");
        }

        const isMatch = await bcrypt.compare(credentials.password, user.password);
        if (!isMatch) {
          throw new Error("Incorrect password.");
        }

        return {
          id:              user._id.toString(),
          email:           user.email,
          firstName:       user.firstName,
          lastName:        user.lastName,
          name:            `${user.firstName} ${user.lastName}`,
          isSetupComplete: user.isSetupComplete ?? false,
        };
      },
    }),
  ],

  session: { strategy: "jwt" },

  callbacks: {
    async jwt({ token, user, trigger, session: sessionData }) {
      // Handle manual session update (called after setup is saved)
      if (trigger === "update" && sessionData) {
        if (sessionData.isSetupComplete !== undefined) {
          token.isSetupComplete = sessionData.isSetupComplete;
        }
      }

      // On initial sign-in, persist user fields into the token
      if (user) {
        const u = user as unknown as {
          id: string;
          firstName: string;
          lastName: string;
          isSetupComplete: boolean;
        };
        token.id              = u.id;
        token.firstName       = u.firstName;
        token.lastName        = u.lastName;
        token.isSetupComplete = u.isSetupComplete;
      }

      return token;
    },

    async session({ session, token }) {
      session.user.id              = token.id;
      session.user.firstName       = token.firstName;
      session.user.lastName        = token.lastName;
      session.user.isSetupComplete = token.isSetupComplete;
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error:  "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
