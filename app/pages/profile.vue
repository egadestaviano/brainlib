<template>
  <div class="max-w-2xl mx-auto py-8 space-y-8">
    <!-- Header -->
    <div>
      <h1 class="text-2xl font-bold text-slate-900">Profile</h1>
      <p class="text-sm text-slate-500 mt-1">Manage your account information</p>
    </div>

    <!-- Avatar & Basic Info -->
    <div class="bg-white rounded-2xl border border-slate-200 p-8">
      <div class="flex items-center gap-6">
        <div class="w-20 h-20 rounded-2xl bg-emerald-500 text-white flex items-center justify-center text-3xl font-bold shrink-0">
          {{ auth.user?.profile?.display_name?.[0]?.toUpperCase() || 'U' }}
        </div>
        <div class="min-w-0">
          <h2 class="text-xl font-bold text-slate-900">
            {{ auth.user?.profile?.display_name || 'No display name' }}
          </h2>
          <p class="text-sm text-slate-500">{{ auth.user?.email }}</p>
          <div class="flex items-center gap-2 mt-2">
            <span
              v-for="role in auth.user?.roles"
              :key="role"
              class="text-xs font-medium bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full"
            >
              {{ role }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Profile Form -->
    <div class="bg-white rounded-2xl border border-slate-200 p-8">
      <h3 class="text-lg font-semibold text-slate-900 mb-6">Edit Profile</h3>

      <UForm :state="form" @submit="handleUpdateProfile" class="space-y-5">
        <UFormField label="Display Name" name="display_name">
          <UInput
            v-model="form.display_name"
            placeholder="Your display name"
            class="w-full"
            size="lg"
          />
        </UFormField>

        <UFormField label="Bio" name="bio">
          <UTextarea
            v-model="form.bio"
            placeholder="Tell us about yourself..."
            :rows="3"
            class="w-full"
          />
        </UFormField>

        <div class="flex justify-end pt-2">
          <UButton
            type="submit"
            color="neutral"
            :loading="saving"
            :disabled="saving"
            class="px-6"
          >
            {{ saving ? 'Saving...' : 'Save Changes' }}
          </UButton>
        </div>
      </UForm>
    </div>

    <!-- Account Info -->
    <div class="bg-white rounded-2xl border border-slate-200 p-8">
      <h3 class="text-lg font-semibold text-slate-900 mb-6">Account Information</h3>

      <div class="space-y-4">
        <div class="flex items-center justify-between py-3 border-b border-slate-100">
          <div>
            <p class="text-sm font-medium text-slate-700">Email</p>
            <p class="text-sm text-slate-500">{{ auth.user?.email }}</p>
          </div>
        </div>

        <div class="flex items-center justify-between py-3 border-b border-slate-100">
          <div>
            <p class="text-sm font-medium text-slate-700">Account Status</p>
            <p class="text-sm text-slate-500">
              <span :class="auth.user?.is_active ? 'text-emerald-600' : 'text-red-600'">
                {{ auth.user?.is_active ? 'Active' : 'Inactive' }}
              </span>
            </p>
          </div>
        </div>

        <div class="flex items-center justify-between py-3">
          <div>
            <p class="text-sm font-medium text-slate-700">Member Since</p>
            <p class="text-sm text-slate-500">{{ formatDate(auth.user?.created_at) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { userService } from '~/services/userService'

const auth = useAuthStore()
const toast = useToast()
const saving = ref(false)

const form = reactive({
  display_name: auth.user?.profile?.display_name || '',
  bio: auth.user?.profile?.bio || '',
})

watch(() => auth.user, (user) => {
  if (user) {
    form.display_name = user.profile?.display_name || ''
    form.bio = user.profile?.bio || ''
  }
}, { immediate: true })

const handleUpdateProfile = async () => {
  try {
    saving.value = true
    await userService.update({
      id: auth.user!.id,
      name: form.display_name,
    })
    await auth.fetchCurrentUser()
    toast.add({ title: 'Profile updated successfully', color: 'success' })
  } catch (error: any) {
    toast.add({
      title: 'Failed to update profile',
      description: error.message || 'Please try again',
      color: 'error',
    })
  } finally {
    saving.value = false
  }
}

function formatDate(dateStr?: string) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>
