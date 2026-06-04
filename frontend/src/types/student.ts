import { AcademicGroup } from "./academic-group";

export interface Student {
  id: number;

  fullName: string;

  studentCardNo: string;

  groupId: number;

  createdAt?: string;

  group?: AcademicGroup;
}