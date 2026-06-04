/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { useEffect, useState } from "react";

import { getKpi } from "@/lib/api/admin-dashboard.api";

import { getStatistics } from "@/lib/api/admin-dashboard.api";

import { AdminKpi } from "@/types/admin-kpi";

import { AdminStatistics } from "@/types/admin-statistics";

export default function AdminDashboardPage() {
  const [kpi, setKpi] = useState<AdminKpi | null>(null);

  const [statistics, setStatistics] =
    useState<AdminStatistics | null>(null);

  async function loadData() {
const loadData = async () => {
  const [kpiData, statData] = await Promise.all([
    getKpi(),
    getStatistics(),
  ]);

    setKpi(kpiData);

    setStatistics(statData);
  };

    useEffect(() => {
    loadData();
  }, []);
}

  if (!kpi || !statistics) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">
        Dashboard
      </h1>

      <div className="grid grid-cols-4 gap-4 mb-10">
        <Card
          title="Students"
          value={kpi.totalStudents}
        />

        <Card
          title="Teachers"
          value={kpi.totalTeachers}
        />

        <Card
          title="Attendances"
          value={kpi.totalAttendances}
        />

        <Card
          title="Attendance %"
          value={`${kpi.attendancePercent}%`}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card
          title="Groups"
          value={statistics.groups}
        />

        <Card
          title="Subjects"
          value={statistics.subjects}
        />

        <Card
          title="Today's Sessions"
          value={statistics.todaySessions}
        />

        <Card
          title="Present"
          value={statistics.present}
        />

        <Card
          title="Late"
          value={statistics.late}
        />

        <Card
          title="Absent"
          value={statistics.absent}
        />
      </div>
    </div>
  );
}

function Card({
  title,
  value,
}: {
  title: string;
  value: string | number;
}) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="text-slate-500">
        {title}
      </div>

      <div className="text-3xl font-bold mt-2">
        {value}
      </div>
    </div>
  );
}