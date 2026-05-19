declare global {
  interface AuthLogin {
    email: string
    password: string
  }

  interface AuthBearerResponse {
    type: 'Bearer'
    token: string
  }

  interface AuthRegister extends AuthLogin {
    is_active: boolean
    display_name?: string
    role?: string
  }

  interface UserMe extends User {
    permissions: string[],
    roles: string[]
  }
}

export {}