import api from './api';

const activityService = {
  async getMyActivities(limit = 5) {
    const response = await api.get(`/api/activities/me?limit=${limit}`);
    return response.data;
  },
};

export default activityService;
