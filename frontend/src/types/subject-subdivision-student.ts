import { Student } from "./student";

export interface SubjectSubdivisionStudent {
  id: number;

  subdivisionId: number;

  studentId: number;

  student?: Student;
}