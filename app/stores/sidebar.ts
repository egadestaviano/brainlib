export const useSidebarStore = defineStore("sidebar", {
  state: () => ({
    collapsed: false,
    classListOpen: true,
    mobileOpen: false
  }),

  actions: {
    toggleCollapse() {
      this.collapsed = !this.collapsed
    },
    toggleClassList() {
      this.classListOpen = !this.classListOpen
    },
    toggleMobile() {
      this.mobileOpen = !this.mobileOpen
    },
    closeMobile() {
      this.mobileOpen = false
    }
  },

  persist: {
    pick: ['collapsed', 'classListOpen']
  }
})
