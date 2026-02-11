declare global {
  interface User {
    id: number
    email: string
    is_active: boolean
    profile: {
      avatar_file_id: string | null,
      bio: string
      display_name: string
      extra: string
    } | null
    created_at: string 
    updated_at: string
  }

  interface CreateUserDto {
    name: string
    email: string
    is_active?: boolean
  }

  interface UpdateUserDto {
    id: number
    name?: string
    email?: string
    is_active?: boolean
  }
}

export {}
