"use client";

import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      <aside className="w-72 bg-slate-900 text-white">
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-xl font-bold">
            Attendance System
          </h1>

          <p className="text-sm text-slate-400 mt-1">
            Administrator Panel
          </p>
        </div>

        <nav className="p-4 flex flex-col gap-2">
          <Link href="/admin/dashboard">
            Dashboard
          </Link>

          <Link href="/admin/students">
            Students
          </Link>

          <Link href="/admin/teachers">
            Teachers
          </Link>

          <Link href="/admin/groups">
            Groups
          </Link>

          <Link href="/admin/subjects">
            Subjects
          </Link>

          <Link href="/admin/rooms">
            Rooms
          </Link>

          <Link href="/admin/devices">
            Devices
          </Link>

          <Link href="/admin/schedule">
            Schedule
          </Link>

          <Link href="/admin/sessions">
            Lesson Sessions
          </Link>

          <Link href="/admin/subdivisions">
            Subdivisions
          </Link>

          <Link href="/admin/users">
            Users
          </Link>

          <Link href="/admin/audit">
            Audit Logs
          </Link>
        </nav>
      </aside>

      <main className="flex-1 bg-slate-100 p-8">
        {children}
      </main>
    </div>
  );
}