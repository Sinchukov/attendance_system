/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";

import { FullscreenLoader } from "@/components/ui/fullscreen-loader";

export default function LoginPage() {
  const router = useRouter();

  const { setAuth } = useAuthStore();

  const [email, setEmail] = useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleLogin = async () => {
    try {
      setLoading(true);

      setError("");

      const data =
        await authService.login({
          email,
          password,
        });

      setAuth(
        data.user,
        data.access_token,
      );

      await new Promise((resolve) =>
        setTimeout(resolve, 1200),
      );

      if (data.user.role === "ADMIN") {
        router.push("/dashboard/admin");
      } else {
        router.push("/dashboard/teacher");
      }
    } catch (error: any) {
      console.error(error);

      setError(
        error.message || "Ошибка входа",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <FullscreenLoader />}

      <main className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="bg-slate-900 p-8 rounded-2xl w-full max-w-md border border-slate-800">
          <h1 className="text-3xl font-bold text-white mb-2 text-center">
                    Вход
          </h1>

          <p className="text-slate-400 mb-6 text-center">
                Войдите в систему
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
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 transition p-3 rounded-xl text-white font-semibold disabled:opacity-50"
            >
              Войти
            </button>

            <Link
              href="/register"
              className="block text-center text-slate-400 hover:text-white transition text-sm"
            >
              Нет аккаунта? Регистрация
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}