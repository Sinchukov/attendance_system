"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  Pencil,
  Trash2,
  Plus,
} from "lucide-react";

import { groupService } from "@/services/group.service";

interface Group {
  id: number;

  name: string;
}

export default function AdminGroupsPage() {
  const [groups, setGroups] =
    useState<Group[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [isCreating, setIsCreating] =
    useState(false);

  const [editingGroupId, setEditingGroupId] =
    useState<number | null>(null);

  const [name, setName] =
    useState("");

  useEffect(() => {
    async function loadGroups() {
      try {
        const data =
          await groupService.getAll();

        setGroups(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    void loadGroups();
  }, []);

  async function handleCreate() {
    try {
      const created =
        await groupService.create({
          name,
        });

      setGroups((prev) => [
        ...prev,
        created,
      ]);

      resetForm();
    } catch (error) {
      console.error(error);
    }
  }

  async function handleUpdate() {
    if (!editingGroupId) {
      return;
    }

    try {
      const updated =
        await groupService.update(
          editingGroupId,
          {
            name,
          },
        );

      setGroups((prev) =>
        prev.map((group) =>
          group.id ===
          editingGroupId
            ? updated
            : group,
        ),
      );

      resetForm();
    } catch (error) {
      console.error(error);
    }
  }

  async function handleDelete(
    id: number,
  ) {
    try {
      await groupService.delete(id);

      setGroups((prev) =>
        prev.filter(
          (group) =>
            group.id !== id,
        ),
      );
    } catch (error) {
      console.error(error);
    }
  }

  function startEdit(
    group: Group,
  ) {
    setEditingGroupId(group.id);

    setName(group.name);

    setIsCreating(true);
  }

  function resetForm() {
    setName("");

    setEditingGroupId(null);

    setIsCreating(false);
  }

  if (loading) {
    return (
      <div className="text-white text-xl">
        Загрузка групп...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white">
            Группы
          </h1>

          <p className="text-slate-400 mt-2">
            Управление группами
          </p>
        </div>

        <button
          onClick={() =>
            setIsCreating(true)
          }
          className="bg-blue-600 hover:bg-blue-700 transition px-5 py-3 rounded-xl text-white font-semibold flex items-center gap-2"
        >
          <Plus size={20} />

          Добавить
        </button>
      </div>

      {isCreating && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
          <h2 className="text-2xl font-bold text-white">
            {editingGroupId
              ? "Редактирование группы"
              : "Создание группы"}
          </h2>

          <input
            type="text"
            placeholder="Название группы"
            value={name}
            onChange={(e) =>
              setName(
                e.target.value,
              )
            }
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white outline-none"
          />

          <div className="flex gap-4">
            <button
              onClick={
                editingGroupId
                  ? handleUpdate
                  : handleCreate
              }
              className="bg-green-600 hover:bg-green-700 transition px-5 py-3 rounded-xl text-white font-semibold"
            >
              {editingGroupId
                ? "Сохранить"
                : "Создать"}
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
        {groups.map((group) => (
          <div
            key={group.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-center justify-between"
          >
            <h2 className="text-xl font-bold text-white">
              {group.name}
            </h2>

            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  startEdit(group)
                }
                className="bg-yellow-500 hover:bg-yellow-600 transition p-3 rounded-xl text-white"
              >
                <Pencil size={18} />
              </button>

              <button
                onClick={() =>
                  handleDelete(
                    group.id,
                  )
                }
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