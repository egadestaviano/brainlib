<template>
  <div class="space-y-6 max-w-6xl">
    <!-- Header -->
    <div class="flex items-center gap-4">
      <div
        class="hidden sm:flex w-12 h-12 rounded-2xl bg-blue-50 items-center justify-center ring-1 ring-blue-100">
        <UIcon name="heroicons-user-circle" class="h-6 w-6 text-blue-600" />
      </div>
      <div>
        <h1 class="text-3xl font-bold tracking-tight text-slate-900">Profile</h1>
        <p class="text-sm text-slate-500 mt-0.5">Manage your account information and preferences</p>
      </div>
    </div>

    <!-- Profile Hero Card -->
    <div class="relative bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <!-- Gradient banner -->
      <div class="h-24 bg-gradient-to-br from-blue-500 to-blue-600 relative">
        <div
          class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.25),transparent_60%)]" />
      </div>

      <div class="px-6 pb-6 -mt-12 relative">
        <div class="flex flex-col lg:flex-row lg:items-end gap-5" data-walkthrough="profile-avatar">
          <div
            class="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center text-4xl font-bold shrink-0 ring-4 ring-white shadow-md">
            {{ auth.user?.profile?.display_name?.[0]?.toUpperCase() || 'U' }}
          </div>

          <div class="flex-1 min-w-0 lg:pb-1 mt-1">
            <div class="flex items-center justify-between gap-4">
              <div class="flex flex-col items-start gap-4">
                <h2 class="text-2xl font-bold tracking-tight text-white truncate">
                  {{ auth.user?.profile?.display_name || 'No display name' }}
                </h2>
                <p class="text-sm text-slate-500 mt-0.5 truncate">{{ auth.user?.email }}</p>
              </div>
            </div>
            <div class="flex flex-wrap items-center gap-1.5 mt-3">
              <span v-for="role in auth.user?.roles" :key="role"
                class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-violet-50 text-violet-700 ring-1 ring-violet-100 text-[11px] font-semibold uppercase tracking-wider">
                <UIcon name="heroicons-shield-check" class="h-3 w-3" />
                {{ role }}
              </span>
              <span v-if="auth.user?.is_active"
                class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 ring-1 ring-blue-100 text-[11px] font-semibold uppercase tracking-wider">
                <span class="w-1.5 h-1.5 rounded-full bg-blue-500" />
                Active
              </span>
            </div>
          </div>
        </div>

        <!-- Bio preview -->
        <div v-if="auth.user?.profile?.bio" class="mt-6 pt-5 border-t border-slate-100">
          <p class="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
            {{ auth.user.profile.bio }}
          </p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Edit Profile Form (2 cols) -->
      <div data-walkthrough="profile-info" class="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center ring-1 ring-sky-100 shrink-0">
            <UIcon name="heroicons-pencil-square" class="h-5 w-5 text-sky-600" />
          </div>
          <div>
            <h3 class="font-semibold text-slate-900">Edit Profile</h3>
            <p class="text-xs text-slate-500">Update how others see you on the platform</p>
          </div>
        </div>

        <UForm :state="form" @submit="handleUpdateProfile">
          <div class="px-6 py-6 space-y-5">
            <UFormField label="Display Name" name="display_name" hint="Shown on your classes and posts">
              <UInput v-model="form.display_name" placeholder="Your display name" class="w-full" size="lg"
                icon="heroicons-user" />
            </UFormField>

            <UFormField label="Bio" name="bio" hint="Tell others a bit about yourself">
              <UTextarea v-model="form.bio" placeholder="e.g. Math teacher with 10 years of experience..." :rows="4"
                class="w-full" />
            </UFormField>
          </div>

          <div class="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
            <UButton variant="ghost" color="neutral" type="button" @click="resetForm">
              Reset
            </UButton>
            <UButton data-walkthrough="profile-save-btn" type="submit" color="primary" icon="heroicons-check" :loading="saving"
              :disabled="saving || !hasChanges">
              Save Changes
            </UButton>
          </div>
        </UForm>
      </div>

      <!-- Account Info -->
      <div data-walkthrough="profile-settings" class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="px-6 py-5 border-b border-slate-100 flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center ring-1 ring-slate-200 shrink-0">
            <UIcon name="heroicons-information-circle" class="h-5 w-5 text-slate-600" />
          </div>
          <div>
            <h3 class="font-semibold text-slate-900">Account</h3>
            <p class="text-xs text-slate-500">Read-only details</p>
          </div>
        </div>

        <ul class="divide-y divide-slate-100">
          <li class="px-6 py-4">
            <div class="flex items-center gap-2.5 mb-1">
              <UIcon name="heroicons-envelope" class="h-3.5 w-3.5 text-slate-400" />
              <p class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Email</p>
            </div>
            <p class="text-sm text-slate-900 font-medium truncate">{{ auth.user?.email }}</p>
          </li>

          <li class="px-6 py-4">
            <div class="flex items-center gap-2.5 mb-1">
              <UIcon name="heroicons-bolt" class="h-3.5 w-3.5 text-slate-400" />
              <p class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Status</p>
            </div>
            <span :class="[
              'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold',
              auth.user?.is_active ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-100' : 'bg-red-50 text-red-700 ring-1 ring-red-100'
            ]">
              <span :class="['w-1.5 h-1.5 rounded-full', auth.user?.is_active ? 'bg-blue-500' : 'bg-red-500']" />
              {{ auth.user?.is_active ? 'Active' : 'Inactive' }}
            </span>
          </li>

          <li class="px-6 py-4">
            <div class="flex items-center gap-2.5 mb-1">
              <UIcon name="heroicons-calendar" class="h-3.5 w-3.5 text-slate-400" />
              <p class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Member Since</p>
            </div>
            <p class="text-sm text-slate-900 font-medium">{{ formatDate(auth.user?.created_at) }}</p>
          </li>

          <li v-if="auth.user?.id" class="px-6 py-4">
            <div class="flex items-center gap-2.5 mb-1">
              <UIcon name="heroicons-identification" class="h-3.5 w-3.5 text-slate-400" />
              <p class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">User ID</p>
            </div>
            <p class="text-sm text-slate-900 font-mono">#{{ auth.user.id }}</p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { api } from '~/utils/api'

const auth = useAuthStore()
const toast = useToast()
const saving = ref(false)

const form = reactive({
  display_name: auth.user?.profile?.display_name || '',
  bio: auth.user?.profile?.bio || '',
})

const hasChanges = computed(() => {
  return (
    form.display_name !== (auth.user?.profile?.display_name || '') ||
    form.bio !== (auth.user?.profile?.bio || '')
  )
})

watch(() => auth.user, (user) => {
  if (user) {
    form.display_name = user.profile?.display_name || ''
    form.bio = user.profile?.bio || ''
  }
}, { immediate: true })

const resetForm = () => {
  form.display_name = auth.user?.profile?.display_name || ''
  form.bio = auth.user?.profile?.bio || ''
}

const handleUpdateProfile = async () => {
  try {
    saving.value = true
    if (!auth.user?.profile?.id) {
      throw new Error('Profile not found')
    }
    await api.put(`/user-profiles/${auth.user.profile.id}`, {
      display_name: form.display_name,
      bio: form.bio
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
