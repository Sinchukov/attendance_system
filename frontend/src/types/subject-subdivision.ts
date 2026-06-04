import { AcademicGroup } from "./academic-group";
import { Subject } from "./subject";
import { SubjectSubdivisionStudent } from "./subject-subdivision-student";

export interface SubjectSubdivision {
  id: number;

  name: string;

  subjectId: number;

  groupId: number;

  createdAt: string;

  subject?: Subject;

  group?: AcademicGroup;

  students?: SubjectSubdivisionStudent[];
}