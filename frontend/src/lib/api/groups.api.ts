import { api } from "../axios";

export const GroupsApi = {
  getAll() {
    return api.get("/admin-dashboard/groups");
  },

  getSchedule(groupId: number) {
    return api.get(
      `/schedule-templates/group/${groupId}`
    );
  },
};