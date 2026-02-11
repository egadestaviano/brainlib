import { api } from '@/utils/api'

export const userService = {
  getAll: () => api.get<User[]>('/users'),
  getById: (id: number) => api.get<User>(`/users/${id}`),
  create: (payload: CreateUserDto) => api.post<User>('/users', payload),
  update: (payload: UpdateUserDto) => api.put<User>(`/users/${payload.id}`, payload),
  delete: (id: number) => api.delete<void>(`/users/${id}`),
}
