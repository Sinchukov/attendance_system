"use client";

import { useEffect, useMemo, useState } from "react";

import {
  format,
  startOfWeek,
  addDays,
} from "date-fns";

import { ru } from "date-fns/locale";

import { useAuthStore } from "@/store/auth.store";

import { lessonSessionService } from "@/services/lesson-session.service";

interface Session {
  id: number;

  lessonDate: string;

  subject: {
    name: string;
  };

  room: {
    name: string;
  };

  group: {
    name: string;
  };

  pairTime: {
    startTime: string;
    endTime: string;
  };
}

const weekdays = [
  "Понедельник",
  "Вторник",
  "Среда",
  "Четверг",
  "Пятница",
  "Суббота",
];

export default function SchedulePage() {
  const [sessions, setSessions] =
    useState<Session[]>([]);

  const [loading, setLoading] =
    useState(true);

  const user = useAuthStore(
    (state) => state.user,
  );

  useEffect(() => {
    async function loadSchedule() {
      try {
        const data =
await lessonSessionService.getMyWeekSessions();

        setSessions(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    void loadSchedule();
  }, [user]);

  const weekDays = useMemo(() => {
    const start =
      startOfWeek(new Date(), {
        weekStartsOn: 1,
      });

    return Array.from(
      { length: 6 },
      (_, index) => {
        const date = addDays(
          start,
          index,
        );

        return {
          label: weekdays[index],

          date,

          sessions: sessions.filter(
            (session) => {
              const sessionDate =
                new Date(
                  session.lessonDate,
                );

              return (
                format(
                  sessionDate,
                  "yyyy-MM-dd",
                ) ===
                format(
                  date,
                  "yyyy-MM-dd",
                )
              );
            },
          ),
        };
      },
    );
  }, [sessions]);

  if (loading) {
    return (
      <div className="text-white text-xl">
        Загрузка расписания...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white">
          Расписание
        </h1>

        <p className="text-slate-400 mt-2">
          Текущая учебная неделя
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {weekDays.map((day) => (
          <div
            key={day.label}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
          >
            <div className="mb-5">
              <h2 className="text-2xl font-bold text-white">
                {day.label}
              </h2>

              <p className="text-slate-400 mt-1">
                {format(
                  day.date,
                  "d MMMM yyyy",
                  {
                    locale: ru,
                  },
                )}
              </p>
            </div>

            <div className="space-y-4">
              {day.sessions.length ===
              0 ? (
                <div className="bg-slate-800 rounded-xl p-4 text-slate-400">
                  Нет занятий
                </div>
              ) : (
                day.sessions.map(
                  (session) => (
                    <div
                      key={session.id}
                      className="bg-slate-800 rounded-xl p-5"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-white">
                            {
                              session
                                .subject
                                .name
                            }
                          </h3>

                          <p className="text-slate-400 mt-1">
                            Группа{" "}
                            {
                              session
                                .group
                                .name
                            }
                          </p>

                          <p className="text-slate-400">
                            Аудитория{" "}
                            {
                              session
                                .room
                                .name
                            }
                          </p>
                        </div>

                        <div className="bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold">
                          {
                            session
                              .pairTime
                              .startTime
                          }
                          {" - "}
                          {
                            session
                              .pairTime
                              .endTime
                          }
                        </div>
                      </div>
                    </div>
                  ),
                )
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}