import api from "./API";

export const getAdminStats = () => api.get("/admin/stats");
