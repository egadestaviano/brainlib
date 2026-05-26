export const useSidebarStore = defineStore("sidebar", {
  state: () => ({
    collapsed: false,
    classListOpen: true,
    hovered: false,
    mobileOpen: false
  }),

  actions: {
    toggleCollapse() {
      this.collapsed = !this.collapsed
    },
    toggleClassList() {
      this.classListOpen = !this.classListOpen
    },
    setHovered(status: boolean) { 
      this.hovered = status
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
