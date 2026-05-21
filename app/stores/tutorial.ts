interface TutorialState {
  /** Per-route completion flags - PERSISTED */
  completedRoutes: Record<string, boolean>
  /** Current step index - TRANSIENT */
  currentStep: number
  /** Whether walkthrough is active - TRANSIENT */
  isActive: boolean
  /** The route currently being walked through - TRANSIENT */
  activeRoute: string | null
}

export const useTutorialStore = defineStore('tutorial', {
  state: (): TutorialState => ({
    completedRoutes: {},
    currentStep: 0,
    isActive: false,
    activeRoute: null
  }),

  getters: {
    isRouteCompleted: (state) => {
      return (route: string): boolean => !!state.completedRoutes[route]
    }
  },

  actions: {
    startWalkthrough(route: string) {
      this.isActive = true
      this.activeRoute = route
      this.currentStep = 0
    },

    nextStep() {
      this.currentStep++
    },

    prevStep() {
      this.currentStep--
    },

    skipWalkthrough() {
      if (this.activeRoute) {
        this.completedRoutes[this.activeRoute] = true
      }
      this.isActive = false
      this.activeRoute = null
      this.currentStep = 0
    },

    finishWalkthrough() {
      if (this.activeRoute) {
        this.completedRoutes[this.activeRoute] = true
      }
      this.isActive = false
      this.activeRoute = null
      this.currentStep = 0
    },

    resetAll() {
      this.completedRoutes = {}
      this.isActive = false
      this.activeRoute = null
      this.currentStep = 0
    }
  },

  persist: {
    pick: ['completedRoutes']
  }
})
