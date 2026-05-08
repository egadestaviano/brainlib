<template>
  <div class="space-y-8">
    <div class="space-y-2">
      <h1 class="text-2xl font-bold text-slate-900">Create your Mentora account</h1>
      <p class="text-sm text-slate-500">Start your learning journey today</p>
    </div>

    <UForm :state="form" @submit="handleRegister" class="space-y-5">
      <UFormField label="Email" name="email" required>
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
          placeholder="Create a password"
          autocomplete="new-password"
        />
      </UFormField>

      <UFormField label="Confirm Password" name="confirmPassword" required>
        <UInput
          class="w-full"
          v-model="confirmPassword"
          type="password"
          size="lg"
          placeholder="Repeat your password"
          autocomplete="new-password"
        />
      </UFormField>

      <div class="flex items-center">
        <UCheckbox
          v-model="form.is_active"
          label="I agree to the Terms of Service"
          name="terms"
        />
      </div>

      <UButton
        type="submit"
        block
        :loading="loading"
        :disabled="loading || !isPasswordMatch"
        color="neutral"
        class="h-11 text-base font-medium"
      >
        {{ loading ? 'Creating account...' : 'Create Account' }}
      </UButton>

      <div class="relative py-2">
        <div class="absolute inset-0 flex items-center">
          <span class="w-full border-t border-slate-200" />
        </div>
        <div class="relative flex justify-center text-xs uppercase">
          <span class="bg-white px-2 text-slate-500">Or use demo accounts</span>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <UButton
          variant="outline"
          color="neutral"
          @click="registerAsDemo('teacher@example.com')"
          :disabled="loading"
          class="justify-center"
        >
          Demo Teacher
        </UButton>
        <UButton
          variant="outline"
          color="neutral"
          @click="registerAsDemo('student@example.com')"
          :disabled="loading"
          class="justify-center"
        >
          Demo Student
        </UButton>
      </div>
    </UForm>

    <p class="text-center text-sm text-slate-500">
      Already have an account?
      <NuxtLink to="/auth/login" class="font-medium text-slate-900 hover:underline">
        Sign in
      </NuxtLink>
    </p>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

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
      description: 'Password and confirmation password do not match',
      color: 'warning'
    })
    return
  }

  try {
    loading.value = true
    await authStore.register(form.value)
    await router.push('/classes')
  } catch (error: any) {
    useToast().add({
      title: 'Error',
      description: error.message || 'Registration failed, please try again',
      color: 'warning'
    })
  } finally {
    loading.value = false
  }
}

const registerAsDemo = (email: string) => {
  form.value.email = email;
  form.value.password = 'password';
  confirmPassword.value = 'password';
  form.value.is_active = true;
  handleRegister();
}
</script>
