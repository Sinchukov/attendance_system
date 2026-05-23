"use client";

import { useEffect, useState } from "react";

import { attendanceService } from "@/services/attendance.service";

interface StudentAttendance {
  student: {
    id: number;
    fullName: string;
    studentCardNo: string;
  };

  attendance: {
    id: number;
    status: string;
  };
}

export default function AttendancePage() {
  const [students, setStudents] =
    useState<StudentAttendance[]>([]);

  const [loading, setLoading] =
    useState(true);

  // ВРЕМЕННО
  // sessionId = 1

  useEffect(() => {
    async function loadStudents() {
      try {
        const data =
          await attendanceService.getSessionStudents(
            1,
          );

        setStudents(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadStudents();
  }, []);

  async function changeStatus(
    attendanceId: number,
    status:
      | "PRESENT"
      | "LATE"
      | "ABSENT",
  ) {
    try {
      await attendanceService.updateAttendance(
        attendanceId,
        status,
      );

      setStudents((prev) =>
        prev.map((item) =>
          item.attendance.id === attendanceId
            ? {
                ...item,

                attendance: {
                  ...item.attendance,

                  status,
                },
              }
            : item,
        ),
      );
    } catch (error) {
      console.error(error);
    }
  }

  if (loading) {
    return (
      <div className="text-white text-xl">
        Загрузка посещаемости...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">
          Посещаемость
        </h1>

        <p className="text-slate-400 mt-2">
          Управление посещаемостью студентов
        </p>
      </div>

      <div className="space-y-4">
        {students.map((item) => (
          <div
            key={item.student.id}
            className="bg-white rounded-2xl p-6 flex items-center justify-between"
          >
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {item.student.fullName}
              </h2>

              <p className="text-slate-500 mt-1">
                {item.student.studentCardNo}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() =>
                  changeStatus(
                    item.attendance.id,
                    "PRESENT",
                  )
                }
                className={`px-4 py-2 rounded-xl font-semibold transition ${
                  item.attendance.status ===
                  "PRESENT"
                    ? "bg-green-600 text-white"
                    : "bg-green-100 text-green-700"
                }`}
              >
                Присутствует
              </button>

              <button
                onClick={() =>
                  changeStatus(
                    item.attendance.id,
                    "LATE",
                  )
                }
                className={`px-4 py-2 rounded-xl font-semibold transition ${
                  item.attendance.status ===
                  "LATE"
                    ? "bg-yellow-500 text-white"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                Опоздал
              </button>

              <button
                onClick={() =>
                  changeStatus(
                    item.attendance.id,
                    "ABSENT",
                  )
                }
                className={`px-4 py-2 rounded-xl font-semibold transition ${
                  item.attendance.status ===
                  "ABSENT"
                    ? "bg-red-600 text-white"
                    : "bg-red-100 text-red-700"
                }`}
              >
                Отсутствует
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}