import { ReactNode } from "react";

import { AdminSidebar } from "@/components/dashboard/admin-sidebar";

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex bg-slate-900 min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}