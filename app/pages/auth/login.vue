<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
    <UCard class="w-full max-w-md shadow-md border border-gray-200 dark:border-gray-800 rounded-xl p-8 space-y-6">
      <!-- Logo & Title -->
      <div class="text-center space-y-3 mb-10">
        <h1 class="text-2xl font-bold">Sign in to BrainLib</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Use your account to continue
        </p>
      </div>

      <!-- Form -->
      <UForm :state="form" @submit="handleLogin" class="space-y-5">
        <UFormField  label="Email" name="email" required>
          <UInput
            class="w-full"
            v-model="form.email"
            type="email"
            size="lg"
            placeholder="you@example.com"
            autocomplete="email"
          />
        </UFormField>

        <UFormField label="Password" name="password" required>
          <UInput
            class="w-full"
            v-model="form.password"
            type="password"
            size="lg"
            placeholder="Enter your password"
            autocomplete="current-password"
          />
        </UFormField>

        <div class="flex items-center justify-between">
          <UCheckbox v-model="rememberMe" label="Remember me" name="remember" />
          <UButton variant="link" to="/auth/forgot-password" size="sm">
            Forgot password?
          </UButton>
        </div>

        <UButton
          type="submit"
          block
          :loading="loading"
          :disabled="loading"
          class="h-11 text-base font-medium"
        >
          {{ loading ? 'Signing in...' : 'Sign In' }}
        </UButton>
      </UForm>

      <!-- Register -->
      <p class="text-center text-sm text-gray-500">
        Don’t have an account?
        <UButton variant="link" to="/auth/register" size="sm">
          Sign up now
        </UButton>
      </p>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const authStore = useAuthStore()
const lmsClassStore = useLmsClassStore()

definePageMeta({
  layout: 'auth'
})

const loading = ref(false)
const rememberMe = ref(false)

const form = ref<AuthLogin>({
  email: 'admin@example.com',
  password: 'password'
})

const handleLogin = async () => {
  try {
    loading.value = true
    await authStore.login(form.value)
    await lmsClassStore.getMyClass()
    await router.push('/')
  } catch (error: any) {
    useToast().add({
      title: 'Error',
      description: error.message || 'Login gagal, silakan coba lagi',
      color: 'warning'
    })
  } finally {
    loading.value = false
  }
}
</script>
