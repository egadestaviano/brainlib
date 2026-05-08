<template>
  <div class="space-y-8">
    <div class="space-y-2">
      <h1 class="text-2xl font-bold text-slate-900">Sign in to Mentora</h1>
      <p class="text-sm text-slate-500">Enter your credentials to access your account</p>
    </div>

    <UForm :state="form" @submit="handleLogin" class="space-y-5">
      <UFormField label="Email" name="email" required>
        <UInput class="w-full" v-model="form.email" type="email" size="lg" placeholder="you@example.com"
          autocomplete="email" />
      </UFormField>

      <UFormField label="Password" name="password" required>
        <UInput class="w-full" v-model="form.password" type="password" size="lg" placeholder="Enter your password"
          autocomplete="current-password" />
      </UFormField>

      <div class="flex items-center justify-between">
        <UCheckbox v-model="rememberMe" label="Remember me" name="remember" />
        <UButton variant="link" to="/auth/forgot-password" size="sm" class="text-slate-600">
          Forgot password?
        </UButton>
      </div>

      <UButton type="submit" block :loading="loading" :disabled="loading" color="neutral"
        class="h-11 text-base font-medium">
        {{ loading ? 'Signing in...' : 'Sign In' }}
      </UButton>

      <div class="relative py-2">
        <div class="absolute inset-0 flex items-center">
          <span class="w-full border-t border-slate-200" />
        </div>
        <div class="relative flex justify-center text-xs uppercase">
          <span class="bg-white px-2 text-slate-500">Or continue with demo</span>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <UButton variant="outline" color="neutral" @click="loginAsDemo('teacher@example.com')" :disabled="loading"
          class="justify-center">
          Demo Teacher
        </UButton>
        <UButton variant="outline" color="neutral" @click="loginAsDemo('student@example.com')" :disabled="loading"
          class="justify-center">
          Demo Student
        </UButton>
      </div>
    </UForm>

    <p class="text-center text-sm text-slate-500">
      Don't have an account?
      <NuxtLink to="/auth/register" class="font-medium text-slate-900 hover:underline">
        Sign up
      </NuxtLink>
    </p>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useLmsClassStore } from '~/stores/lmsclass'

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
    await router.push('/classes')
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

const loginAsDemo = (email: string) => {
  form.value.email = email;
  form.value.password = 'password';
  handleLogin();
}
</script>
