/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { api } from "@/lib/axios";

interface Teacher {
  id: number;
  fullName: string;
  cardNo: string | null;
  user: {
    id: number;
    email: string;
    isActive: boolean;
  };
}

export default function AdminTeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    cardNo: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    void loadTeachers();
  }, []);

  async function loadTeachers() {
    try {
      const res = await api.get("/teachers");
      setTeachers(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate() {
    setError("");
    if (!form.fullName.trim()) return setError("Введите ФИО");
    if (!form.email.trim()) return setError("Введите email");
    if (form.password.length < 6) return setError("Пароль минимум 6 символов");

    try {
      await api.post("/teachers", {
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        cardNo: form.cardNo || undefined,
      });
      setShowModal(false);
      setForm({ fullName: "", email: "", password: "", cardNo: "" });
      await loadTeachers();
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "Ошибка создания");
    }
  }

  async function handleToggleActive(userId: number, isActive: boolean) {
    try {
      await api.patch(`/admin-dashboard/users/${userId}/${isActive ? "deactivate" : "activate"}`);
      await loadTeachers();
    } catch (e) {
      console.error(e);
    }
  }

  if (loading) {
    return <div className="text-white text-xl">Загрузка преподавателей...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white">Преподаватели</h1>
          <p className="text-slate-400 mt-2">Управление преподавателями</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 transition px-5 py-3 rounded-xl text-white font-semibold flex items-center gap-2"
        >
          <Plus size={20} />
          Добавить
        </button>
      </div>

      <div className="space-y-4">
        {teachers.length === 0 && (
          <p className="text-slate-400">Преподаватели ещё не добавлены.</p>
        )}
        {teachers.map((teacher) => (
          <div
            key={teacher.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-center justify-between"
          >
            <div>
              <p className="text-xl font-bold text-white">{teacher.fullName}</p>
              <p className="text-slate-400 text-sm mt-1">{teacher.user.email}</p>
              {teacher.cardNo && (
                <p className="text-slate-500 text-xs mt-1">Карта: {teacher.cardNo}</p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`text-xs px-3 py-1 rounded-full font-semibold ${
                  teacher.user.isActive
                    ? "bg-green-900 text-green-300"
                    : "bg-red-900 text-red-300"
                }`}
              >
                {teacher.user.isActive ? "Активен" : "Деактивирован"}
              </span>
              <button
                onClick={() =>
                  handleToggleActive(teacher.user.id, teacher.user.isActive)
                }
                className={`transition px-4 py-2 rounded-xl text-white text-sm font-semibold ${
                  teacher.user.isActive
                    ? "bg-yellow-600 hover:bg-yellow-700"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {teacher.user.isActive ? "Деактивировать" : "Активировать"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 w-[480px] space-y-5">
            <h2 className="text-2xl font-bold text-white">Новый преподаватель</h2>

            {error && (
              <p className="text-red-400 text-sm bg-red-900/30 border border-red-800 rounded-lg px-4 py-2">
                {error}
              </p>
            )}

            <input
              placeholder="ФИО"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white outline-none"
            />
            <input
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white outline-none"
            />
            <input
              placeholder="Пароль (минимум 6 символов)"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white outline-none"
            />
            <input
              placeholder="Номер карты (необязательно)"
              value={form.cardNo}
              onChange={(e) => setForm({ ...form, cardNo: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white outline-none"
            />

            <div className="flex gap-4 justify-end pt-2">
              <button
                onClick={() => { setShowModal(false); setError(""); }}
                className="bg-slate-700 hover:bg-slate-600 transition px-5 py-3 rounded-xl text-white font-semibold"
              >
                Отмена
              </button>
              <button
                onClick={handleCreate}
                className="bg-blue-600 hover:bg-blue-700 transition px-5 py-3 rounded-xl text-white font-semibold"
              >
                Создать
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}