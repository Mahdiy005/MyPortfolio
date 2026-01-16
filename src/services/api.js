import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
export const UPLOADS_BASE_URL = import.meta.env.VITE_UPLOADS_URL || 'http://localhost:3000';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth API
export const authAPI = {
    login: (username, password) => api.post('/auth/login', { username, password }),
    verify: () => api.get('/auth/verify'),
};

// Projects API
export const projectsAPI = {
    getAll: () => api.get('/projects'),
    getOne: (id) => api.get(`/projects/${id}`),
    create: (project) => api.post('/projects', project),
    update: (id, project) => api.put(`/projects/${id}`, project),
    delete: (id) => api.delete(`/projects/${id}`),
};

// Settings API
export const settingsAPI = {
    get: () => api.get('/settings'),
    update: (settings) => api.put('/settings', settings),
    patch: (settings) => api.patch('/settings', settings),
};

// Upload API
export const uploadAPI = {
    uploadImage: (file) => {
        const formData = new FormData();
        formData.append('image', file);
        return api.post('/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
};

// About API
export const aboutAPI = {
    get: () => api.get('/about'),
    update: (about) => api.put('/about', about),
    updateSummary: (summary) => api.patch('/about/summary', { summary }),
    updateEducation: (education) => api.put('/about/education', education),
    addExperience: (experience) => api.post('/about/experience', experience),
    updateExperience: (id, experience) => api.put(`/about/experience/${id}`, experience),
    deleteExperience: (id) => api.delete(`/about/experience/${id}`),
    addTraining: (training) => api.post('/about/training', training),
    updateTraining: (id, training) => api.put(`/about/training/${id}`, training),
    deleteTraining: (id) => api.delete(`/about/training/${id}`),
    updateSkills: (skills) => api.put('/about/skills', { skills }),
};

export default api;
