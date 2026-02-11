export default defineNuxtRouteMiddleware((to, from) => {
  const token = useCookie<string | null>('token')
  const isAuthRoute = to.path.startsWith('/auth')


  if (!token.value && !isAuthRoute) {
    return navigateTo('/auth/login')
  }

  if (token.value && isAuthRoute) {
    return navigateTo('/')
  }
})
