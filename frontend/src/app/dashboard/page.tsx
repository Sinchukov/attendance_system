"use client";

import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [user, setUser] =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    useState<any>(null);

  useEffect(() => {
    const token =
      localStorage.getItem(
        "access_token",
      );

    if (!token) {
      return;
    }

    fetch(
      "http://localhost:3000/profile",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
      })
      .catch(console.error);
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-white p-10">
      <h1 className="text-4xl font-bold mb-6">
        Личный кабинет
      </h1>

      {!user ? (
        <p>Загрузка...</p>
      ) : (
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
          <p className="mb-2">
            Email: {user.email}
          </p>

          <p>
            Роль: {user.role}
          </p>
        </div>
      )}
    </main>
  );
}