/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Link from "next/link";

import { authService } from "@/services/auth.service";

export default function RegisterPage() {
  const [email, setEmail] = useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [success, setSuccess] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleRegister = async () => {
    try {
      setLoading(true);

      setError("");

      await authService.register({
        email,
        password,
        role: "TEACHER",
      });

      setSuccess(true);
    } catch (error: any) {
      console.error(error);

      setError(
        error.message ||
          "Ошибка регистрации",
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <main className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 w-full max-w-md text-center">
          <div className="text-6xl mb-4">
            ✅
          </div>

          <h1 className="text-3xl font-bold text-white mb-4">
            Регистрация успешна
          </h1>

          <p className="text-slate-400 mb-6">
            Ваш аккаунт преподавателя
            был успешно создан
          </p>

          <Link
            href="/login"
            className="block w-full bg-blue-600 hover:bg-blue-700 transition p-3 rounded-xl text-white font-semibold"
          >
            Войти в аккаунт
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="bg-slate-900 p-8 rounded-2xl w-full max-w-md border border-slate-800">
        <h1 className="text-3xl font-bold text-white mb-2 text-center">
          Регистрация
        </h1>

        <p className="text-slate-400 mb-6 text-center">
          Создание аккаунта преподавателя
        </p>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-xl bg-slate-800 text-white outline-none border border-transparent focus:border-blue-500"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <input
            type="password"
            placeholder="Пароль"
            className="w-full p-3 rounded-xl bg-slate-800 text-white outline-none border border-transparent focus:border-blue-500"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 transition p-3 rounded-xl text-white font-semibold disabled:opacity-50"
          >
            {loading
              ? "Создание аккаунта..."
              : "Зарегистрироваться"}
          </button>

          <Link
            href="/login"
            className="block text-center text-slate-400 hover:text-white transition text-sm"
          >
            Уже есть аккаунт? Войти
          </Link>
        </div>
      </div>
    </main>
  );
}