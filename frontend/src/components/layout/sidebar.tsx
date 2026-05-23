"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  LayoutDashboard,
  CalendarDays,
  ClipboardCheck,
  Users,
  LogOut,
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

  const handleLogout = () => {
    logout();

    router.push("/login");
  };

  return (
    <aside className="w-[260px] min-h-screen bg-blue-950 text-white flex flex-col justify-between">
      <div>
        <div className="p-6 border-b border-blue-900">
          <h1 className="text-2xl font-bold">
            Attendance System
          </h1>

          <p className="text-sm text-blue-200 mt-1">
            Teacher Panel
          </p>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;

            const isActive =
              pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "hover:bg-blue-800 text-blue-100"
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

      <div className="p-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 transition-all p-3 rounded-xl font-medium"
        >
          <LogOut size={18} />

          Выйти
        </button>
      </div>
    </aside>
  );
}