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

import { studentService } from "@/services/student.service";

import { groupService } from "@/services/group.service";

interface Student {
  id: number;

  fullName: string;

  studentCardNo: string;

  group: {
    id: number;

    name: string;
  };
}

interface Group {
  id: number;

  name: string;
}

export default function AdminStudentsPage() {
  const [students, setStudents] =
    useState<Student[]>([]);

  const [groups, setGroups] =
    useState<Group[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [isCreating, setIsCreating] =
    useState(false);

  const [editingStudentId, setEditingStudentId] =
    useState<number | null>(null);

  const [form, setForm] =
    useState({
      fullName: "",

      studentCardNo: "",

      groupId: "",
    });

  useEffect(() => {
    async function loadData() {
      try {
        const [
          studentsData,
          groupsData,
        ] = await Promise.all([
          studentService.getAll(),

          groupService.getAll(),
        ]);

        setStudents(studentsData);

        setGroups(groupsData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    void loadData();
  }, []);

  async function handleCreate() {
    try {
      const created =
        await studentService.create({
          fullName: form.fullName,

          studentCardNo:
            form.studentCardNo,

          groupId: Number(
            form.groupId,
          ),
        });

      setStudents((prev) => [
        ...prev,
        created,
      ]);

      resetForm();
    } catch (error) {
      console.error(error);
    }
  }

  async function handleUpdate() {
    if (!editingStudentId) {
      return;
    }

    try {
      const updated =
        await studentService.update(
          editingStudentId,
          {
            fullName: form.fullName,

            studentCardNo:
              form.studentCardNo,

            groupId: Number(
              form.groupId,
            ),
          },
        );

      setStudents((prev) =>
        prev.map((student) =>
          student.id ===
          editingStudentId
            ? updated
            : student,
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
      await studentService.delete(id);

      setStudents((prev) =>
        prev.filter(
          (student) =>
            student.id !== id,
        ),
      );
    } catch (error) {
      console.error(error);
    }
  }

  function startEdit(
    student: Student,
  ) {
    setEditingStudentId(student.id);

    setForm({
      fullName:
        student.fullName,

      studentCardNo:
        student.studentCardNo,

      groupId: String(
        student.group.id,
      ),
    });

    setIsCreating(true);
  }

  function resetForm() {
    setForm({
      fullName: "",

      studentCardNo: "",

      groupId: "",
    });

    setEditingStudentId(null);

    setIsCreating(false);
  }

  if (loading) {
    return (
      <div className="text-white text-xl">
        Загрузка студентов...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white">
            Студенты
          </h1>

          <p className="text-slate-400 mt-2">
            Управление студентами
            университета
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
            {editingStudentId
              ? "Редактирование студента"
              : "Создание студента"}
          </h2>

          <input
            type="text"
            placeholder="ФИО"
            value={form.fullName}
            onChange={(e) =>
              setForm({
                ...form,
                fullName:
                  e.target.value,
              })
            }
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white outline-none"
          />

          <input
            type="text"
            placeholder="Номер студенческого"
            value={
              form.studentCardNo
            }
            onChange={(e) =>
              setForm({
                ...form,
                studentCardNo:
                  e.target.value,
              })
            }
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white outline-none"
          />

          <select
            value={form.groupId}
            onChange={(e) =>
              setForm({
                ...form,
                groupId:
                  e.target.value,
              })
            }
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-4 text-white outline-none"
          >
            <option value="">
              Выберите группу
            </option>

            {groups.map((group) => (
              <option
                key={group.id}
                value={group.id}
              >
                {group.name}
              </option>
            ))}
          </select>

          <div className="flex gap-4">
            <button
              onClick={
                editingStudentId
                  ? handleUpdate
                  : handleCreate
              }
              className="bg-green-600 hover:bg-green-700 transition px-5 py-3 rounded-xl text-white font-semibold"
            >
              {editingStudentId
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
        {students.map((student) => (
          <div
            key={student.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-center justify-between"
          >
            <div>
              <h2 className="text-xl font-bold text-white">
                {student.fullName}
              </h2>

              <p className="text-slate-400 mt-1">
                Группа{" "}
                {
                  student.group
                    .name
                }
              </p>

              <p className="text-slate-500">
                {
                  student.studentCardNo
                }
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  startEdit(
                    student,
                  )
                }
                className="bg-yellow-500 hover:bg-yellow-600 transition p-3 rounded-xl text-white"
              >
                <Pencil size={18} />
              </button>

              <button
                onClick={() =>
                  handleDelete(
                    student.id,
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