<template>
  <div
    class="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 px-4"
  >
    <UCard
      class="w-full max-w-md shadow-md border border-gray-200 dark:border-gray-800 rounded-xl p-8 space-y-6"
    >
      <div class="text-center space-y-3 mb-10">
        <h1 class="text-2xl font-bold">Sign Up to BrainLib</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Register to start your learning
        </p>
      </div>
      <UForm :state="form" @submit="handleRegister" class="space-y-5">
        <UFormField label="Email" name="email" required>
          <UInput
            class="w-full"
            v-model="form.email"
            type="email"
            size="lg"
            placeholder="Enter your email"
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
        <UFormField label="Confirm Password" name="confirm_password" required>
          <UInput
            class="w-full"
            v-model="confirmPassword"
            type="password"
            size="lg"
            placeholder="Confirm your password"
            autocomplete="new-password"
          />
        </UFormField>
        <UCheckbox
          v-model="form.is_active"
          label="I agree to the terms and conditions"
          name="terms"
          required
        />
        <UButton
          type="submit"
          block
          :loading="loading"
          :disabled="loading || !isPasswordMatch"
          class="h-11 text-base font-medium"
        >
          {{ loading ? "Registering..." : "Sign Up" }}
        </UButton>
      </UForm>
      <p class="text-center text-sm text-gray-500">
        Already have an account?
        <UButton variant="link" to="/auth/login" size="sm">
          Sign in now
        </UButton>
      </p>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const router = useRouter();
const authStore = useAuthStore();

definePageMeta({
  layout: "auth",
});

const loading = ref(false);
const confirmPassword = ref("");
const form = ref<AuthRegister>({
  email: "",
  password: "",
  is_active: false,
});

const isPasswordMatch = computed(() => {
  return form.value.password === confirmPassword.value;
});

const handleRegister = async () => {
  if (!isPasswordMatch.value) {
    useToast().add({
      title: "Error",
      description: "Password dan konfirmasi password tidak cocok",
      color: "warning",
    });
    return;
  }

  try {
    loading.value = true;
    await authStore.register(form.value);
    await router.push("/");
  } catch (error: any) {
    useToast().add({
      title: "Error",
      description: error.message || "Registrasi gagal, silakan coba lagi",
      color: "warning",
    });
  } finally {
    loading.value = false;
  }
};
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
