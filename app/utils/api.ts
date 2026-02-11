import { navigateTo } from '#app'
import { toRaw } from 'vue'

async function apiFetch<T>(
  endpoint: string,
  options: {
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
    body?: any
    headers?: Record<string, string>
  } = {}
): Promise<T> {
  const config = useRuntimeConfig()
  const token = useCookie<string | null>('token')

  try {
    return await $fetch<T>(endpoint, {
      baseURL: config.public.apiBaseUrl,
      credentials: 'include',
      method: options.method || 'GET',
      headers: {
        ...(token.value ? { Authorization: `Bearer ${token.value}` } : {}),
        ...(options.headers || {}),
      },
      
      body: options.body ? JSON.parse(JSON.stringify(toRaw(options.body))) : undefined,
    })
  } catch (err: any) {
    if (err?.status === 401) {
      token.value = null
      await navigateTo('/auth/login')
      throw err
    }
    throw err
  }
}

export const api = {
  get: <T>(url: string, opts: any = {}) =>
    apiFetch<T>(url, { ...opts, method: 'GET' }),

  post: <T>(url: string, body?: any, opts: any = {}) =>
    apiFetch<T>(url, { ...opts, method: 'POST', body }),

  put: <T>(url: string, body?: any, opts: any = {}) =>
    apiFetch<T>(url, { ...opts, method: 'PUT', body }),

  patch: <T>(url: string, body?: any, opts: any = {}) =>
    apiFetch<T>(url, { ...opts, method: 'PATCH', body }),

  delete: <T>(url: string, opts: any = {}) =>
    apiFetch<T>(url, { ...opts, method: 'DELETE' }),
}
