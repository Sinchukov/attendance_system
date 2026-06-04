/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { KeyRound, UserCheck, UserX } from "lucide-react";
import { api } from "@/lib/axios";

interface User {
  id: number;
  email: string;
  role: "ADMIN" | "TEACHER";
  isActive: boolean;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [passwordModal, setPasswordModal] = useState<{
    open: boolean;
    userId: number | null;
    email: string;
  }>({ open: false, userId: null, email: "" });
  const [newPassword, setNewPassword] = useState("");
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState(false);

  async function loadUsers() {
    try {
      const res = await api.get("/admin-dashboard/users");
      setUsers(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    api.get("/admin-dashboard/users")
      .then(res => setUsers(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  async function toggleActive(user: User) {
    try {
      await api.patch(
        `/admin-dashboard/users/${user.id}/${user.isActive ? "deactivate" : "activate"}`
      );
      await loadUsers();
    } catch (e) {
      console.error(e);
    }
  }

  async function handleChangePassword() {
    setPwError("");
    if (newPassword.length < 6) return setPwError("Минимум 6 символов");
    try {
      await api.patch(`/admin-dashboard/users/${passwordModal.userId}/password`, {
        password: newPassword,
      });
      setPwSuccess(true);
      setTimeout(() => {
        setPasswordModal({ open: false, userId: null, email: "" });
        setPwSuccess(false);
        setNewPassword("");
      }, 1500);
    } catch (e: any) {
      setPwError(e?.response?.data?.message ?? "Ошибка");
    }
  }

  const filtered = users.filter(
    (u) =>
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="text-white text-xl">Загрузка пользователей...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white">Пользователи</h1>
        <p className="text-slate-400 mt-2">Управление учётными записями системы</p>
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Поиск по email или роли..."
        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-white outline-none placeholder:text-slate-500"
      />

      <div className="space-y-3">
        {filtered.length === 0 && (
          <p className="text-slate-400">Пользователи не найдены.</p>
        )}
        {filtered.map((user) => (
          <div
            key={user.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between"
          >
            <div>
              <p className="text-white font-semibold text-lg">{user.email}</p>
              <div className="flex items-center gap-3 mt-1">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                    user.role === "ADMIN"
                      ? "bg-purple-900 text-purple-300"
                      : "bg-blue-900 text-blue-300"
                  }`}
                >
                  {user.role}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                    user.isActive
                      ? "bg-green-900 text-green-300"
                      : "bg-red-900 text-red-300"
                  }`}
                >
                  {user.isActive ? "Активен" : "Деактивирован"}
                </span>
                <span className="text-slate-500 text-xs">ID: {user.id}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  setPasswordModal({ open: true, userId: user.id, email: user.email })
                }
                className="bg-slate-700 hover:bg-slate-600 transition p-2.5 rounded-xl text-slate-300"
                title="Сменить пароль"
              >
                <KeyRound size={18} />
              </button>
              <button
                onClick={() => toggleActive(user)}
                className={`transition px-4 py-2 rounded-xl text-white text-sm font-semibold flex items-center gap-2 ${
                  user.isActive
                    ? "bg-yellow-600 hover:bg-yellow-700"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {user.isActive ? (
                  <>
                    <UserX size={16} />
                    Деактивировать
                  </>
                ) : (
                  <>
                    <UserCheck size={16} />
                    Активировать
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {passwordModal.open && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 w-[420px] space-y-5">
            <h2 className="text-2xl font-bold text-white">Смена пароля</h2>
            <p className="text-slate-400 text-sm">{passwordModal.email}</p>
            {pwError && (
              <p className="text-red-400 text-sm bg-red-900/30 border border-red-800 rounded-lg px-4 py-2">
                {pwError}
              </p>
            )}
            {pwSuccess && (
              <p className="text-green-400 text-sm bg-green-900/30 border border-green-800 rounded-lg px-4 py-2">
                Пароль успешно изменён!
              </p>
            )}
            <input
              type="password"
              placeholder="Новый пароль (минимум 6 символов)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white outline-none"
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setPasswordModal({ open: false, userId: null, email: "" });
                  setNewPassword("");
                  setPwError("");
                }}
                className="bg-slate-700 hover:bg-slate-600 transition px-5 py-3 rounded-xl text-white font-semibold"
              >
                Отмена
              </button>
              <button
                onClick={handleChangePassword}
                className="bg-blue-600 hover:bg-blue-700 transition px-5 py-3 rounded-xl text-white font-semibold"
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
