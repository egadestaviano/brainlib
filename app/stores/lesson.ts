import { LessonService } from "~/services/lessonService"

interface State {
  lesson: Lessons | null
  loading: boolean
  error: string | null
}

export const useLessonStore = defineStore('lesson', {
  state: (): State => ({
    lesson: null,
    loading: false,
    error: null,
  }),

  actions: {
    async createLesson(payload: LessonCreate) {
      this.loading = true
      this.error = null
      try {
        const res = await LessonService.createLesson(payload)
        return res
      } catch (err: any) {
        this.error = err?.response?.data?.message || err.message || "Failed to create class"
        throw err
      } finally {
        this.loading = false
      }
    },

    async getDetailLesson(id: number) {
      this.loading = true
      this.error = null
      try {
        const res = await LessonService.getDetailLesson(id)

        if (res && typeof res.content_json === "string") {
          try {
            res.content_json = JSON.parse(res.content_json)
          } catch (err) {
            console.warn("Gagal parse content_json:", err)
            res.content_json = []
          }
        } else if (!Array.isArray(res.content_json)) {
          res.content_json = []
        }

        this.lesson = res
        return res
      } catch (err: any) {
        this.error = err?.response?.data?.message || err.message || "Failed to get lesson details"
        throw err
      } finally {
        this.loading = false
      }
    },

    clearLessons() {
      this.lesson = null
      this.error = null
    },
  },

  persist: true,
})
