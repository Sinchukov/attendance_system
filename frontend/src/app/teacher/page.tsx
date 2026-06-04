"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/axios";
import { CalendarCheck, Users, UserX, UserCheck, Clock } from "lucide-react";

interface TodaySession {
  id: number;
  lessonDate: string;
  isCancelled: boolean;
  lessonType: string;
  subject: { name: string };
  group: { name: string };
  room: { name: string };
  pairTime: { pairNumber: number; startTime: string; endTime: string };
  subdivision?: { name: string } | null;
  attendances: { status: string }[];
}

interface TeacherInfo {
  fullName: string;
}

export default function TeacherDashboardPage() {
  const [teacher, setTeacher] = useState<TeacherInfo | null>(null);
  const [sessions, setSessions] = useState<TodaySession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void loadData();
  }, []);

  async function loadData() {
    try {
      const [infoRes, sessionsRes] = await Promise.all([
        api.get("/teacher-dashboard/me"),
        api.get("/teacher-dashboard/today"),
      ]);
      setTeacher(infoRes.data);
      setSessions(sessionsRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const totalStudents = sessions.reduce((acc, s) => acc + s.attendances.length, 0);
  const present = sessions.reduce((acc, s) => acc + s.attendances.filter(a => a.status === "PRESENT").length, 0);
  const absent = sessions.reduce((acc, s) => acc + s.attendances.filter(a => a.status === "ABSENT").length, 0);

  if (loading) return <div className="text-white text-xl">Загрузка...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white">
          Добро пожаловать{teacher ? `, ${teacher.fullName.split(" ")[0]}` : ""}
        </h1>
        <p className="text-slate-400 mt-2">Сегодняшние занятия и статистика</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border-l-4 border-blue-500 rounded-2xl p-6">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
            <CalendarCheck size={16} /> Пар сегодня
          </div>
          <div className="text-3xl font-bold text-white">{sessions.length}</div>
        </div>
        <div className="bg-slate-900 border-l-4 border-slate-500 rounded-2xl p-6">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
            <Users size={16} /> Студентов
          </div>
          <div className="text-3xl font-bold text-white">{totalStudents}</div>
        </div>
        <div className="bg-slate-900 border-l-4 border-green-500 rounded-2xl p-6">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
            <UserCheck size={16} /> Присутствуют
          </div>
          <div className="text-3xl font-bold text-green-400">{present}</div>
        </div>
        <div className="bg-slate-900 border-l-4 border-red-500 rounded-2xl p-6">
          <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
            <UserX size={16} /> Отсутствуют
          </div>
          <div className="text-3xl font-bold text-red-400">{absent}</div>
        </div>
      </div>

      <div>
        <h2 className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-4">
          Пары сегодня
        </h2>
        <div className="space-y-3">
          {sessions.length === 0 && (
            <p className="text-slate-400">На сегодня занятий нет.</p>
          )}
          {sessions.map((session) => {
            const marked = session.attendances.filter(a => a.status !== "PENDING").length;
            const total = session.attendances.length;
            const pct = total > 0 ? Math.round((marked / total) * 100) : 0;
            return (
              <Link
                key={session.id}
                href={`/teacher/attendance?sessionId=${session.id}`}
                className={`block bg-slate-900 border rounded-2xl p-5 hover:border-blue-600 transition ${
                  session.isCancelled ? "border-red-900/50 opacity-50 pointer-events-none" : "border-slate-800"
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-white font-bold text-lg">{session.subject.name}</span>
                      <span className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full">
                        {session.group.name}{session.subdivision ? ` · ${session.subdivision.name}` : ""}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        session.lessonType === "LECTURE" ? "bg-purple-900 text-purple-300" : "bg-teal-900 text-teal-300"
                      }`}>
                        {session.lessonType === "LECTURE" ? "Лекция" : "Практика"}
                      </span>
                      {session.isCancelled && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-red-900 text-red-300">Отменено</span>
                      )}
                    </div>
                    <p className="text-slate-400 text-sm">Ауд. {session.room.name}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex-1 bg-slate-800 rounded-full h-1.5">
                        <div
                          className="bg-blue-500 h-1.5 rounded-full transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-slate-500 text-xs">{marked}/{total} отмечено</span>
                    </div>
                  </div>
                  <div className="bg-slate-800 px-4 py-3 rounded-xl text-center shrink-0">
                    <div className="flex items-center gap-1 text-blue-400 font-semibold">
                      <Clock size={14} />
                      {session.pairTime.startTime}
                    </div>
                    <div className="text-slate-500 text-xs mt-0.5">—{session.pairTime.endTime}</div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
