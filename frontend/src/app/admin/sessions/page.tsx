/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Plus, XCircle, RefreshCw, Zap } from "lucide-react";
import { api } from "@/lib/axios";
import { LessonSessionsApi } from "@/lib/api/lesson-sessions.api";
import { LessonSession, LessonType } from "@/types/lesson-session";

const LESSON_TYPES: { value: LessonType; label: string }[] = [
  { value: "LECTURE", label: "Лекция" },
  { value: "PRACTICE", label: "Практика" },
];

export default function AdminSessionsPage() {
  const [sessions, setSessions] = useState<LessonSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [generateDate, setGenerateDate] = useState("");
  const [generateLoading, setGenerateLoading] = useState(false);
  const [generateMsg, setGenerateMsg] = useState("");

  const [teachers, setTeachers] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [pairTimes, setPairTimes] = useState<any[]>([]);
  const [subdivisions, setSubdivisions] = useState<any[]>([]);

  const [form, setForm] = useState({
    lessonDate: "",
    lessonType: "LECTURE" as LessonType,
    subjectId: 0,
    teacherId: 0,
    roomId: 0,
    pairTimeId: 0,
    groupId: 0,
    subdivisionId: undefined as number | undefined,
  });
  const [formError, setFormError] = useState("");

  const [cancelModal, setCancelModal] = useState<{ open: boolean; sessionId: number | null }>({ open: false, sessionId: null });
  const [cancelReason, setCancelReason] = useState("");

  const [filterDate, setFilterDate] = useState("");

  useEffect(() => {
    void loadAll();
  }, []);

  async function loadAll() {
    try {
      const [sess, t, s, g, r, pt, sub] = await Promise.all([
        LessonSessionsApi.getAll(),
        api.get("/teachers"),
        api.get("/subjects"),
        api.get("/academic-groups"),
        api.get("/rooms"),
        api.get("/pair-times"),
        api.get("/subject-subdivisions"),
      ]);
      setSessions(sess.data);
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

  async function handleGenerate() {
    if (!generateDate) return setGenerateMsg("Выберите дату");
    setGenerateLoading(true);
    setGenerateMsg("");
    try {
      const res = await LessonSessionsApi.generate(generateDate);
      const count = Array.isArray(res.data) ? res.data.length : "?";
      setGenerateMsg(`Сгенерировано ${count} занятий на ${generateDate}`);
      await loadAll();
    } catch (e: any) {
      setGenerateMsg(e?.response?.data?.message ?? "Ошибка генерации");
    } finally {
      setGenerateLoading(false);
    }
  }

  async function handleCreate() {
    setFormError("");
    if (!form.lessonDate) return setFormError("Выберите дату");
    if (!form.subjectId) return setFormError("Выберите предмет");
    if (!form.teacherId) return setFormError("Выберите преподавателя");
    if (!form.groupId) return setFormError("Выберите группу");
    if (!form.roomId) return setFormError("Выберите аудиторию");
    if (!form.pairTimeId) return setFormError("Выберите пару");
    try {
      await LessonSessionsApi.create({ ...form, subdivisionId: form.subdivisionId || undefined });
      setShowCreateModal(false);
      resetForm();
      await loadAll();
    } catch (e: any) {
      setFormError(e?.response?.data?.message ?? "Ошибка создания");
    }
  }

  async function handleCancel() {
    if (!cancelModal.sessionId) return;
    try {
      await LessonSessionsApi.cancel(cancelModal.sessionId, cancelReason);
      setCancelModal({ open: false, sessionId: null });
      setCancelReason("");
      await loadAll();
    } catch (e) {
      console.error(e);
    }
  }

  function resetForm() {
    setForm({ lessonDate: "", lessonType: "LECTURE", subjectId: 0, teacherId: 0, roomId: 0, pairTimeId: 0, groupId: 0, subdivisionId: undefined });
    setFormError("");
  }

  const filteredSessions = sessions
    .filter(s => !filterDate || s.lessonDate.startsWith(filterDate))
    .sort((a, b) => new Date(b.lessonDate).getTime() - new Date(a.lessonDate).getTime());

  const filteredSubdivisions = subdivisions.filter(sd => !form.groupId || sd.groupId === form.groupId);

  if (loading) return <div className="text-white text-xl">Загрузка занятий...</div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white">Занятия</h1>
          <p className="text-slate-400 mt-2">Список занятий ({sessions.length} всего)</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 hover:bg-blue-700 transition px-5 py-3 rounded-xl text-white font-semibold flex items-center gap-2"
        >
          <Plus size={20} /> Добавить занятие
        </button>
      </div>

      {/* Generate from template */}
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <Zap size={20} className="text-amber-400" />
          <h2 className="text-lg font-bold text-white">Генерация по шаблону</h2>
        </div>
        <p className="text-slate-400 text-sm">
          Автоматически создаёт занятия на выбранный день по шаблону расписания. Занятия для всех преподавателей, у которых есть пары в этот день недели.
        </p>
        <div className="flex items-center gap-4 flex-wrap">
          <input
            type="date"
            value={generateDate}
            onChange={e => setGenerateDate(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-xl p-3 text-white outline-none"
          />
          <button
            onClick={handleGenerate}
            disabled={generateLoading}
            className="bg-amber-600 hover:bg-amber-700 disabled:opacity-50 transition px-5 py-3 rounded-xl text-white font-semibold flex items-center gap-2"
          >
            <RefreshCw size={18} className={generateLoading ? "animate-spin" : ""} />
            {generateLoading ? "Генерация..." : "Сгенерировать"}
          </button>
          {generateMsg && (
            <span className={`text-sm px-3 py-1 rounded-lg ${generateMsg.includes("Ошибка") ? "text-red-400 bg-red-900/30" : "text-green-400 bg-green-900/30"}`}>
              {generateMsg}
            </span>
          )}
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-4">
        <label className="text-slate-400 text-sm">Фильтр по дате:</label>
        <input
          type="date"
          value={filterDate}
          onChange={e => setFilterDate(e.target.value)}
          className="bg-slate-900 border border-slate-700 rounded-xl p-3 text-white outline-none"
        />
        {filterDate && (
          <button onClick={() => setFilterDate("")} className="text-slate-400 hover:text-white text-sm transition">
            Сбросить
          </button>
        )}
      </div>

      {/* Sessions list */}
      <div className="space-y-3">
        {filteredSessions.length === 0 && <p className="text-slate-400">Занятий не найдено.</p>}
        {filteredSessions.map(session => (
          <div
            key={session.id}
            className={`bg-slate-900 border rounded-2xl p-5 flex items-center justify-between ${session.isCancelled ? "border-red-900/50 opacity-60" : "border-slate-800"}`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-white font-bold">
                  {new Date(session.lessonDate).toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" })}
                </span>
                <span className="text-slate-400 text-sm">
                  {session.pairTime ? `Пара ${session.pairTime.pairNumber} (${session.pairTime.startTime}–${session.pairTime.endTime})` : `Пара #${session.pairTimeId}`}
                </span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${session.lessonType === "LECTURE" ? "bg-purple-900 text-purple-300" : "bg-teal-900 text-teal-300"}`}>
                  {session.lessonType === "LECTURE" ? "Лекция" : "Практика"}
                </span>
                {session.isCancelled && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-red-900 text-red-300">Отменено</span>
                )}
              </div>
              <p className="text-slate-300">
                <span className="text-blue-400">{session.subject?.name ?? `Предмет #${session.subjectId}`}</span>
                {" · "}{session.teacher?.fullName ?? `Преп. #${session.teacherId}`}
              </p>
              <p className="text-slate-400 text-sm">
                Группа: {session.group?.name ?? `#${session.groupId}`}
                {session.subdivision && ` · Подгруппа: ${session.subdivision.name}`}
                {" · "}Ауд.: {session.room?.name ?? `#${session.roomId}`}
              </p>
              {session.isCancelled && session.cancellationReason && (
                <p className="text-red-400 text-sm">Причина: {session.cancellationReason}</p>
              )}
            </div>
            {!session.isCancelled && (
              <button
                onClick={() => setCancelModal({ open: true, sessionId: session.id })}
                className="bg-red-900/50 hover:bg-red-700 transition p-2.5 rounded-xl text-red-400 hover:text-white"
                title="Отменить занятие"
              >
                <XCircle size={18} />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Create modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 w-full max-w-lg space-y-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-white">Новое занятие</h2>
            {formError && <p className="text-red-400 text-sm bg-red-900/30 border border-red-800 rounded-lg px-4 py-2">{formError}</p>}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-slate-400 text-sm mb-1 block">Дата</label>
                <input type="datetime-local" value={form.lessonDate} onChange={e => setForm({ ...form, lessonDate: e.target.value })} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white outline-none" />
              </div>
              <div>
                <label className="text-slate-400 text-sm mb-1 block">Тип занятия</label>
                <select value={form.lessonType} onChange={e => setForm({ ...form, lessonType: e.target.value as LessonType })} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white outline-none">
                  {LESSON_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-slate-400 text-sm mb-1 block">Пара</label>
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
              <button onClick={() => { setShowCreateModal(false); resetForm(); }} className="bg-slate-700 hover:bg-slate-600 transition px-5 py-3 rounded-xl text-white font-semibold">Отмена</button>
              <button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700 transition px-5 py-3 rounded-xl text-white font-semibold">Создать</button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel modal */}
      {cancelModal.open && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 w-full max-w-md space-y-5">
            <h2 className="text-2xl font-bold text-white">Отменить занятие</h2>
            <textarea
              placeholder="Причина отмены (необязательно)"
              value={cancelReason}
              onChange={e => setCancelReason(e.target.value)}
              rows={3}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white outline-none resize-none"
            />
            <div className="flex gap-3 justify-end">
              <button onClick={() => { setCancelModal({ open: false, sessionId: null }); setCancelReason(""); }} className="bg-slate-700 hover:bg-slate-600 transition px-5 py-3 rounded-xl text-white font-semibold">Назад</button>
              <button onClick={handleCancel} className="bg-red-600 hover:bg-red-700 transition px-5 py-3 rounded-xl text-white font-semibold">Отменить занятие</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
