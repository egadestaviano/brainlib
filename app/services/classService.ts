import { api } from '~/utils/api'

export const classService = {
    myclass: () => api.get<{data: LmsClass[]}>('/classes/my'),
    createClass: (body: CreateLmsClass) => api.post<{data: LmsClass}>('/classes', body),
    getDetail: (id: number) => api.get<LmsClass>(`/classes/${id}`),
    joinClassByCode: (code: string) => api.post<{ message: string; data: LmsClass }>('/classes/join', { code }),
}