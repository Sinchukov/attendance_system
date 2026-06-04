"use client";

import { useEffect, useState } from "react";
import { getKpi, getStatistics } from "@/lib/api/admin-dashboard.api";
import { AdminKpi } from "@/types/admin-kpi";
import { AdminStatistics } from "@/types/admin-statistics";

export default function AdminDashboardPage() {
  const [kpi, setKpi] = useState<AdminKpi | null>(null);
  const [statistics, setStatistics] = useState<AdminStatistics | null>(null);

  useEffect(() => {
    async function loadData() {
      const [kpiData, statData] = await Promise.all([
        getKpi(),
        getStatistics(),
      ]);
      setKpi(kpiData);
      setStatistics(statData);
    }
    void loadData();
  }, []);

  if (!kpi || !statistics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-400 text-xl">Загрузка данных...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400 mt-2">Сводная информация по системе</p>
      </div>

      <div>
        <h2 className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-4">
          Общая статистика
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card title="Студентов" value={kpi.totalStudents} color="blue" />
          <Card title="Преподавателей" value={kpi.totalTeachers} color="purple" />
          <Card title="Записей посещаемости" value={kpi.totalAttendances} color="teal" />
          <Card title="Посещаемость %" value={`${kpi.attendancePercent}%`} color="green" />
        </div>
      </div>

      <div>
        <h2 className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-4">
          Сегодня
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <Card title="Пар сегодня" value={statistics.todaySessions} color="amber" />
          <Card title="Отметок сегодня" value={statistics.todayAttendances} color="amber" />
          <Card title="Групп" value={statistics.groups} color="slate" />
        </div>
      </div>

      <div>
        <h2 className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-4">
          Всего по статусам
        </h2>
        <div className="grid grid-cols-3 gap-4">
          <Card title="Присутствовали" value={kpi.present} color="green" />
          <Card title="Опоздали" value={kpi.late} color="amber" />
          <Card title="Отсутствовали" value={kpi.absent} color="red" />
        </div>
      </div>
    </div>
  );
}

const colorMap: Record<string, string> = {
  blue: "border-blue-500 text-blue-400",
  purple: "border-purple-500 text-purple-400",
  teal: "border-teal-500 text-teal-400",
  green: "border-green-500 text-green-400",
  amber: "border-amber-500 text-amber-400",
  red: "border-red-500 text-red-400",
  slate: "border-slate-500 text-slate-400",
};

function Card({
  title,
  value,
  color = "blue",
}: {
  title: string;
  value: string | number;
  color?: string;
}) {
  return (
    <div className={`bg-slate-900 border-l-4 ${colorMap[color]} rounded-2xl p-6`}>
      <div className="text-slate-400 text-sm">{title}</div>
      <div className="text-3xl font-bold text-white mt-2">{value}</div>
    </div>
  );
}