"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Search, MessageSquare, X } from "lucide-react";
import { api } from "@/lib/axios";

type Status = "PRESENT" | "LATE" | "ABSENT" | "EXCUSED" | "PENDING";

interface AttendanceItem {
  id: number;
  status: Status;
  comment?: string;
  student: { id: number; fullName: string; studentCardNo: string };
}

interface SessionData {
  id: number;
  lessonDate: string;
  lessonType: string;
  subject: { name: string };
  room: { name: string };
  group: { name: string };
  subdivision?: { name: string } | null;
  pairTime: { startTime: string; endTime: string };
  attendances: AttendanceItem[];
}

const STATUS_CONFIG: Record<Status, { label: string; active: string; idle: string }> = {
  PRESENT: { label: "Присутствует", active: "bg-green-600 text-white", idle: "bg-slate-800 text-slate-300 hover:bg-green-900/50 hover:text-green-300" },
  LATE:    { label: "Опоздал",      active: "bg-amber-500 text-white", idle: "bg-slate-800 text-slate-300 hover:bg-amber-900/50 hover:text-amber-300" },
  ABSENT:  { label: "Отсутствует",  active: "bg-red-600 text-white",   idle: "bg-slate-800 text-slate-300 hover:bg-red-900/50 hover:text-red-300" },
  EXCUSED: { label: "Уважительная", active: "bg-blue-600 text-white",  idle: "bg-slate-800 text-slate-300 hover:bg-blue-900/50 hover:text-blue-300" },
  PENDING: { label: "—",            active: "bg-slate-700 text-white", idle: "bg-slate-800 text-slate-400" },
};

export default function AttendancePage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId") ? Number(searchParams.get("sessionId")) : null;

  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(!!sessionId);
  const [search, setSearch] = useState("");
  const [commentModal, setCommentModal] = useState<{ id: number; comment: string } | null>(null);

  useEffect(() => {
    if (!sessionId) return;
    api.get(`/lesson-sessions/${sessionId}/students`)
      .then(res => setSession(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [sessionId]);

  async function changeStatus(attendanceId: number, status: Status) {
    try {
      const res = await api.patch(`/attendance/${attendanceId}`, { status });
      setSession(prev => prev && ({
        ...prev,
        attendances: prev.attendances.map(a =>
          a.id === attendanceId ? { ...a, status: res.data.status } : a
        ),
      }));
    } catch (e) { console.error(e); }
  }

  async function saveComment() {
    if (!commentModal) return;
    try {
      await api.patch(`/attendance/${commentModal.id}`, { comment: commentModal.comment });
      setSession(prev => prev && ({
        ...prev,
        attendances: prev.attendances.map(a =>
          a.id === commentModal.id ? { ...a, comment: commentModal.comment } : a
        ),
      }));
      setCommentModal(null);
    } catch (e) { console.error(e); }
  }

  const filtered = useMemo(() =>
    (session?.attendances ?? []).filter(a =>
      a.student.fullName.toLowerCase().includes(search.toLowerCase())
    ), [session, search]);

  const stats = useMemo(() => {
    const all = session?.attendances ?? [];
    return {
      total: all.length,
      present: all.filter(a => a.status === "PRESENT").length,
      late: all.filter(a => a.status === "LATE").length,
      absent: all.filter(a => a.status === "ABSENT").length,
    };
  }, [session]);

  if (!sessionId) return <div className="text-white text-xl">Не выбрана пара. Перейдите из журнала или главной страницы.</div>;
  if (loading) return <div className="text-white text-xl">Загрузка...</div>;
  if (!session) return <div className="text-white text-xl">Пара не найдена.</div>;

  return (
    <div className="space-y-8">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-white">{session.subject.name}</h1>
            <p className="text-slate-400 mt-1">
              {session.group.name}{session.subdivision ? ` · ${session.subdivision.name}` : ""}
              {" · "}Ауд. {session.room.name}
            </p>
            <p className="text-slate-400 text-sm mt-1">
              {format(new Date(session.lessonDate), "d MMMM yyyy", { locale: ru })}
            </p>
          </div>
          <div className="bg-blue-600 text-white px-5 py-3 rounded-xl font-bold text-lg">
            {session.pairTime.startTime} — {session.pairTime.endTime}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Всего", value: stats.total, color: "text-white" },
          { label: "Присутствуют", value: stats.present, color: "text-green-400" },
          { label: "Опоздали", value: stats.late, color: "text-amber-400" },
          { label: "Отсутствуют", value: stats.absent, color: "text-red-400" },
        ].map(c => (
          <div key={c.label} className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <p className="text-slate-400 text-sm">{c.label}</p>
            <p className={`text-3xl font-bold mt-1 ${c.color}`}>{c.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
        <Search size={18} className="text-slate-400 shrink-0" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Поиск студента..."
          className="bg-transparent outline-none text-white w-full placeholder:text-slate-500"
        />
      </div>

      <div className="space-y-3">
        {filtered.map(item => (
          <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <p className="text-white font-semibold text-lg">{item.student.fullName}</p>
                <p className="text-slate-500 text-sm">#{item.student.studentCardNo}</p>
                {item.comment && (
                  <p className="text-slate-400 text-sm mt-1 italic">💬 {item.comment}</p>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {(["PRESENT", "LATE", "ABSENT", "EXCUSED"] as Status[]).map(status => (
                  <button
                    key={status}
                    onClick={() => changeStatus(item.id, status)}
                    className={`px-3 py-1.5 rounded-xl text-sm font-semibold transition ${
                      item.status === status ? STATUS_CONFIG[status].active : STATUS_CONFIG[status].idle
                    }`}
                  >
                    {STATUS_CONFIG[status].label}
                  </button>
                ))}
                <button
                  onClick={() => setCommentModal({ id: item.id, comment: item.comment ?? "" })}
                  className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
                  title="Добавить комментарий"
                >
                  <MessageSquare size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {commentModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 w-full max-w-md space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Комментарий</h2>
              <button onClick={() => setCommentModal(null)} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <textarea
              value={commentModal.comment}
              onChange={e => setCommentModal({ ...commentModal, comment: e.target.value })}
              placeholder="Причина отсутствия, опоздания или другое..."
              rows={3}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white outline-none resize-none"
            />
            <div className="flex gap-3 justify-end">
              <button onClick={() => setCommentModal(null)} className="bg-slate-700 hover:bg-slate-600 transition px-5 py-2.5 rounded-xl text-white font-semibold">
                Отмена
              </button>
              <button onClick={saveComment} className="bg-blue-600 hover:bg-blue-700 transition px-5 py-2.5 rounded-xl text-white font-semibold">
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
