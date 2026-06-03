import { AdminSidebar } from "@/components/dashboard/admin-sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <AdminSidebar />

      <main className="flex-1 overflow-auto p-6">
        {children}
      </main>
    </div>
  );
}