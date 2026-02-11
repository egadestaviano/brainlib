import { userService } from "@/services/userService"

export const useUserStore = defineStore("user", {
  state: () => ({
    users: [] as User[],
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchUsers() {
      this.loading = true
      this.error = null
      try {
        this.users = await userService.getAll()
      } catch (err: any) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    async addUser(payload: CreateUserDto) {
      const newUser = await userService.create(payload)
      this.users.push(newUser)
    },

    async updateUser(payload: UpdateUserDto) {
      const updated = await userService.update(payload)
      const idx = this.users.findIndex((u) => u.id === updated.id)
      if (idx !== -1) this.users[idx] = updated
    },

    async deleteUser(id: number) {
      await userService.delete(id)
      this.users = this.users.filter((u) => u.id !== id)
    },
  },
})
