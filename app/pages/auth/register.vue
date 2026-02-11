<template>
  <div class="flex min-h-screen">
    <div class="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div class="mx-auto w-full max-w-sm">
        <div class="space-y-6">
          <div class="space-y-2 text-center">
            <UAvatar
              size="2xl"
              src="/logo.svg"
              alt="Logo"
            />
            <h1 class="text-2xl font-semibold tracking-tight">
              Buat Akun Baru
            </h1>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Daftar untuk memulai pembelajaran Anda
            </p>
          </div>

          <UCard class="border-0 shadow-none">
            <form @submit.prevent="handleRegister">
              <div class="space-y-4">
                <UFormGroup label="Email" required>
                  <UInput
                    v-model="form.email"
                    type="email"
                    placeholder="nama@email.com"
                    autocomplete="email"
                    required
                  />
                </UFormGroup>

                <UFormGroup label="Password" required>
                  <UInput
                    v-model="form.password"
                    type="password"
                    placeholder="Buat password"
                    autocomplete="new-password"
                    required
                  />
                </UFormGroup>

                <UFormGroup label="Konfirmasi Password" required>
                  <UInput
                    v-model="confirmPassword"
                    type="password"
                    placeholder="Konfirmasi password"
                    autocomplete="new-password"
                    required
                  />
                </UFormGroup>

                <UCheckbox
                  v-model="form.is_active"
                  label="Saya setuju dengan syarat dan ketentuan"
                  name="terms"
                  required
                />

                <UButton
                  type="submit"
                  block
                  :loading="loading"
                  :disabled="loading || !isPasswordMatch"
                >
                  {{ loading ? 'Sedang Mendaftar...' : 'Daftar' }}
                </UButton>
              </div>
            </form>
          </UCard>

          <p class="text-center text-sm text-gray-500">
            Sudah punya akun?
            <UButton variant="link" to="/auth/login" size="sm">
              Masuk sekarang
            </UButton>
          </p>
        </div>
      </div>
    </div>

    <!-- Decorative Image -->
    <div class="relative hidden w-0 flex-1 lg:block">
      <img
        class="absolute inset-0 h-full w-full object-cover"
        src="https://images.unsplash.com/photo-1505144808419-1957a94ca61e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1908&q=80"
        alt="Background"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const authStore = useAuthStore()

definePageMeta({
  layout: 'auth'
})

const loading = ref(false)
const confirmPassword = ref('')
const form = ref<AuthRegister>({
  email: '',
  password: '',
  is_active: false
})

const isPasswordMatch = computed(() => {
  return form.value.password === confirmPassword.value
})

const handleRegister = async () => {
  if (!isPasswordMatch.value) {
    useToast().add({
      title: 'Error',
      description: 'Password dan konfirmasi password tidak cocok',
      color: 'warning'
    })
    return
  }

  try {
    loading.value = true
    await authStore.register(form.value)
    await router.push('/')
  } catch (error: any) {
    useToast().add({
      title: 'Error',
      description: error.message || 'Registrasi gagal, silakan coba lagi',
      color: 'warning'
    })
  } finally {
    loading.value = false
  }
}
</script>

<style>
:root {
  --primary-50: 238 242 255;
  --primary-100: 224 231 255;
  --primary-200: 199 210 254;
  --primary-300: 165 180 252;
  --primary-400: 129 140 248;
  --primary-500: 99 102 241;
  --primary-600: 79 70 229;
  --primary-700: 67 56 202;
  --primary-800: 55 48 163;
  --primary-900: 49 46 129;
  --primary-950: 30 27 75;
}
</style>