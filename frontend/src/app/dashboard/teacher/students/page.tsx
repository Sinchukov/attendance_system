"use client";

import { useEffect, useState } from "react";

import { useAuthStore } from "@/store/auth.store";

interface Student {
  id: number;

  fullName: string;

  studentCardNo: string;

  group: {
    name: string;
  };
}

export default function StudentsPage() {
  const [students, setStudents] =
    useState<Student[]>([]);

  const [loading, setLoading] =
    useState(true);

  const user = useAuthStore(
    (state) => state.user,
  );

  useEffect(() => {
    async function loadStudents() {
      try {
        const token =
          localStorage.getItem(
            "token",
          );

        const response =
          await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/students`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );

        const data =
          await response.json();

        setStudents(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    void loadStudents();
  }, [user]);

  if (loading) {
    return (
      <div className="text-white text-xl">
        Загрузка студентов...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white">
          Студенты
        </h1>

        <p className="text-slate-400 mt-2">
          Список студентов университета
        </p>
      </div>

      <div className="grid gap-4">
        {students.map((student) => (
          <div
            key={student.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-center justify-between"
          >
            <div>
              <h2 className="text-xl font-semibold text-white">
                {student.fullName}
              </h2>

              <p className="text-slate-400 mt-1">
                Группа{" "}
                {student.group.name}
              </p>
            </div>

            <div className="bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold">
              {student.studentCardNo}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}