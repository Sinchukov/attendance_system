import { AcademicGroup } from './academic-group';
import { Attendance } from './attendance';

export interface Student {
  id: number;

  fullName: string;

  studentCardNo: string;

  groupId: number;

  group?: AcademicGroup;

  attendances?: Attendance[];

  createdAt?: string;

  updatedAt?: string;
}