import { authService } from "~/services/authService"

interface State {
  token: string | null
  isAuthenticated: boolean
  user: UserMe | null
}

export const useAuthStore = defineStore('auth', {
  state: (): State => ({
    token: null,
    isAuthenticated: false,
    user: null
  }),

  getters: {
    getToken: (state) => state.token,
    isLoggedIn: (state) => state.isAuthenticated,
    getUser: (state) => state.user
  },

  actions: {
    async login(payload: AuthLogin) {
      try {
        const response = await authService.login(payload)
        this.setAuth(response)

        await nextTick()
        
        this.user = await this.fetchCurrentUser()
        
        return response
      } catch (error) {
        this.clearAuth()
        throw error
      }
    },

    async register(payload: AuthRegister) {
      try {
        const response = await authService.register(payload)
        this.setAuth(response)

        await nextTick()

        this.user = await this.fetchCurrentUser()
        return response
      } catch (error) {
        this.clearAuth()
        throw error
      }
    },

    async fetchCurrentUser() {
      try {
        const response = await authService.getCurrentUser()
        this.user = response
        
        return response
      } catch (error) {
        this.clearAuth()
        throw error
      }
    },

    setAuth(response: AuthBearerResponse) {
      this.token = response.token
      this.isAuthenticated = true
      
      const tokenCookie = useCookie('token')
      tokenCookie.value = response.token
    },

    clearAuth() {
      this.token = null
      this.isAuthenticated = false
      this.user = null
      
      const tokenCookie = useCookie('token')
      tokenCookie.value = null
    },

    logout() {
      this.clearAuth()
    }
  },

  persist: true
})