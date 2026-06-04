/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Clock } from "lucide-react";
import { pairTimesApi } from "@/lib/api/pair-times";
import { PairTime } from "@/types/pair-time";

export default function AdminPairTimesPage() {
  const [pairTimes, setPairTimes] = useState<PairTime[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ pairNumber: 1, startTime: "", endTime: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    void loadAll();
  }, []);

  async function loadAll() {
    try {
      const data = await pairTimesApi.getAll();
      setPairTimes(data.sort((a, b) => a.pairNumber - b.pairNumber));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditingId(null);
    setForm({ pairNumber: (pairTimes.length > 0 ? Math.max(...pairTimes.map(p => p.pairNumber)) + 1 : 1), startTime: "", endTime: "" });
    setError("");
    setShowModal(true);
  }

  function openEdit(pt: PairTime) {
    setEditingId(pt.id);
    setForm({ pairNumber: pt.pairNumber, startTime: pt.startTime, endTime: pt.endTime });
    setError("");
    setShowModal(true);
  }

  async function handleSave() {
    setError("");
    if (!form.startTime.trim()) return setError("Введите время начала");
    if (!form.endTime.trim()) return setError("Введите время окончания");
    if (form.pairNumber < 1) return setError("Номер пары должен быть больше 0");

    try {
      if (editingId) {
        await pairTimesApi.update(editingId, form);
      } else {
        await pairTimesApi.create(form);
      }
      setShowModal(false);
      await loadAll();
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "Ошибка сохранения");
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Удалить пару? Расписание, привязанное к этой паре, может быть нарушено.")) return;
    try {
      await pairTimesApi.delete(id);
      await loadAll();
    } catch (e: any) {
      alert(e?.response?.data?.message ?? "Ошибка удаления");
    }
  }

  if (loading) return <div className="text-white text-xl">Загрузка расписания пар...</div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white">Расписание пар</h1>
          <p className="text-slate-400 mt-2">Временные слоты для занятий</p>
        </div>
        <button
          onClick={openCreate}
          className="bg-blue-600 hover:bg-blue-700 transition px-5 py-3 rounded-xl text-white font-semibold flex items-center gap-2"
        >
          <Plus size={20} /> Добавить пару
        </button>
      </div>

      <div className="space-y-3">
        {pairTimes.length === 0 && (
          <p className="text-slate-400">Пары ещё не добавлены.</p>
        )}
        {pairTimes.map((pt) => (
          <div
            key={pt.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="bg-slate-800 p-3 rounded-xl">
                <Clock size={22} className="text-blue-400" />
              </div>
              <div>
                <p className="text-white font-bold text-lg">
                  Пара {pt.pairNumber}
                </p>
                <p className="text-slate-400 text-sm">
                  {pt.startTime} — {pt.endTime}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => openEdit(pt)}
                className="bg-yellow-500 hover:bg-yellow-600 transition p-3 rounded-xl text-white"
              >
                <Pencil size={18} />
              </button>
              <button
                onClick={() => handleDelete(pt.id)}
                className="bg-red-600 hover:bg-red-700 transition p-3 rounded-xl text-white"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 w-[420px] space-y-5">
            <h2 className="text-2xl font-bold text-white">
              {editingId ? "Редактировать пару" : "Новая пара"}
            </h2>

            {error && (
              <p className="text-red-400 text-sm bg-red-900/30 border border-red-800 rounded-lg px-4 py-2">
                {error}
              </p>
            )}

            <div>
              <label className="text-slate-400 text-sm mb-1 block">Номер пары</label>
              <input
                type="number"
                min={1}
                value={form.pairNumber}
                onChange={(e) => setForm({ ...form, pairNumber: Number(e.target.value) })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-slate-400 text-sm mb-1 block">Начало</label>
                <input
                  type="time"
                  value={form.startTime}
                  onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white outline-none"
                />
              </div>
              <div>
                <label className="text-slate-400 text-sm mb-1 block">Конец</label>
                <input
                  type="time"
                  value={form.endTime}
                  onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white outline-none"
                />
              </div>
            </div>

            <div className="flex gap-4 justify-end">
              <button
                onClick={() => { setShowModal(false); setError(""); }}
                className="bg-slate-700 hover:bg-slate-600 transition px-5 py-3 rounded-xl text-white font-semibold"
              >
                Отмена
              </button>
              <button
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-700 transition px-5 py-3 rounded-xl text-white font-semibold"
              >
                {editingId ? "Сохранить" : "Создать"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
