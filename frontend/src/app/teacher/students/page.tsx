"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/axios";
import { Search } from "lucide-react";

interface Group {
  id: number;
  name: string;
}

interface Student {
  id: number;
  fullName: string;
  studentCardNo: string;
  group: { name: string };
}

export default function TeacherStudentsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

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
    api.get(`/teacher-dashboard/groups/${selectedGroup}/students`)
      .then(res => setStudents(res.data))
      .catch(console.error);
  }, [selectedGroup]);

  const filtered = useMemo(() =>
    students.filter(s =>
      s.fullName.toLowerCase().includes(search.toLowerCase()) ||
      s.studentCardNo.includes(search)
    ), [students, search]);

  if (loading) return <div className="text-white text-xl">Загрузка...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white">Студенты</h1>
        <p className="text-slate-400 mt-2">Студенты ваших групп</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {groups.map(g => (
          <button
            key={g.id}
            onClick={() => { setSelectedGroup(g.id); setSearch(""); }}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${
              selectedGroup === g.id ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            {g.name}
          </button>
        ))}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
        <Search size={18} className="text-slate-400 shrink-0" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Поиск по имени или номеру карты..."
          className="bg-transparent outline-none text-white w-full placeholder:text-slate-500"
        />
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && <p className="text-slate-400">Студенты не найдены.</p>}
        {filtered.map((student, i) => (
          <div
            key={student.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 font-semibold text-sm shrink-0">
                {i + 1}
              </div>
              <div>
                <p className="text-white font-semibold">{student.fullName}</p>
                <p className="text-slate-400 text-sm">{student.group.name}</p>
              </div>
            </div>
            <span className="text-slate-500 text-sm font-mono bg-slate-800 px-3 py-1.5 rounded-lg">
              #{student.studentCardNo}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
