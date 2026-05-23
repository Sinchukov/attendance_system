"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";

export default function TeacherDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-slate-800">
          Добро пожаловать 👋
        </h1>

        <p className="text-slate-500 mt-2">
          Добро пожаловать в систему учета
          посещаемости университета
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <p className="text-slate-500">
            Сегодня занятий
          </p>

          <h2 className="text-4xl font-bold text-blue-600 mt-3">
            4
          </h2>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <p className="text-slate-500">
            Студентов сегодня
          </p>

          <h2 className="text-4xl font-bold text-blue-600 mt-3">
            52
          </h2>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <p className="text-slate-500">
            Отсутствуют
          </p>

          <h2 className="text-4xl font-bold text-red-500 mt-3">
            8
          </h2>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <p className="text-slate-500">
            Опоздали
          </p>

          <h2 className="text-4xl font-bold text-yellow-500 mt-3">
            3
          </h2>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">
          Ближайшие занятия
        </h2>

        <div className="space-y-4">
          <div className="border border-slate-200 rounded-xl p-5 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg text-slate-800">
                Программирование
              </h3>

              <p className="text-slate-500">
                Группа 251003 • Аудитория 312
              </p>
            </div>

            <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-xl font-medium">
              10:00 - 11:30
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl p-5 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg text-slate-800">
                Базы данных
              </h3>

              <p className="text-slate-500">
                Группа 251004 • Аудитория 210
              </p>
            </div>

            <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-xl font-medium">
              12:00 - 13:30
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}