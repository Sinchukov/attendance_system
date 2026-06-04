"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, CalendarDays, BookOpen,
  Users, BarChart2, LogOut,
} from "lucide-react";
import { useAuthStore } from "@/store/auth.store";

const navItems = [
  { href: "/teacher", label: "Главная", icon: LayoutDashboard },
  { href: "/teacher/schedule", label: "Расписание", icon: CalendarDays },
  { href: "/teacher/journals", label: "Журнал", icon: BookOpen },
  { href: "/teacher/students", label: "Студенты", icon: Users },
  { href: "/teacher/statistics", label: "Статистика", icon: BarChart2 },
];

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <div className="min-h-screen flex bg-slate-950">
      <aside className="w-64 bg-slate-900 text-white flex flex-col justify-between border-r border-slate-800 shrink-0">
        <div>
          <div className="p-6 border-b border-slate-800">
            <h1 className="text-lg font-bold text-white">Attendance System</h1>
            <p className="text-xs text-slate-400 mt-1">Панель преподавателя</p>
          </div>
          <nav className="p-3 flex flex-col gap-1">
            {navItems.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href || pathname.startsWith(href + "/");
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <Icon size={16} />
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 transition px-4 py-2.5 rounded-xl text-white text-sm font-semibold"
          >
            <LogOut size={16} /> Выйти
          </button>
        </div>
      </aside>
      <main className="flex-1 bg-slate-950 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
