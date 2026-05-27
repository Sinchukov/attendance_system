"use client";

import Link from "next/link";

import {
  usePathname,
  useRouter,
} from "next/navigation";

import {
  LayoutDashboard,
  CalendarDays,
  ClipboardCheck,
  Users,
  LogOut,
  GraduationCap,
} from "lucide-react";

import { useAuthStore } from "@/store/auth.store";

const menuItems = [
  {
    label: "Главная",
    href: "/dashboard/teacher",
    icon: LayoutDashboard,
  },

  {
    label: "Расписание",
    href: "/dashboard/teacher/schedule",
    icon: CalendarDays,
  },

  {
    label: "Посещаемость",
    href: "/dashboard/teacher/attendance",
    icon: ClipboardCheck,
  },

  {
    label: "Студенты",
    href: "/dashboard/teacher/students",
    icon: Users,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  const router = useRouter();

  const logout = useAuthStore(
    (state) => state.logout,
  );

  const user = useAuthStore(
    (state) => state.user,
  );

  const handleLogout = () => {
    logout();

    router.push("/login");
  };

  return (
    <aside className="w-[280px] min-h-screen bg-slate-950 border-r border-slate-800 text-white flex flex-col justify-between">
      <div>
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-3 rounded-2xl">
              <GraduationCap size={28} />
            </div>

            <div>
              <h1 className="text-xl font-bold">
                Attendance System
              </h1>

              <p className="text-sm text-slate-400">
                Teacher Panel
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 py-5 border-b border-slate-800">
          <p className="text-sm text-slate-400">
            Преподаватель
          </p>

          <h2 className="font-semibold text-lg mt-1">
            {user?.teacherName ??
              user?.email}
          </h2>

          <p className="text-sm text-blue-400 mt-1">
            {user?.role}
          </p>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;

            const isActive =
              pathname.startsWith(
                item.href,
              );

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                    : "hover:bg-slate-800 text-slate-300"
                }`}
              >
                <Icon size={20} />

                <span className="font-medium">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 transition-all p-3 rounded-2xl font-medium"
        >
          <LogOut size={18} />

          Выйти
        </button>
      </div>
    </aside>
  );
}