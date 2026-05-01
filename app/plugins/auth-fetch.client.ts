import { useAuthStore } from '~/stores/auth'
import { useLmsClassStore } from '~/stores/lmsclass'

export default defineNuxtPlugin({
  name: 'auth-fetch-current-user',
  async setup (nuxtApp) {
    const token = useCookie<string | null>('token')
    const authStore = useAuthStore()
    const classStore = useLmsClassStore()

    if (token.value) {
      try {
        await classStore.getMyClass()
      } catch (error) {
        console.error('Failed Fetch My Class', error);
      }
      
      if (!authStore.user) {
        try {
          await authStore.fetchCurrentUser()
        } catch (err) {
          console.error('Failed fetch user:', err)
          authStore.clearAuth()
        }
      }
    }
  }
})
