import axiosInstance from './axiosInstance';

export const getApplications = (params) => axiosInstance.get('/applications', { params });
export const getApplicationById = (id) => axiosInstance.get(`/applications/${id}`);
export const createApplication = (data) => axiosInstance.post('/applications', data);
export const updateApplication = (id, data) => axiosInstance.put(`/applications/${id}`, data);
export const deleteApplication = (id) => axiosInstance.delete(`/applications/${id}`);
export const getApplicationStats = () => axiosInstance.get('/applications/stats');
export const generateMatchScore = (id) => axiosInstance.post(`/applications/${id}/match-score`);