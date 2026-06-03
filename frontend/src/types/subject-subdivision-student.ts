import { Student } from './student';
import { SubjectSubdivision } from './subject-subdivision';

export interface SubjectSubdivisionStudent {
  id: number;

  subdivisionId: number;

  studentId: number;

  subdivision?: SubjectSubdivision;

  student?: Student;
}