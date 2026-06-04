/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Cpu } from "lucide-react";
import { api } from "@/lib/axios";

interface Device {
  id: number;
  serialNumber: string;
  roomId: number;
  createdAt: string;
  room?: { id: number; name: string };
}

export default function AdminDevicesPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ serialNumber: "", roomId: 0 });
  const [error, setError] = useState("");

  useEffect(() => { void loadAll(); }, []);

  async function loadAll() {
    try {
      const [devRes, roomRes] = await Promise.all([
        api.get("/devices"),
        api.get("/rooms"),
      ]);
      setDevices(devRes.data);
      setRooms(roomRes.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }

  async function handleCreate() {
    setError("");
    if (!form.serialNumber.trim()) return setError("Введите серийный номер");
    if (!form.roomId) return setError("Выберите аудиторию");
    try {
      await api.post("/devices", form);
      setShowModal(false);
      setForm({ serialNumber: "", roomId: 0 });
      await loadAll();
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "Ошибка создания");
    }
  }

  if (loading) return <div className="text-white text-xl">Загрузка устройств...</div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white">Устройства</h1>
          <p className="text-slate-400 mt-2">RFID-считыватели посещаемости</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-blue-600 hover:bg-blue-700 transition px-5 py-3 rounded-xl text-white font-semibold flex items-center gap-2">
          <Plus size={20} /> Добавить
        </button>
      </div>

      <div className="space-y-4">
        {devices.length === 0 && <p className="text-slate-400">Устройства не добавлены.</p>}
        {devices.map(device => (
          <div key={device.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-slate-800 p-3 rounded-xl">
                <Cpu size={24} className="text-blue-400" />
              </div>
              <div>
                <p className="text-white font-semibold text-lg">SN: {device.serialNumber}</p>
                <p className="text-slate-400 text-sm">
                  Аудитория: {device.room?.name ?? `#${device.roomId}`}
                  {" · "}ID: {device.id}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 w-[420px] space-y-5">
            <h2 className="text-2xl font-bold text-white">Новое устройство</h2>
            {error && <p className="text-red-400 text-sm bg-red-900/30 border border-red-800 rounded-lg px-4 py-2">{error}</p>}
            <input
              placeholder="Серийный номер"
              value={form.serialNumber}
              onChange={e => setForm({ ...form, serialNumber: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white outline-none"
            />
            <select
              value={form.roomId}
              onChange={e => setForm({ ...form, roomId: Number(e.target.value) })}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white outline-none"
            >
              <option value={0}>Выберите аудиторию</option>
              {rooms.map((r: any) => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
            <div className="flex gap-4 justify-end">
              <button onClick={() => { setShowModal(false); setError(""); }} className="bg-slate-700 hover:bg-slate-600 transition px-5 py-3 rounded-xl text-white font-semibold">Отмена</button>
              <button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700 transition px-5 py-3 rounded-xl text-white font-semibold">Создать</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
