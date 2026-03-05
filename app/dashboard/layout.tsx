import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-[calc(100-3.5rem)]">
      {/* Dashboard Sidebar */}
      <aside className="w-64 border-r bg-gray-50/40 shrink-0">
        <div className="p-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">
            Dashboard
          </h2>
          <nav className="flex flex-col gap-1">
            <Link
              href="/dashboard"
              className="px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100 transition-colors"
            >
              Overview
            </Link>
            <div className="mt-4 mb-2 px-3 text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Guidelines
            </div>
            <Link
              href="/setup"
              className="px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100 transition-colors"
            >
              Colours
            </Link>
            <Link
              href="/dashboard/logo"
              className="px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100 transition-colors"
            >
              Logo
            </Link>
          </nav>

          <div className="mt-8 pt-8 border-t">
            <LogoutButton />
          </div>
        </div>
      </aside>

      {/* Dashboard Content */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
