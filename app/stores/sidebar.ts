export const useSidebarStore = defineStore("sidebar", {
  state: () => ({
    collapsed: false,
    classListOpen: true,
    hovered: false 
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
    }
  },

  persist: true
})
