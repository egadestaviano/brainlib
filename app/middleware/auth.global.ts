export default defineNuxtRouteMiddleware((to, from) => {
  const token = useCookie<string | null>('token')
  const isAuthRoute = to.path.startsWith('/auth')

  if (!token.value && !isAuthRoute && to.path !== '/landing-page') {
    return navigateTo('/landing-page')
  }

  if (token.value && isAuthRoute) {
    return navigateTo('/')
  }
})