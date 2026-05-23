import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-10">
      <div className="max-w-2xl text-center">
        <h1 className="text-6xl font-bold mb-6">
          Attendance System
        </h1>

        <p className="text-slate-400 text-lg mb-10">
          Университетская система учета посещаемости
          с использованием биометрических терминалов
          Hikvision и автоматической фиксацией посещения.
        </p>

        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="bg-blue-600 hover:bg-blue-700 transition px-6 py-3 rounded-xl"
          >
            Войти
          </Link>

          <Link
            href="/register"
            className="border border-slate-700 hover:bg-slate-800 transition px-6 py-3 rounded-xl"
          >
            Регистрация
          </Link>
        </div>
      </div>
    </main>
  );
}