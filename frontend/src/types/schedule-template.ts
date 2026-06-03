import { AcademicGroup } from "./academic-group";
import { PairTime } from "./pair-time";
import { Room } from "./room";
import { Subject } from "./subject";
import { SubjectSubdivision } from "./subject-subdivision";
import { Teacher } from "./teacher";

export type WeekDay =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY";

export interface ScheduleTemplate {
  id: number;

  weekday: WeekDay;

  lessonType: "LECTURE" | "PRACTICE";

  subjectId: number;

  teacherId: number;

  roomId: number;

  pairTimeId: number;

  groupId: number;

  subdivisionId?: number | null;

  isActive: boolean;

  createdAt: string;

  subject?: Subject;

  teacher?: Teacher;

  room?: Room;

  pairTime?: PairTime;

  group?: AcademicGroup;

  subdivision?: SubjectSubdivision | null;
}