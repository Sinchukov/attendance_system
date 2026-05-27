"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useSearchParams } from "next/navigation";

import { format } from "date-fns";

import { ru } from "date-fns/locale";

import { Search } from "lucide-react";

import { attendanceService } from "@/services/attendance.service";

import { AuthGuard } from "@/components/auth/auth-guard";

interface AttendanceItem {
  id: number;

  status: string;

  comment?: string;

  student: {
    id: number;

    fullName: string;

    studentCardNo: string;
  };
}

interface SessionData {
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

  attendances: AttendanceItem[];
}

export default function AttendancePage() {
  const searchParams =
    useSearchParams();

  const sessionIdParam =
    searchParams.get("sessionId");

  const sessionId =
    sessionIdParam
      ? Number(sessionIdParam)
      : null;

  const [session, setSession] =
    useState<SessionData | null>(
      null,
    );

const isValidSession =
  sessionId !== null;

const [loading, setLoading] =
  useState(isValidSession);

  const [search, setSearch] =
    useState("");

useEffect(() => {
  if (!isValidSession) {
    return;
  }

  const currentSessionId =
    sessionId;

  async function loadSession() {
    try {
      const data =
        await attendanceService.getSessionStudents(
          currentSessionId!,
        );

      setSession(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  void loadSession();
}, [sessionId, isValidSession]);
  async function changeStatus(
    attendanceId: number,
    data: {
      status:
        | "PRESENT"
        | "LATE"
        | "ABSENT"
        | "EXCUSED";

      comment?: string;
    },
  ) {
    try {
      const updated =
        await attendanceService.updateAttendance(
          attendanceId,
          data,
        );

      setSession((prev) => {
        if (!prev) {
          return prev;
        }

        return {
          ...prev,

          attendances:
            prev.attendances.map(
              (item) =>
                item.id ===
                attendanceId
                  ? {
                      ...item,

                      status:
                        updated.status,

                      comment:
                        updated.comment,
                    }
                  : item,
            ),
        };
      });
    } catch (error) {
      console.error(error);
    }
  }

  const filteredStudents =
    useMemo(() => {
      if (!session) {
        return [];
      }

      return session.attendances.filter(
        (item) =>
          item.student.fullName
            .toLowerCase()
            .includes(
              search.toLowerCase(),
            ),
      );
    }, [session, search]);

  const stats = useMemo(() => {
    if (!session) {
      return {
        total: 0,
        present: 0,
        absent: 0,
        late: 0,
      };
    }

    return {
      total:
        session.attendances.length,

      present:
        session.attendances.filter(
          (a) =>
            a.status ===
            "PRESENT",
        ).length,

      absent:
        session.attendances.filter(
          (a) =>
            a.status ===
            "ABSENT",
        ).length,

      late:
        session.attendances.filter(
          (a) =>
            a.status === "LATE",
        ).length,
    };
  }, [session]);

  if (!sessionId) {
    return (
      <div className="text-white text-xl">
        Не выбрана пара
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-white text-xl">
        Загрузка посещаемости...
      </div>
    );
  }

  if (!session) {
    return (
      <div className="text-white text-xl">
        Пара не найдена
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="space-y-8">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white">
                {
                  session.subject
                    .name
                }
              </h1>

              <p className="text-slate-400 mt-3">
                Группа{" "}
                {
                  session.group
                    .name
                }
              </p>

              <p className="text-slate-400">
                Аудитория{" "}
                {
                  session.room
                    .name
                }
              </p>

              <p className="text-slate-400">
                {format(
                  new Date(
                    session.lessonDate,
                  ),
                  "d MMMM yyyy",
                  {
                    locale: ru,
                  },
                )}
              </p>
            </div>

            <div className="bg-blue-600 text-white px-5 py-3 rounded-2xl font-bold text-lg">
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
            <p className="text-slate-400">
              Всего
            </p>

            <h2 className="text-4xl font-bold text-white mt-2">
              {stats.total}
            </h2>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
            <p className="text-slate-400">
              Присутствуют
            </p>

            <h2 className="text-4xl font-bold text-green-500 mt-2">
              {stats.present}
            </h2>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
            <p className="text-slate-400">
              Опоздали
            </p>

            <h2 className="text-4xl font-bold text-yellow-500 mt-2">
              {stats.late}
            </h2>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
            <p className="text-slate-400">
              Отсутствуют
            </p>

            <h2 className="text-4xl font-bold text-red-500 mt-2">
              {stats.absent}
            </h2>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center gap-3">
          <Search
            size={20}
            className="text-slate-400"
          />

          <input
            type="text"
            placeholder="Поиск студента..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value,
              )
            }
            className="bg-transparent outline-none text-white w-full"
          />
        </div>

        <div className="space-y-4">
          {filteredStudents.map(
            (item) => (
              <div
                key={item.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      {
                        item.student
                          .fullName
                      }
                    </h2>

                    <p className="text-slate-400 mt-1">
                      {
                        item.student
                          .studentCardNo
                      }
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() =>
                        changeStatus(
                          item.id,
                          {
                            status:
                              "PRESENT",
                          },
                        )
                      }
                      className={`px-4 py-2 rounded-xl font-semibold transition ${
                        item.status ===
                        "PRESENT"
                          ? "bg-green-600 text-white"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      PRESENT
                    </button>

                    <button
                      onClick={() =>
                        changeStatus(
                          item.id,
                          {
                            status:
                              "LATE",
                          },
                        )
                      }
                      className={`px-4 py-2 rounded-xl font-semibold transition ${
                        item.status ===
                        "LATE"
                          ? "bg-yellow-500 text-white"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      LATE
                    </button>

                    <button
                      onClick={() =>
                        changeStatus(
                          item.id,
                          {
                            status:
                              "ABSENT",
                          },
                        )
                      }
                      className={`px-4 py-2 rounded-xl font-semibold transition ${
                        item.status ===
                        "ABSENT"
                          ? "bg-red-600 text-white"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      ABSENT
                    </button>

                    <button
                      onClick={() =>
                        changeStatus(
                          item.id,
                          {
                            status:
                              "EXCUSED",
                          },
                        )
                      }
                      className={`px-4 py-2 rounded-xl font-semibold transition ${
                        item.status ===
                        "EXCUSED"
                          ? "bg-blue-600 text-white"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      EXCUSED
                    </button>
                  </div>
                </div>
              </div>
            ),
          )}
        </div>
      </div>
    </AuthGuard>
  );
}