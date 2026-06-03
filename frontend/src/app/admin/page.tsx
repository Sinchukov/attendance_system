/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";

import { dashboardService } from "@/services/dashboard.service";

export default function AdminDashboardPage() {
  const [overview, setOverview] =
    useState<any>(null);

  const [topGroups, setTopGroups] =
    useState<any[]>([]);

  const [topTeachers, setTopTeachers] =
    useState<any[]>([]);

  const [riskStudents, setRiskStudents] =
    useState<any[]>([]);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [
          overviewData,
          groupsData,
          teachersData,
          riskData,
        ] = await Promise.all([
          dashboardService.getOverview(),
          dashboardService.getTopGroups(),
          dashboardService.getTopTeachers(),
          dashboardService.getRiskStudents(),
        ]);

        setOverview(overviewData);

        setTopGroups(groupsData);

        setTopTeachers(teachersData);

        setRiskStudents(riskData);
      } catch (error) {
        console.error(error);
      }
    }

    void loadDashboard();
  }, []);

  if (!overview) {
    return (
      <div className="text-white text-xl">
        Загрузка Dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-bold text-white">
          KPI Dashboard
        </h1>

        <p className="text-slate-400 mt-2">
          Аналитика посещаемости университета
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-slate-800 rounded-2xl p-6">
          <p className="text-slate-400">
            Студенты
          </p>

          <h2 className="text-4xl text-white font-bold mt-2">
            {overview.students}
          </h2>
        </div>

        <div className="bg-slate-800 rounded-2xl p-6">
          <p className="text-slate-400">
            Преподаватели
          </p>

          <h2 className="text-4xl text-white font-bold mt-2">
            {overview.teachers}
          </h2>
        </div>

        <div className="bg-slate-800 rounded-2xl p-6">
          <p className="text-slate-400">
            Группы
          </p>

          <h2 className="text-4xl text-white font-bold mt-2">
            {overview.groups}
          </h2>
        </div>

        <div className="bg-slate-800 rounded-2xl p-6">
          <p className="text-slate-400">
            Посещаемость
          </p>

          <h2 className="text-4xl text-green-400 font-bold mt-2">
            {overview.attendancePercent}%
          </h2>
        </div>
      </div>

      <div className="grid xl:grid-cols-2 gap-8">
        <div className="bg-slate-800 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-5">
            ТОП групп
          </h2>

          <div className="space-y-3">
            {topGroups.map((group) => (
              <div
                key={group.id}
                className="flex justify-between text-white"
              >
                <span>
                  {group.name}
                </span>

                <span>
                  {
                    group.attendancePercent
                  }
                  %
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-800 rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-white mb-5">
            ТОП преподавателей
          </h2>

          <div className="space-y-3">
            {topTeachers.map(
              (teacher) => (
                <div
                  key={teacher.id}
                  className="flex justify-between text-white"
                >
                  <span>
                    {
                      teacher.fullName
                    }
                  </span>

                  <span>
                    {
                      teacher.attendancePercent
                    }
                    %
                  </span>
                </div>
              ),
            )}
          </div>
        </div>
      </div>

      <div className="bg-slate-800 rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-red-400 mb-5">
          Студенты группы риска
        </h2>

        <div className="space-y-3">
          {riskStudents.map(
            (student) => (
              <div
                key={student.id}
                className="flex justify-between text-white"
              >
                <span>
                  {
                    student.fullName
                  }
                </span>

                <span>
                  {
                    student.attendancePercent
                  }
                  %
                </span>
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  );
}