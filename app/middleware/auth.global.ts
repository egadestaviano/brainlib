export default defineNuxtRouteMiddleware((to, from) => {
  const token = useCookie<string | null>('token')
  const isGuestRoute = to.path === '/' || to.path.startsWith('/auth')

  if (!token.value && !isGuestRoute) {
    return navigateTo('/')
  }

  if (token.value && (to.path === '/' || to.path.startsWith('/auth'))) {
    return navigateTo('/dashboard')
  }
})