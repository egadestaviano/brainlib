export default defineNuxtRouteMiddleware((to, from) => {
  const token = useCookie<string | null>('token')
  const isAuthRoute = to.path.startsWith('/auth')
  const isLandingRoute = to.path === '/'
  const isOldLandingRoute = to.path === '/landing-page'

  // Redirect old landing page to root
  if (isOldLandingRoute) {
    return navigateTo('/', { redirectCode: 301 })
  }

  // Redirect unauthenticated users to landing if they try to access protected routes
  if (!token.value && !isAuthRoute && !isLandingRoute) {
    return navigateTo('/')
  }

  // Redirect authenticated users to home if they access auth or landing routes
  if (token.value && (isAuthRoute || isLandingRoute)) {
    return navigateTo('/home')
  }
})