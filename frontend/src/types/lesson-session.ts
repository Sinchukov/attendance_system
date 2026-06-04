import { Attendance } from "./attendance";
import { AcademicGroup } from "./academic-group";
import { PairTime } from "./pair-time";
import { Room } from "./room";
import { SubjectSubdivision } from "./subject-subdivision";
import { Subject } from "./subject";
import { Teacher } from "./teacher";
import { LessonType } from "./schedule-template";

export interface LessonSession {
  id: number;

  lessonDate: string;

  lessonType: LessonType;

  subjectId: number;

  teacherId: number;

  roomId: number;

  pairTimeId: number;

  groupId: number;

  subdivisionId: number | null;

  templateId: number | null;

  isCancelled: boolean;

  cancellationReason: string | null;

  createdAt: string;

  subject?: Subject;

  teacher?: Teacher;

  room?: Room;

  pairTime?: PairTime;

  group?: AcademicGroup;

  subdivision?: SubjectSubdivision;

  attendances?: Attendance[];
}