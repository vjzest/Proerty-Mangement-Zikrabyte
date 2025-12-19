import AdminLayoutClient from "./AdminLayoutClient"; // Path check kar lena

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
