import { api } from "../axios";

export const ScheduleApi = {
  getAll() {
    return api.get("/schedule-templates");
  },

  getByGroup(groupId: number) {
    return api.get(
      `/schedule-templates/group/${groupId}`
    );
  },

  create(data: {
    weekday: string;
    lessonType: string;

    subjectId: number;
    teacherId: number;

    roomId: number;

    pairTimeId: number;

    groupId: number;

    subdivisionId?: number;
  }) {
    return api.post(
      "/schedule-templates",
      data
    );
  },
};