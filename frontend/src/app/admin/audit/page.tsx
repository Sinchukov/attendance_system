"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/axios";

interface AuditLogEntry {
  id: number;
  attendanceId: number;
  teacherId: number | null;
  deviceId: number | null;
  oldStatus: string | null;
  newStatus: string;
  action: string;
  details: string | null;
  createdAt: string;
  teacher?: { id: number; fullName: string } | null;
  attendance?: {
    id: number;
    student?: { fullName: string };
    lessonSession?: {
      lessonDate: string;
      subject?: { name: string };
      group?: { name: string };
    };
  } | null;
}

const STATUS_COLORS: Record<string, string> = {
  PRESENT: "bg-green-900 text-green-300",
  ABSENT: "bg-red-900 text-red-300",
  LATE: "bg-amber-900 text-amber-300",
  EXCUSED: "bg-blue-900 text-blue-300",
  PENDING: "bg-slate-700 text-slate-300",
};

const STATUS_LABELS: Record<string, string> = {
  PRESENT: "Присутствовал",
  ABSENT: "Отсутствовал",
  LATE: "Опоздал",
  EXCUSED: "Уважительная",
  PENDING: "Ожидание",
};

export default function AdminAuditPage() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    void loadLogs();
  }, []);

  async function loadLogs() {
    try {
      const res = await api.get("/admin-dashboard/audit-logs");
      setLogs(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }
  

  const filtered = logs.filter((log) => {
    const q = search.toLowerCase();
    return (
      log.attendance?.student?.fullName?.toLowerCase().includes(q) ||
      log.teacher?.fullName?.toLowerCase().includes(q) ||
      log.action?.toLowerCase().includes(q) ||
      log.attendance?.lessonSession?.subject?.name?.toLowerCase().includes(q) ||
      false
    );
  });

  if (loading) return <div className="text-white text-xl">Загрузка журнала...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white">Журнал изменений</h1>
        <p className="text-slate-400 mt-2">
          История всех изменений посещаемости ({logs.length} записей)
        </p>
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Поиск по студенту, преподавателю, предмету..."
        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-white outline-none placeholder:text-slate-500"
      />

      <div className="space-y-3">
        {filtered.length === 0 && (
          <p className="text-slate-400">Записей не найдено.</p>
        )}
        {filtered.map((log) => (
          <div
            key={log.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-1.5">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-white font-semibold">
                    {log.attendance?.student?.fullName ?? `Запись #${log.attendanceId}`}
                  </span>
                  {log.attendance?.lessonSession?.group && (
                    <span className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full">
                      {log.attendance.lessonSession.group.name}
                    </span>
                  )}
                  {log.attendance?.lessonSession?.subject && (
                    <span className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full">
                      {log.attendance.lessonSession.subject.name}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {log.oldStatus && (
                    <>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-semibold ${STATUS_COLORS[log.oldStatus] ?? "bg-slate-700 text-slate-300"}`}
                      >
                        {STATUS_LABELS[log.oldStatus] ?? log.oldStatus}
                      </span>
                      <span className="text-slate-500 text-xs">→</span>
                    </>
                  )}
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-semibold ${STATUS_COLORS[log.newStatus] ?? "bg-slate-700 text-slate-300"}`}
                  >
                    {STATUS_LABELS[log.newStatus] ?? log.newStatus}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-slate-400 text-sm flex-wrap">
                  <span>
                    {log.action === "MANUAL_EDIT"
                      ? "Ручное редактирование"
                      : log.action === "AUTO_CHECKIN"
                      ? "Авто-отметка (RFID)"
                      : log.action}
                  </span>
                  {log.teacher && (
                    <span>Преподаватель: {log.teacher.fullName}</span>
                  )}
                  {log.deviceId && (
                    <span className="text-slate-500">Устройство: #{log.deviceId}</span>
                  )}
                  {log.details && (
                    <span className="text-slate-500 italic">{log.details}</span>
                  )}
                </div>
              </div>

              <div className="text-right shrink-0">
                <p className="text-slate-400 text-sm">
                  {new Date(log.createdAt).toLocaleDateString("ru-RU")}
                </p>
                <p className="text-slate-500 text-xs">
                  {new Date(log.createdAt).toLocaleTimeString("ru-RU", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
