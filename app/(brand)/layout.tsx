import BrandNav from "@/components/BrandNav";

export default function BrandLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BrandNav />
      {children}
    </>
  );
}
