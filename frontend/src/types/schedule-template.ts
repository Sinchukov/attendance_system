import { AcademicGroup } from "./academic-group";
import { PairTime } from "./pair-time";
import { Room } from "./room";
import { SubjectSubdivision } from "./subject-subdivision";
import { Subject } from "./subject";
import { Teacher } from "./teacher";

export type WeekDay =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY";

export type LessonType =
  | "LECTURE"
  | "PRACTICE";

export interface ScheduleTemplate {
  id: number;

  weekday: WeekDay;

  lessonType: LessonType;

  subjectId: number;

  teacherId: number;

  roomId: number;

  pairTimeId: number;

  groupId: number;

  subdivisionId: number | null;

  isActive: boolean;

  createdAt: string;

  subject?: Subject;

  teacher?: Teacher;

  room?: Room;

  pairTime?: PairTime;

  group?: AcademicGroup;

  subdivision?: SubjectSubdivision;
}