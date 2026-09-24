import axiosInstance from './axiosInstance';

export const uploadResume = (formData) =>
  axiosInstance.post('/resume/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const getResume = () => axiosInstance.get('/resume');
export const deleteResume = () => axiosInstance.delete('/resume');
export const reparseResume = () => axiosInstance.post('/resume/reparse');