"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import { api } from "@/lib/axios";

interface Subject {
  id: number;
  name: string;
}

export default function AdminSubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState("");

  useEffect(() => {
    void loadSubjects();
  }, []);

  async function loadSubjects() {
    try {
      const res = await api.get("/subjects");
      setSubjects(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate() {
    if (!name.trim()) return;
    try {
      const res = await api.post("/subjects", { name });
      setSubjects((prev) => [...prev, res.data]);
      resetForm();
    } catch (error) {
      console.error(error);
    }
  }

  async function handleUpdate() {
    if (!editingId || !name.trim()) return;
    try {
      const res = await api.patch(`/subjects/${editingId}`, { name });
      setSubjects((prev) =>
        prev.map((s) => (s.id === editingId ? res.data : s))
      );
      resetForm();
    } catch (error) {
      console.error(error);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Удалить предмет?")) return;
    try {
      await api.delete(`/subjects/${id}`);
      setSubjects((prev) => prev.filter((s) => s.id !== id));
    } catch (error) {
      console.error(error);
    }
  }

  function startEdit(subject: Subject) {
    setEditingId(subject.id);
    setName(subject.name);
    setIsCreating(true);
  }

  function resetForm() {
    setName("");
    setEditingId(null);
    setIsCreating(false);
  }

  if (loading) {
    return <div className="text-white text-xl">Загрузка предметов...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white">Предметы</h1>
          <p className="text-slate-400 mt-2">Управление учебными предметами</p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="bg-blue-600 hover:bg-blue-700 transition px-5 py-3 rounded-xl text-white font-semibold flex items-center gap-2"
        >
          <Plus size={20} />
          Добавить
        </button>
      </div>

      {isCreating && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
          <h2 className="text-2xl font-bold text-white">
            {editingId ? "Редактирование предмета" : "Новый предмет"}
          </h2>
          <input
            type="text"
            placeholder="Название предмета"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white outline-none"
          />
          <div className="flex gap-4">
            <button
              onClick={editingId ? handleUpdate : handleCreate}
              className="bg-green-600 hover:bg-green-700 transition px-5 py-3 rounded-xl text-white font-semibold"
            >
              {editingId ? "Сохранить" : "Создать"}
            </button>
            <button
              onClick={resetForm}
              className="bg-slate-700 hover:bg-slate-600 transition px-5 py-3 rounded-xl text-white font-semibold"
            >
              Отмена
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {subjects.length === 0 && (
          <p className="text-slate-400">Предметы ещё не добавлены.</p>
        )}
        {subjects.map((subject) => (
          <div
            key={subject.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-center justify-between"
          >
            <h2 className="text-xl font-bold text-white">{subject.name}</h2>
            <div className="flex items-center gap-3">
              <button
                onClick={() => startEdit(subject)}
                className="bg-yellow-500 hover:bg-yellow-600 transition p-3 rounded-xl text-white"
              >
                <Pencil size={18} />
              </button>
              <button
                onClick={() => handleDelete(subject.id)}
                className="bg-red-600 hover:bg-red-700 transition p-3 rounded-xl text-white"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
