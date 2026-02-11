import { api } from '~/utils/api'

export const authService = {
  login: (payload: AuthLogin) => api.post<AuthBearerResponse>('/auth/login', payload),
  register: (payload: AuthRegister) => api.post<AuthBearerResponse>('/auth/register', payload),
  getCurrentUser: () => api.get<UserMe>('/auth/me')
}
  