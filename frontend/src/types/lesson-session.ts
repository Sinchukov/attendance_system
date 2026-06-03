import { AcademicGroup } from "./academic-group";
import { PairTime } from "./pair-time";
import { Room } from "./room";
import { Subject } from "./subject";
import { SubjectSubdivision } from "./subject-subdivision";
import { Teacher } from "./teacher";

export type LessonType =
  | "LECTURE"
  | "PRACTICE";

export interface LessonSession {
  id: number;

  lessonDate: string;

  lessonType: LessonType;

  subjectId: number;

  teacherId: number;

  roomId: number;

  pairTimeId: number;

  groupId: number;

  subdivisionId?: number | null;

  templateId?: number | null;

  isCancelled: boolean;

  cancellationReason?: string | null;

  createdAt: string;

  subject?: Subject;

  teacher?: Teacher;

  room?: Room;

  pairTime?: PairTime;

  group?: AcademicGroup;

  subdivision?: SubjectSubdivision | null;
}