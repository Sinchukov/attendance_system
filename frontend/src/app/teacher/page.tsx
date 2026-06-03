"use client";

import { useEffect, useState } from "react";
import { AuthGuard } from "@/components/auth/auth-guard";
import Link from "next/link";

import { useAuthStore } from "@/store/auth.store";

import { lessonSessionService } from "@/services/lesson-session.service";

interface Session {
  id: number;

  subject: {
    name: string;
  };

  group: {
    name: string;
  };

  room: {
    name: string;
  };

  pairTime: {
    startTime: string;
    endTime: string;
  };

  attendances: {
    status: string;
  }[];
}

export default function TeacherDashboardPage() {
  const [sessions, setSessions] =
    useState<Session[]>([]);

  const user = useAuthStore(
    (state) => state.user,
  );

  useEffect(() => {
    async function loadSessions() {
      try {

        const data =
await lessonSessionService.getMySessions();

        setSessions(data);
      } catch (error) {
        console.error(error);
      }
    }

    void loadSessions();
  }, [user]);

  const totalStudents =
    sessions.reduce((acc, session) => {
      return (
        acc +
        session.attendances.length
      );
    }, 0);

  const absentStudents =
    sessions.reduce((acc, session) => {
      return (
        acc +
        session.attendances.filter(
          (a) =>
            a.status === "ABSENT",
        ).length
      );
    }, 0);

  const presentStudents =
    sessions.reduce((acc, session) => {
      return (
        acc +
        session.attendances.filter(
          (a) =>
            a.status === "PRESENT",
        ).length
      );
    }, 0);

  return (
    <AuthGuard>
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-slate-800">
          Добро пожаловать 👋
        </h1>

        <p className="text-slate-500 mt-2">
          Добро пожаловать в систему
          учета посещаемости
          университета
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <p className="text-slate-500">
            Сегодня занятий
          </p>

          <h2 className="text-4xl font-bold text-blue-600 mt-3">
            {sessions.length}
          </h2>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <p className="text-slate-500">
            Студентов сегодня
          </p>

          <h2 className="text-4xl font-bold text-blue-600 mt-3">
            {totalStudents}
          </h2>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <p className="text-slate-500">
            Отсутствуют
          </p>

          <h2 className="text-4xl font-bold text-red-500 mt-3">
            {absentStudents}
          </h2>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <p className="text-slate-500">
            Присутствуют
          </p>

          <h2 className="text-4xl font-bold text-green-500 mt-3">
            {presentStudents}
          </h2>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">
          Ближайшие занятия
        </h2>

        <div className="space-y-4">
          {sessions.map((session) => (
            <Link
              href={`/dashboard/teacher/attendance?sessionId=${session.id}`}
              key={session.id}
            >
              <div className="border border-slate-200 rounded-xl p-5 flex items-center justify-between hover:bg-slate-50 transition cursor-pointer">
                <div>
                  <h3 className="font-semibold text-lg text-slate-800">
                    {session.subject.name}
                  </h3>

                  <p className="text-slate-500">
                    Группа{" "}
                    {session.group.name}
                    {" • "}
                    Аудитория{" "}
                    {session.room.name}
                  </p>
                </div>

                <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-xl font-medium">
                  {
                    session.pairTime
                      .startTime
                  }
                  {" - "}
                  {
                    session.pairTime
                      .endTime
                  }
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      
    </div>
    </AuthGuard>
  );
}