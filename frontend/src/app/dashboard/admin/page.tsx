export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white">
          Панель администратора
        </h1>

        <p className="text-slate-400 mt-2">
          Управление системой учета
          посещаемости университета
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
          <p className="text-slate-400">
            Студенты
          </p>

          <h2 className="text-4xl font-bold text-white mt-3">
            Управление
          </h2>
        </div>

        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
          <p className="text-slate-400">
            Преподаватели
          </p>

          <h2 className="text-4xl font-bold text-white mt-3">
            Управление
          </h2>
        </div>

        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
          <p className="text-slate-400">
            Группы
          </p>

          <h2 className="text-4xl font-bold text-white mt-3">
            Управление
          </h2>
        </div>

        <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
          <p className="text-slate-400">
            Аудитории
          </p>

          <h2 className="text-4xl font-bold text-white mt-3">
            Управление
          </h2>
        </div>
      </div>
    </div>
  );
}