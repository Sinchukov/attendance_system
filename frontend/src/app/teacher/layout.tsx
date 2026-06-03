import { TeacherSidebar } from "@/components/dashboard/teacher-sidebar";

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <TeacherSidebar />

      <main className="flex-1 p-8 bg-slate-100">
        {children}
      </main>
    </div>
  );
}