"use client";

import Link from "next/link";

import { usePathname } from "next/navigation";

const links = [
  {
    href: "/dashboard/admin",
    label: "Главная",
  },

  {
    href: "/dashboard/admin/students",
    label: "Студенты",
  },

  {
    href: "/dashboard/admin/teachers",
    label: "Преподаватели",
  },

  {
    href: "/dashboard/admin/groups",
    label: "Группы",
  },

  {
    href: "/dashboard/admin/subjects",
    label: "Предметы",
  },

  {
    href: "/dashboard/admin/rooms",
    label: "Аудитории",
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[260px] min-h-screen bg-slate-950 border-r border-slate-800 p-6">
      <h2 className="text-2xl font-bold text-white mb-10">
        Admin Panel
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