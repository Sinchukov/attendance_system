/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { api } from "@/lib/axios";
import { ScheduleApi } from "@/lib/api/schedule.api";
import { ScheduleTemplate, WeekDay, LessonType } from "@/types/schedule-template";

const WEEKDAYS: { value: WeekDay; label: string }[] = [
  { value: "MONDAY", label: "Понедельник" },
  { value: "TUESDAY", label: "Вторник" },
  { value: "WEDNESDAY", label: "Среда" },
  { value: "THURSDAY", label: "Четверг" },
  { value: "FRIDAY", label: "Пятница" },
  { value: "SATURDAY", label: "Суббота" },
];

const LESSON_TYPES: { value: LessonType; label: string }[] = [
  { value: "LECTURE", label: "Лекция" },
  { value: "PRACTICE", label: "Практика" },
];

const WEEKDAY_ORDER: WeekDay[] = ["MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY"];

export default function AdminSchedulePage() {
  const [schedule, setSchedule] = useState<ScheduleTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filterDay, setFilterDay] = useState<WeekDay | "ALL">("ALL");
  const [teachers, setTeachers] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [pairTimes, setPairTimes] = useState<any[]>([]);
  const [subdivisions, setSubdivisions] = useState<any[]>([]);
  const [form, setForm] = useState({
    weekday: "MONDAY" as WeekDay,
    lessonType: "LECTURE" as LessonType,
    subjectId: 0,
    teacherId: 0,
    roomId: 0,
    pairTimeId: 0,
    groupId: 0,
    subdivisionId: undefined as number | undefined,
  });
  const [error, setError] = useState("");

  useEffect(() => { void loadAll(); }, []);

  async function loadAll() {
    try {
      const [sched, t, s, g, r, pt, sub] = await Promise.all([
        ScheduleApi.getAll(),
        api.get("/teachers"),
        api.get("/subjects"),
        api.get("/academic-groups"),
        api.get("/rooms"),
        api.get("/pair-times"),
        api.get("/subject-subdivisions"),
      ]);
      setSchedule(sched.data);
      setTeachers(t.data);
      setSubjects(s.data);
      setGroups(g.data);
      setRooms(r.data);
      setPairTimes(pt.data);
      setSubdivisions(sub.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate() {
    setError("");
    if (!form.subjectId) return setError("Выберите предмет");
    if (!form.teacherId) return setError("Выберите преподавателя");
    if (!form.groupId) return setError("Выберите группу");
    if (!form.roomId) return setError("Выберите аудиторию");
    if (!form.pairTimeId) return setError("Выберите пару");
    try {
      await ScheduleApi.create({ ...form, subdivisionId: form.subdivisionId || undefined });
      setShowModal(false);
      resetForm();
      await loadAll();
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "Ошибка создания");
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Удалить запись расписания?")) return;
    try {
      await api.delete(`/schedule-templates/${id}`);
      await loadAll();
    } catch (e) { console.error(e); }
  }

  function resetForm() {
    setForm({ weekday: "MONDAY", lessonType: "LECTURE", subjectId: 0, teacherId: 0, roomId: 0, pairTimeId: 0, groupId: 0, subdivisionId: undefined });
    setError("");
  }

  const filteredSchedule = schedule.filter(s => filterDay === "ALL" ? true : s.weekday === filterDay);
  const grouped = WEEKDAY_ORDER.reduce<Record<WeekDay, ScheduleTemplate[]>>((acc, day) => {
    acc[day] = filteredSchedule.filter(s => s.weekday === day).sort((a, b) => (a.pairTime?.pairNumber ?? 0) - (b.pairTime?.pairNumber ?? 0));
    return acc;
  }, {} as Record<WeekDay, ScheduleTemplate[]>);
  const filteredSubdivisions = subdivisions.filter(sd => !form.groupId || sd.groupId === form.groupId);

  if (loading) return <div className="text-white text-xl">Загрузка расписания...</div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white">Расписание</h1>
          <p className="text-slate-400 mt-2">Шаблон расписания занятий</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700 transition px-5 py-3 rounded-xl text-white font-semibold flex items-center gap-2">
          <Plus size={20} /> Добавить пару
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setFilterDay("ALL")} className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${filterDay === "ALL" ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700"}`}>Все дни</button>
        {WEEKDAYS.map(d => (
          <button key={d.value} onClick={() => setFilterDay(d.value)} className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${filterDay === d.value ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700"}`}>{d.label}</button>
        ))}
      </div>

      {WEEKDAYS.filter(d => filterDay === "ALL" || d.value === filterDay).map(({ value: day, label }) => {
        const entries = grouped[day];
        if (!entries || entries.length === 0) return null;
        return (
          <div key={day}>
            <h2 className="text-xl font-bold text-slate-300 mb-3">{label}</h2>
            <div className="space-y-3">
              {entries.map(entry => (
                <div key={entry.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="text-white font-bold text-lg">
                        {entry.pairTime ? `Пара ${entry.pairTime.pairNumber} (${entry.pairTime.startTime}–${entry.pairTime.endTime})` : `Пара #${entry.pairTimeId}`}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${entry.lessonType === "LECTURE" ? "bg-purple-900 text-purple-300" : "bg-teal-900 text-teal-300"}`}>
                        {entry.lessonType === "LECTURE" ? "Лекция" : "Практика"}
                      </span>
                    </div>
                    <p className="text-slate-300">
                      <span className="text-blue-400">{entry.subject?.name ?? `Предмет #${entry.subjectId}`}</span>
                      {" · "}{entry.teacher?.fullName ?? `Преп. #${entry.teacherId}`}
                    </p>
                    <p className="text-slate-400 text-sm">
                      Группа: {entry.group?.name ?? `#${entry.groupId}`}
                      {entry.subdivision && ` · Подгруппа: ${entry.subdivision.name}`}
                      {" · "}Ауд.: {entry.room?.name ?? `#${entry.roomId}`}
                    </p>
                  </div>
                  <button onClick={() => handleDelete(entry.id)} className="bg-red-900/50 hover:bg-red-700 transition p-2.5 rounded-xl text-red-400 hover:text-white">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {filteredSchedule.length === 0 && <p className="text-slate-400">Расписание пустое. Добавьте первую пару.</p>}

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 w-full max-w-lg space-y-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-white">Добавить пару</h2>
            {error && <p className="text-red-400 text-sm bg-red-900/30 border border-red-800 rounded-lg px-4 py-2">{error}</p>}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-slate-400 text-sm mb-1 block">День недели</label>
                <select value={form.weekday} onChange={e => setForm({ ...form, weekday: e.target.value as WeekDay })} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white outline-none">
                  {WEEKDAYS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-slate-400 text-sm mb-1 block">Тип занятия</label>
                <select value={form.lessonType} onChange={e => setForm({ ...form, lessonType: e.target.value as LessonType })} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white outline-none">
                  {LESSON_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="text-slate-400 text-sm mb-1 block">Пара (время)</label>
              <select value={form.pairTimeId} onChange={e => setForm({ ...form, pairTimeId: Number(e.target.value) })} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white outline-none">
                <option value={0}>Выберите пару</option>
                {pairTimes.map((pt: any) => <option key={pt.id} value={pt.id}>Пара {pt.pairNumber} ({pt.startTime}–{pt.endTime})</option>)}
              </select>
            </div>
            <div>
              <label className="text-slate-400 text-sm mb-1 block">Предмет</label>
              <select value={form.subjectId} onChange={e => setForm({ ...form, subjectId: Number(e.target.value) })} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white outline-none">
                <option value={0}>Выберите предмет</option>
                {subjects.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-slate-400 text-sm mb-1 block">Преподаватель</label>
              <select value={form.teacherId} onChange={e => setForm({ ...form, teacherId: Number(e.target.value) })} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white outline-none">
                <option value={0}>Выберите преподавателя</option>
                {teachers.map((t: any) => <option key={t.id} value={t.id}>{t.fullName}</option>)}
              </select>
            </div>
            <div>
              <label className="text-slate-400 text-sm mb-1 block">Группа</label>
              <select value={form.groupId} onChange={e => setForm({ ...form, groupId: Number(e.target.value), subdivisionId: undefined })} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white outline-none">
                <option value={0}>Выберите группу</option>
                {groups.map((g: any) => <option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
            </div>
            {filteredSubdivisions.length > 0 && (
              <div>
                <label className="text-slate-400 text-sm mb-1 block">Подгруппа (необязательно)</label>
                <select value={form.subdivisionId ?? ""} onChange={e => setForm({ ...form, subdivisionId: e.target.value ? Number(e.target.value) : undefined })} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white outline-none">
                  <option value="">Вся группа</option>
                  {filteredSubdivisions.map((sd: any) => <option key={sd.id} value={sd.id}>{sd.name} ({sd.subject?.name})</option>)}
                </select>
              </div>
            )}
            <div>
              <label className="text-slate-400 text-sm mb-1 block">Аудитория</label>
              <select value={form.roomId} onChange={e => setForm({ ...form, roomId: Number(e.target.value) })} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white outline-none">
                <option value={0}>Выберите аудиторию</option>
                {rooms.map((r: any) => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            </div>

            <div className="flex gap-4 justify-end pt-2">
              <button onClick={() => { setShowModal(false); resetForm(); }} className="bg-slate-700 hover:bg-slate-600 transition px-5 py-3 rounded-xl text-white font-semibold">Отмена</button>
              <button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700 transition px-5 py-3 rounded-xl text-white font-semibold">Добавить</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
