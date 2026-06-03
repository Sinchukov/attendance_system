import { AcademicGroup } from "./academic-group";
import { Subject } from "./subject";

export interface SubjectSubdivision {
  id: number;

  name: string;

  groupId: number;

  subjectId: number;

  group?: AcademicGroup;

  subject?: Subject;
}