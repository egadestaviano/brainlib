export default defineNuxtPlugin({
  name: 'color-mode-init',
  parallel: true,
  setup () {
    const colorMode = useColorMode()

    colorMode.preference = 'light'
    colorMode.value = 'light'

    if (import.meta.client) {
      document.documentElement.classList.remove('dark')
      document.documentElement.classList.add('light')
    }
  }
})
