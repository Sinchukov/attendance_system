"use client";

import { useEffect, useMemo, useState } from "react";

import { Student } from "@/types/student";

import { AcademicGroup } from "@/types/academic-group";

import { StudentsApi } from "@/lib/api/students.api";

import { getGroups } from "@/lib/api/admin-dashboard.api";

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);

  const [groups, setGroups] = useState<AcademicGroup[]>([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [showCreateModal, setShowCreateModal] =
    useState(false);

  const [form, setForm] = useState({
    fullName: "",
    studentCardNo: "",
    groupId: 0,
  });

  useEffect(() => {
    void loadData();
  }, []);

  async function loadData() {
    try {
      const [studentsResponse, groupsResponse] =
        await Promise.all([
          StudentsApi.getAll(),
          getGroups(),
        ]);

      setStudents(studentsResponse.data);

      setGroups(groupsResponse);
    } finally {
      setLoading(false);
    }
  }

async function createStudent() {
  if (!form.fullName.trim()) {
    alert('Введите имя студента');
    return;
  }
  if (!form.studentCardNo.trim()) {
    alert('Введите номер карточки');
    return;
  }
  if (form.groupId === 0) {
    alert('Выберите группу');
    return;
  }

  await StudentsApi.create(form);

  setShowCreateModal(false);

  setForm({
    fullName: '',
    studentCardNo: '',
    groupId: 0,
  });

  await loadData();
}
  async function deleteStudent(id: number) {
    const confirmed = confirm(
      "Delete student?",
    );

    if (!confirmed) {
      return;
    }

    await StudentsApi.delete(id);

    await loadData();
  }

  const filteredStudents = useMemo(() => {
    return students.filter(
      (student) =>
        student.fullName
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        student.studentCardNo.includes(search),
    );
  }, [students, search]);

  if (loading) {
    return (
      <div className="text-xl">
        Loading students...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">
            Students
          </h1>

          <p className="text-slate-500 mt-2">
            Student management
          </p>
        </div>

        <button
          onClick={() =>
            setShowCreateModal(true)
          }
          className="bg-blue-600 text-white px-5 py-2 rounded-lg"
        >
          Add Student
        </button>
      </div>

      <input
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        placeholder="Search student..."
        className="w-full border rounded-lg p-3"
      />

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-100">
              <th className="p-4 text-left">
                ID
              </th>

              <th className="p-4 text-left">
                Full Name
              </th>

              <th className="p-4 text-left">
                Student Card
              </th>

              <th className="p-4 text-left">
                Group
              </th>

              <th className="p-4 text-left">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredStudents.map(
              (student) => (
                <tr
                  key={student.id}
                  className="border-t"
                >
                  <td className="p-4">
                    {student.id}
                  </td>

                  <td className="p-4">
                    {student.fullName}
                  </td>

                  <td className="p-4">
                    {
                      student.studentCardNo
                    }
                  </td>

                  <td className="p-4">
                    {student.group?.name}
                  </td>

                  <td className="p-4">
                    <button
                      onClick={() =>
                        deleteStudent(
                          student.id,
                        )
                      }
                      className="text-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </table>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <div className="bg-white rounded-xl p-6 w-[500px]">
            <h2 className="text-2xl font-bold mb-6">
              Create Student
            </h2>

            <div className="space-y-4">
              <input
                placeholder="Full name"
                className="w-full border p-3 rounded-lg"
                value={form.fullName}
                onChange={(e) =>
                  setForm({
                    ...form,
                    fullName:
                      e.target.value,
                  })
                }
              />

              <input
                placeholder="Student card number"
                className="w-full border p-3 rounded-lg"
                value={form.studentCardNo}
                onChange={(e) =>
                  setForm({
                    ...form,
                    studentCardNo:
                      e.target.value,
                  })
                }
              />

              <select
                className="w-full border p-3 rounded-lg"
                value={form.groupId}
                onChange={(e) =>
                  setForm({
                    ...form,
                    groupId: Number(
                      e.target.value,
                    ),
                  })
                }
              >
                <option value={0}>
                  Select group
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
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={() =>
                  setShowCreateModal(
                    false,
                  )
                }
                className="border px-4 py-2 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={createStudent}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}