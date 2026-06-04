"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/axios";
import { ChevronRight, BookOpen } from "lucide-react";

interface Group {
  id: number;
  name: string;
}

interface Session {
  id: number;
  lessonDate: string;
  lessonType: string;
  isCancelled: boolean;
  subject: { name: string };
  group: { name: string };
  room: { name: string };
  pairTime: { pairNumber: number; startTime: string; endTime: string };
  subdivision?: { name: string } | null;
  attendances: { status: string }[];
}

const STATUS_COLORS: Record<string, string> = {
  PRESENT: "bg-green-900 text-green-300",
  ABSENT: "bg-red-900 text-red-300",
  LATE: "bg-amber-900 text-amber-300",
  EXCUSED: "bg-blue-900 text-blue-300",
  PENDING: "bg-slate-700 text-slate-400",
};
const STATUS_LABELS: Record<string, string> = {
  PRESENT: "Присут.", ABSENT: "Отсутст.", LATE: "Опоздал", EXCUSED: "Уважит.", PENDING: "—",
};

export default function TeacherJournalsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [sessionsLoading, setSessionsLoading] = useState(false);

  useEffect(() => {
    api.get("/teacher-dashboard/groups")
      .then(res => {
        setGroups(res.data);
        if (res.data.length > 0) setSelectedGroup(res.data[0].id);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedGroup) return;
    setSessionsLoading(true);
    api.get("/lesson-sessions/my")
      .then(res => {
        const filtered = (res.data as Session[])
          .filter(s => s.group?.name === groups.find(g => g.id === selectedGroup)?.name)
          .sort((a, b) => new Date(b.lessonDate).getTime() - new Date(a.lessonDate).getTime());
        setSessions(filtered);
      })
      .catch(console.error)
      .finally(() => setSessionsLoading(false));
  }, [selectedGroup, groups]);

  if (loading) return <div className="text-white text-xl">Загрузка групп...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white">Журнал</h1>
        <p className="text-slate-400 mt-2">История занятий и посещаемости по группам</p>
      </div>

      {groups.length === 0 ? (
        <p className="text-slate-400">У вас пока нет занятий.</p>
      ) : (
        <>
          <div className="flex gap-2 flex-wrap">
            {groups.map(g => (
              <button
                key={g.id}
                onClick={() => setSelectedGroup(g.id)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
                  selectedGroup === g.id ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {g.name}
              </button>
            ))}
          </div>

          {sessionsLoading ? (
            <div className="text-slate-400">Загрузка занятий...</div>
          ) : (
            <div className="space-y-3">
              {sessions.length === 0 && (
                <p className="text-slate-400">Занятий для этой группы не найдено.</p>
              )}
              {sessions.map(session => {
                const total = session.attendances.length;
                const present = session.attendances.filter(a => a.status === "PRESENT").length;
                const absent = session.attendances.filter(a => a.status === "ABSENT").length;
                const late = session.attendances.filter(a => a.status === "LATE").length;
                const pct = total > 0 ? Math.round((present / total) * 100) : 0;

                return (
                  <Link
                    key={session.id}
                    href={`/teacher/attendance?sessionId=${session.id}`}
                    className={`block bg-slate-900 border rounded-2xl p-5 hover:border-blue-600 transition ${
                      session.isCancelled ? "border-red-900/40 opacity-60" : "border-slate-800"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          <BookOpen size={16} className="text-slate-500 shrink-0" />
                          <span className="text-white font-semibold">{session.subject.name}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                            session.lessonType === "LECTURE" ? "bg-purple-900 text-purple-300" : "bg-teal-900 text-teal-300"
                          }`}>
                            {session.lessonType === "LECTURE" ? "Лекция" : "Практика"}
                          </span>
                          {session.isCancelled && (
                            <span className="text-xs bg-red-900 text-red-300 px-2 py-0.5 rounded-full">Отменено</span>
                          )}
                        </div>
                        <p className="text-slate-400 text-sm">
                          {new Date(session.lessonDate).toLocaleDateString("ru-RU", { day: "2-digit", month: "long", year: "numeric" })}
                          {" · "}Пара {session.pairTime.pairNumber} ({session.pairTime.startTime}–{session.pairTime.endTime})
                          {" · "}Ауд. {session.room.name}
                          {session.subdivision && ` · ${session.subdivision.name}`}
                        </p>
                        {total > 0 && (
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${STATUS_COLORS.PRESENT}`}>
                              {STATUS_LABELS.PRESENT}: {present}
                            </span>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${STATUS_COLORS.ABSENT}`}>
                              {STATUS_LABELS.ABSENT}: {absent}
                            </span>
                            {late > 0 && (
                              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${STATUS_COLORS.LATE}`}>
                                {STATUS_LABELS.LATE}: {late}
                              </span>
                            )}
                            <span className="text-slate-500 text-xs">{pct}% посещаемость</span>
                          </div>
                        )}
                      </div>
                      <ChevronRight size={18} className="text-slate-600 shrink-0" />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
