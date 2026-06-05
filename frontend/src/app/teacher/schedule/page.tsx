"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { format, startOfWeek, addDays, addWeeks, subWeeks } from "date-fns";
import { ru } from "date-fns/locale";
import { api } from "@/lib/axios";

interface Session {
  id: number;
  lessonDate: string;
  lessonType: string;
  isCancelled: boolean;
  cancellationReason?: string;
  subject: { name: string };
  room: { name: string };
  group: { name: string };
  subdivision?: { name: string };
  pairTime: { pairNumber: number; startTime: string; endTime: string };
}

const WEEKDAY_LABELS = [
  "Понедельник",
  "Вторник",
  "Среда",
  "Четверг",
  "Пятница",
  "Суббота",
];

const LESSON_TYPE_LABEL: Record<string, string> = {
  LECTURE: "Лекция",
  PRACTICE: "Практика",
};

export default function SchedulePage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isPending, startTransition] = useTransition();
  // weekOffset: 0 = текущая неделя, 1 = следующая, -1 = прошлая
  const [weekOffset, setWeekOffset] = useState(0);

  // Понедельник выбранной недели
  const weekStart = useMemo(() => {
    const base = startOfWeek(new Date(), { weekStartsOn: 1 });
    return weekOffset === 0
      ? base
      : weekOffset > 0
        ? addWeeks(base, weekOffset)
        : subWeeks(base, Math.abs(weekOffset));
  }, [weekOffset]);

  useEffect(() => {
    const dateFrom = format(weekStart, "yyyy-MM-dd");

    startTransition(() => {
      api
        .get(`/lesson-sessions/my/week?dateFrom=${dateFrom}`)
        .then((res) => setSessions(res.data as Session[]))
        .catch(console.error);
    });
  }, [weekStart]);

  const weekDays = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => {
      const date = addDays(weekStart, i);
      const dateStr = format(date, "yyyy-MM-dd");
      return {
        label: WEEKDAY_LABELS[i],
        date,
        sessions: sessions
          .filter((s) => format(new Date(s.lessonDate), "yyyy-MM-dd") === dateStr)
          .sort((a, b) => a.pairTime.pairNumber - b.pairTime.pairNumber),
      };
    });
  }, [sessions, weekStart]);

  const weekLabel = useMemo(() => {
    const end = addDays(weekStart, 5);
    return `${format(weekStart, "d MMM", { locale: ru })} – ${format(end, "d MMM yyyy", { locale: ru })}`;
  }, [weekStart]);

  const isCurrentWeek = weekOffset === 0;

  return (
    <div className="space-y-8">
      {/* Заголовок + навигация */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white">Расписание</h1>
          <p className="text-slate-400 mt-1">{weekLabel}</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Кнопка назад */}
          <button
            onClick={() => setWeekOffset((o) => o - 1)}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
            title="Предыдущая неделя"
          >
            ‹
          </button>

          {/* Текущая неделя */}
          <button
            onClick={() => setWeekOffset(0)}
            disabled={isCurrentWeek}
            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
              isCurrentWeek
                ? "bg-blue-600 border-blue-500 text-white cursor-default"
                : "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white"
            }`}
          >
            Сегодня
          </button>

          {/* Кнопка вперёд */}
          <button
            onClick={() => setWeekOffset((o) => o + 1)}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
            title="Следующая неделя"
          >
            ›
          </button>
        </div>
      </div>

      {/* Сетка дней */}
      {isPending ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 animate-pulse"
            >
              <div className="h-6 w-32 bg-slate-700 rounded mb-3" />
              <div className="h-4 w-24 bg-slate-800 rounded mb-6" />
              <div className="space-y-3">
                <div className="h-20 bg-slate-800 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {weekDays.map((day) => {
            const isToday =
              format(day.date, "yyyy-MM-dd") ===
              format(new Date(), "yyyy-MM-dd");

            return (
              <div
                key={day.label}
                className={`bg-slate-900 border rounded-2xl p-6 ${
                  isToday ? "border-blue-600" : "border-slate-800"
                }`}
              >
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h2
                      className={`text-2xl font-bold ${
                        isToday ? "text-blue-400" : "text-white"
                      }`}
                    >
                      {day.label}
                    </h2>
                    <p className="text-slate-400 mt-1">
                      {format(day.date, "d MMMM yyyy", { locale: ru })}
                    </p>
                  </div>
                  {isToday && (
                    <span className="text-xs font-semibold bg-blue-600/20 text-blue-400 border border-blue-600/40 px-3 py-1 rounded-full">
                      Сегодня
                    </span>
                  )}
                </div>

                <div className="space-y-4">
                  {day.sessions.length === 0 ? (
                    <div className="bg-slate-800 rounded-xl p-4 text-slate-500 text-sm">
                      Нет занятий
                    </div>
                  ) : (
                    day.sessions.map((session) => (
                      <div
                        key={session.id}
                        className={`rounded-xl p-5 border transition-opacity ${
                          session.isCancelled
                            ? "bg-slate-800/50 border-red-900/40 opacity-60"
                            : "bg-slate-800 border-slate-700"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <h3 className="text-lg font-bold text-white truncate">
                                {session.subject.name}
                              </h3>
                              {session.isCancelled && (
                                <span className="text-xs bg-red-900/40 text-red-400 border border-red-800/40 px-2 py-0.5 rounded-full shrink-0">
                                  Отменено
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2 flex-wrap mt-1">
                              <span className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full">
                                {LESSON_TYPE_LABEL[session.lessonType] ?? session.lessonType}
                              </span>
                              <span className="text-slate-400 text-sm">
                                Группа {session.group.name}
                                {session.subdivision
                                  ? ` · ${session.subdivision.name}`
                                  : ""}
                              </span>
                            </div>

                            <p className="text-slate-400 text-sm mt-1">
                              Аудитория {session.room.name}
                            </p>

                            {session.isCancelled && session.cancellationReason && (
                              <p className="text-red-400 text-xs mt-2">
                                Причина: {session.cancellationReason}
                              </p>
                            )}
                          </div>

                          <div className="shrink-0 text-right">
                            <div className="bg-blue-600 text-white px-3 py-2 rounded-xl font-semibold text-sm whitespace-nowrap">
                              {session.pairTime.startTime}
                              {" – "}
                              {session.pairTime.endTime}
                            </div>
                            <p className="text-slate-500 text-xs mt-1">
                              Пара {session.pairTime.pairNumber}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
