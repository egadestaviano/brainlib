import { api } from '~/utils/api'

export const LessonService = {
    createLesson: (body: LessonCreate) => api.post<Lessons>('/lessons', body),
    getDetailLesson: (id: number) => api.get<Lessons>(`/lessons/${id}`),
    saveLessonSubmission: (lessonId: number, body: any) => api.post(`/lessons/${lessonId}/submissions`, body),
    getLessonSubmission: (lessonId: number, userId: number) => api.get(`/lessons/${lessonId}/submissions/${userId}`)
}