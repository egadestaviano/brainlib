import { classService } from "~/services/classService"

interface State {
  clases: LmsClass[] | null
  classDetail: LmsClass | null
  loading: boolean
  error: string | null
}

export const useLmsClassStore = defineStore('lmsclass', {
  state: (): State => ({
    clases: null,
    classDetail: null,
    loading: false,
    error: null,
  }),
  actions: {
    async getMyClass() {
      this.loading = true
      this.error = null
      try {
        const res = await classService.myclass()
        this.clases = res.data
        return res
      } catch (err: any) {
        this.error = err?.response?.data?.message || err.message || "Failed to fetch classes"
        throw err
      } finally {
        this.loading = false
      }
    },

    async createClass(payload: CreateLmsClass) {
      this.loading = true
      this.error = null
      try {
        const res = await classService.createClass(payload)
        if (this.clases) {
          this.clases.unshift(res.data)
        } else {
          this.clases = [res.data]
        }
        return res
      } catch (err: any) {
        this.error = err?.response?.data?.message || err.message || "Failed to create class"
        throw err
      } finally {
        this.loading = false
      }
    },

    async getDetailsClass(id: number) {
      this.loading = true
      this.error = null
      try {
        const res = await classService.getDetail(id)
        this.classDetail = res
        return res
      } catch (err: any) {
        this.error = err?.response?.data?.message || err.message || "Failed to Get class"
        throw err
      } finally {
        this.loading = false
      }
    },

    async joinClassByCode(code: string) {
      this.loading = true
      this.error = null
      try {
        const res = await classService.joinClassByCode(code)
        this.getMyClass()
        return res
      } catch (err: any) {
        this.error = err?.response?.data?.error || "Failed to join class"
        throw err
      } finally {
        this.loading = false
      }
    },


    clearClasses() {
      this.clases = null
      this.error = null
      this.classDetail = null
    },
  },
  persist: true
})
