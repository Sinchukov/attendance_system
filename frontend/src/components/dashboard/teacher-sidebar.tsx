"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  {
    href: "/teacher",
    label: "Главная",
  },

  {
    href: "/teacher/schedule",
    label: "Расписание",
  },

  {
    href: "/teacher/sessions",
    label: "Пары",
  },

  {
    href: "/teacher/attendance",
    label: "Посещаемость",
  },

  {
    href: "/teacher/groups",
    label: "Группы",
  },

  {
    href: "/teacher/students",
    label: "Студенты",
  },

  {
    href: "/teacher/statistics",
    label: "Статистика",
  },
];

export function TeacherSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[260px] min-h-screen bg-slate-950 border-r border-slate-800 p-6">
      <h2 className="text-2xl font-bold text-white mb-10">
        Teacher Panel
      </h2>

      <nav className="space-y-3">
        {links.map((link) => {
          const active =
            pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-4 py-3 rounded-xl transition ${
                active
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-800"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}