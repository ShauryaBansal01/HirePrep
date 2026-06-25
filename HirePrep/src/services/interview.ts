import api from './api'

export const generateInterview = async (role: string , difficulty: string ) => {
    const response = await api.post('/interviews/generate' , {role , difficulty});
    return response.data;
}

export const fetchInterview = async (id: string) => {
    const response = await api.get(`/interviews/${id}`);
    return response.data;
}

export const submitInterviewAnswers = async (id: string, answers: string[]) => {
    const response = await api.post(`/interviews/${id}/submit`, { answers });
    return response.data;
}

export const getInterviewHistory = async () => {
    const response = await api.get('/interviews/history');
    return response.data;
}