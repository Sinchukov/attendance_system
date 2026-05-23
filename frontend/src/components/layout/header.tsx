"use client";

export function Header() {
  const currentDate =
    new Date().toLocaleDateString(
      "ru-RU",
      {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      },
    );

  return (
    <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">
          Панель преподавателя
        </h2>

        <p className="text-slate-500 capitalize">
          {currentDate}
        </p>
      </div>

      <div className="w-11 h-11 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
        T
      </div>
    </header>
  );
}