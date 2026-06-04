/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Plus, Users, Trash2 } from "lucide-react";
import { api } from "@/lib/axios";
import { subjectSubdivisionsApi } from "@/lib/api/subject-subdivisions";
import { SubjectSubdivision } from "@/types/subject-subdivision";

export default function AdminSubdivisionsPage() {
  const [subdivisions, setSubdivisions] = useState<SubjectSubdivision[]>([]);
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showStudentsModal, setShowStudentsModal] = useState<{
    open: boolean;
    subdivision: SubjectSubdivision | null;
  }>({ open: false, subdivision: null });
  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);

  const [form, setForm] = useState({ name: "", subjectId: 0, groupId: 0 });
  const [formError, setFormError] = useState("");
  const [filterGroup, setFilterGroup] = useState(0);

  useEffect(() => {
    void loadAll();
  }, []);

  async function loadAll() {
    try {
      const [subs, subj, grps, studs] = await Promise.all([
        subjectSubdivisionsApi.getAll(),
        api.get("/subjects"),
        api.get("/academic-groups"),
        api.get("/students"),
      ]);
      setSubdivisions(subs);
      setSubjects(subj.data);
      setGroups(grps.data);
      setStudents(studs.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate() {
    setFormError("");
    if (!form.name.trim()) return setFormError("Введите название подгруппы");
    if (!form.subjectId) return setFormError("Выберите предмет");
    if (!form.groupId) return setFormError("Выберите группу");
    try {
      await subjectSubdivisionsApi.create(form);
      setShowCreateModal(false);
      setForm({ name: "", subjectId: 0, groupId: 0 });
      await loadAll();
    } catch (e: any) {
      setFormError(e?.response?.data?.message ?? "Ошибка создания");
    }
  }

  async function openStudentsModal(subdivision: SubjectSubdivision) {
    const currentIds = (subdivision.students ?? []).map((s: any) => s.studentId ?? s.id);
    setSelectedStudents(currentIds);
    setShowStudentsModal({ open: true, subdivision });
  }

  async function handleSaveStudents() {
    if (!showStudentsModal.subdivision) return;
    try {
      await subjectSubdivisionsApi.addStudents(showStudentsModal.subdivision.id, selectedStudents);
      setShowStudentsModal({ open: false, subdivision: null });
      await loadAll();
    } catch (e: any) {
      alert(e?.response?.data?.message ?? "Ошибка сохранения");
    }
  }

  function toggleStudent(id: number) {
    setSelectedStudents(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  }

  // Students in the subdivision's group
  const groupStudents = showStudentsModal.subdivision
    ? students.filter(s => s.groupId === showStudentsModal.subdivision!.groupId)
    : [];

  const filtered = subdivisions.filter(sd => !filterGroup || sd.groupId === filterGroup);

  if (loading) return <div className="text-white text-xl">Загрузка подгрупп...</div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white">Подгруппы</h1>
          <p className="text-slate-400 mt-2">Деление групп на подгруппы по предметам</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 hover:bg-blue-700 transition px-5 py-3 rounded-xl text-white font-semibold flex items-center gap-2"
        >
          <Plus size={20} /> Создать подгруппу
        </button>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-4">
        <label className="text-slate-400 text-sm">Фильтр по группе:</label>
        <select
          value={filterGroup}
          onChange={e => setFilterGroup(Number(e.target.value))}
          className="bg-slate-900 border border-slate-700 rounded-xl p-3 text-white outline-none"
        >
          <option value={0}>Все группы</option>
          {groups.map((g: any) => <option key={g.id} value={g.id}>{g.name}</option>)}
        </select>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && <p className="text-slate-400">Подгруппы не найдены.</p>}
        {filtered.map(sd => (
          <div key={sd.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <span className="text-white font-bold text-lg">{sd.name}</span>
                <span className="text-xs bg-blue-900 text-blue-300 px-2 py-0.5 rounded-full">
                  {sd.subject?.name ?? `Предмет #${sd.subjectId}`}
                </span>
                <span className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full">
                  {sd.group?.name ?? `Группа #${sd.groupId}`}
                </span>
              </div>
              <p className="text-slate-400 text-sm">
                Студентов: {sd.students?.length ?? 0}
              </p>
            </div>
            <button
              onClick={() => openStudentsModal(sd)}
              className="bg-slate-700 hover:bg-slate-600 transition px-4 py-2 rounded-xl text-white text-sm font-semibold flex items-center gap-2"
            >
              <Users size={16} /> Управление студентами
            </button>
          </div>
        ))}
      </div>

      {/* Create modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 w-full max-w-md space-y-5">
            <h2 className="text-2xl font-bold text-white">Создать подгруппу</h2>
            {formError && <p className="text-red-400 text-sm bg-red-900/30 border border-red-800 rounded-lg px-4 py-2">{formError}</p>}
            <div>
              <label className="text-slate-400 text-sm mb-1 block">Название (например: 1ПГ, 2ПГ)</label>
              <input
                placeholder="Название подгруппы"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white outline-none"
              />
            </div>
            <div>
              <label className="text-slate-400 text-sm mb-1 block">Предмет</label>
              <select value={form.subjectId} onChange={e => setForm({ ...form, subjectId: Number(e.target.value) })} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white outline-none">
                <option value={0}>Выберите предмет</option>
                {subjects.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-slate-400 text-sm mb-1 block">Группа</label>
              <select value={form.groupId} onChange={e => setForm({ ...form, groupId: Number(e.target.value) })} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white outline-none">
                <option value={0}>Выберите группу</option>
                {groups.map((g: any) => <option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={() => { setShowCreateModal(false); setFormError(""); }} className="bg-slate-700 hover:bg-slate-600 transition px-5 py-3 rounded-xl text-white font-semibold">Отмена</button>
              <button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700 transition px-5 py-3 rounded-xl text-white font-semibold">Создать</button>
            </div>
          </div>
        </div>
      )}

      {/* Students assignment modal */}
      {showStudentsModal.open && showStudentsModal.subdivision && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 w-full max-w-md space-y-5 max-h-[80vh] flex flex-col">
            <div>
              <h2 className="text-2xl font-bold text-white">Студенты подгруппы</h2>
              <p className="text-slate-400 text-sm mt-1">
                {showStudentsModal.subdivision.name} · {showStudentsModal.subdivision.subject?.name}
              </p>
            </div>
            <p className="text-slate-400 text-sm">
              Выберите студентов из группы {showStudentsModal.subdivision.group?.name}:
            </p>
            <div className="overflow-y-auto flex-1 space-y-2">
              {groupStudents.length === 0 && (
                <p className="text-slate-500 text-sm">В этой группе нет студентов.</p>
              )}
              {groupStudents.map((student: any) => (
                <label key={student.id} className="flex items-center gap-3 p-3 bg-slate-800 rounded-xl cursor-pointer hover:bg-slate-700 transition">
                  <input
                    type="checkbox"
                    checked={selectedStudents.includes(student.id)}
                    onChange={() => toggleStudent(student.id)}
                    className="w-4 h-4 accent-blue-500"
                  />
                  <span className="text-white">{student.fullName}</span>
                  <span className="text-slate-500 text-xs ml-auto">#{student.studentCardNo}</span>
                </label>
              ))}
            </div>
            <div className="flex gap-3 justify-between items-center pt-2 border-t border-slate-700">
              <span className="text-slate-400 text-sm">Выбрано: {selectedStudents.length}</span>
              <div className="flex gap-3">
                <button onClick={() => setShowStudentsModal({ open: false, subdivision: null })} className="bg-slate-700 hover:bg-slate-600 transition px-5 py-3 rounded-xl text-white font-semibold">Отмена</button>
                <button onClick={handleSaveStudents} className="bg-blue-600 hover:bg-blue-700 transition px-5 py-3 rounded-xl text-white font-semibold">Сохранить</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
