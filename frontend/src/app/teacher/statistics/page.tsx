"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/axios";

interface Group {
  id: number;
  name: string;
}

interface Stats {
  total: number;
  present: number;
  absent: number;
  late: number;
}

export default function TeacherStatisticsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(false);

  useEffect(() => {
    api.get("/teacher-dashboard/groups")
      .then(res => {
        setGroups(res.data);
        if (res.data.length > 0) setSelectedGroup(res.data[0].id);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedGroup) return;
    setStatsLoading(true);
    api.get(`/teacher-dashboard/groups/${selectedGroup}/statistics`)
      .then(res => setStats(res.data))
      .catch(console.error)
      .finally(() => setStatsLoading(false));
  }, [selectedGroup]);

  const pct = (n: number) => stats?.total ? Math.round((n / stats.total) * 100) : 0;

  if (loading) return <div className="text-white text-xl">Загрузка...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white">Статистика</h1>
        <p className="text-slate-400 mt-2">Посещаемость по группам</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {groups.map(g => (
          <button
            key={g.id}
            onClick={() => setSelectedGroup(g.id)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
              selectedGroup === g.id ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            {g.name}
          </button>
        ))}
      </div>

      {statsLoading && <div className="text-slate-400">Загрузка статистики...</div>}

      {stats && !statsLoading && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900 border-l-4 border-slate-500 rounded-2xl p-6">
              <div className="text-slate-400 text-sm">Всего отметок</div>
              <div className="text-3xl font-bold text-white mt-2">{stats.total}</div>
            </div>
            <div className="bg-slate-900 border-l-4 border-green-500 rounded-2xl p-6">
              <div className="text-slate-400 text-sm">Присутствовали</div>
              <div className="text-3xl font-bold text-green-400 mt-2">{stats.present}</div>
            </div>
            <div className="bg-slate-900 border-l-4 border-amber-500 rounded-2xl p-6">
              <div className="text-slate-400 text-sm">Опоздали</div>
              <div className="text-3xl font-bold text-amber-400 mt-2">{stats.late}</div>
            </div>
            <div className="bg-slate-900 border-l-4 border-red-500 rounded-2xl p-6">
              <div className="text-slate-400 text-sm">Отсутствовали</div>
              <div className="text-3xl font-bold text-red-400 mt-2">{stats.absent}</div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
            <h2 className="text-white font-semibold">Распределение посещаемости</h2>
            {stats.total > 0 ? (
              <div className="space-y-4">
                {[
                  { label: "Присутствовали", value: stats.present, color: "bg-green-500" },
                  { label: "Опоздали", value: stats.late, color: "bg-amber-500" },
                  { label: "Отсутствовали", value: stats.absent, color: "bg-red-500" },
                ].map(row => (
                  <div key={row.label}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-slate-300">{row.label}</span>
                      <span className="text-slate-400">{row.value} · {pct(row.value)}%</span>
                    </div>
                    <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${row.color}`}
                        style={{ width: `${pct(row.value)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400">Данных пока нет.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
