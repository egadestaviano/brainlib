import { api } from '~/utils/api'

export const LessonService = {
    createLesson: (body: LessonCreate) => api.post<Lessons>('/lessons', body),
    getDetailLesson: (id: number) => api.get<Lessons>(`/lessons/${id}`),
    submitLesson: (id: number, body: any) => api.post(`/lessons/${id}/submit`, body),
    getLessonSubmission: (id: number) => api.get<any>(`/lessons/${id}/submission`),
    listLessonSubmissions: (id: number) => api.get<any>(`/lessons/${id}/submissions`)
}