"use client";

import { useEffect, useState } from "react";

import { useAuthStore } from "@/store/auth.store";

import { scheduleService } from "@/services/schedule.service";

interface ScheduleItem {
  id: number;

  weekday: string;

  lessonType: string;

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
    pairNumber: number;
    startTime: string;
    endTime: string;
  };
}

export default function SchedulePage() {
  const { user } = useAuthStore();

  const [schedule, setSchedule] = useState<
    ScheduleItem[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function loadSchedule() {
      try {
        if (!user?.id) return;

        const data =
          await scheduleService.getTeacherSchedule(
            user.id,
          );

        setSchedule(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadSchedule();
  }, [user]);

  const weekdayMap: Record<string, string> = {
    MONDAY: "Понедельник",
    TUESDAY: "Вторник",
    WEDNESDAY: "Среда",
    THURSDAY: "Четверг",
    FRIDAY: "Пятница",
    SATURDAY: "Суббота",
  };

  if (loading) {
    return (
      <div className="text-white text-xl">
        Загрузка расписания...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">
          Расписание
        </h1>

        <p className="text-slate-400 mt-2">
          Ваши занятия и пары
        </p>
      </div>

      <div className="grid gap-4">
        {schedule.map((lesson) => (
          <div
            key={lesson.id}
            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  {lesson.subject.name}
                </h2>

                <p className="text-slate-500 mt-1">
                  {weekdayMap[
                    lesson.weekday
                  ] || lesson.weekday}
                </p>
              </div>

              <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-xl font-semibold">
                {lesson.lessonType}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-slate-400 text-sm">
                  Группа
                </p>

                <p className="text-lg font-semibold text-slate-900 mt-1">
                  {lesson.group.name}
                </p>
              </div>

              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-slate-400 text-sm">
                  Аудитория
                </p>

                <p className="text-lg font-semibold text-slate-900 mt-1">
                  {lesson.room.name}
                </p>
              </div>

              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-slate-400 text-sm">
                  Время
                </p>

                <p className="text-lg font-semibold text-slate-900 mt-1">
                  {lesson.pairTime.startTime}
                  {" - "}
                  {lesson.pairTime.endTime}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}