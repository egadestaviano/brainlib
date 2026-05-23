<template>
  <div>
    <!-- Page Header -->
    <div data-walkthrough="class-search" class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div class="flex items-center gap-4">
        <div class="hidden sm:flex w-12 h-12 rounded-2xl bg-blue-50 items-center justify-center ring-1 ring-blue-100">
          <UIcon name="heroicons-academic-cap" class="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h1 class="text-3xl font-bold tracking-tight text-slate-900">My Classes</h1>
          <p class="text-sm text-slate-500 mt-0.5">
            <span class="font-medium text-slate-700">{{ LmsClassStore.clases?.length || 0 }}</span>
            {{ (LmsClassStore.clases?.length || 0) === 1 ? 'class' : 'classes' }} ·
            <span>{{ isTeacherOrAdmin ? 'Manage and create your classes' : 'Continue your learning journey' }}</span>
          </p>
        </div>
      </div>
      <div class="flex items-center gap-2 shrink-0">
        <UButton
          v-if="!isTeacherOrAdmin"
          size="lg"
          color="primary"
          icon="heroicons-arrow-right-on-rectangle"
          class="shadow-sm hover:shadow-md transition-shadow"
          data-walkthrough="class-create-btn"
          @click="modalJoin = true"
        >
          Join Class
        </UButton>
        <UButton
          v-if="isTeacherOrAdmin"
          size="lg"
          color="primary"
          icon="heroicons-plus"
          class="shadow-sm hover:shadow-md transition-shadow"
          data-walkthrough="class-create-btn"
          @click="modalCreate = true"
        >
          Create Class
        </UButton>
      </div>
    </div>

    <!-- Skeleton Loading -->
    <div v-if="LmsClassStore.loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <div v-for="n in 6" :key="n" class="bg-white rounded-xl border border-slate-200 p-5 space-y-4 animate-pulse">
        <div class="space-y-2">
          <USkeleton class="h-5 w-2/3 rounded" />
          <USkeleton class="h-4 w-full rounded" />
        </div>
        <div class="flex items-center gap-3 pt-2">
          <USkeleton class="h-9 w-9 rounded-full" />
          <div class="space-y-1.5 flex-1">
            <USkeleton class="h-3.5 w-24 rounded" />
            <USkeleton class="h-3 w-32 rounded" />
          </div>
        </div>
        <div class="pt-2 border-t border-slate-100">
          <USkeleton class="h-3.5 w-20 rounded" />
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!LmsClassStore.clases || LmsClassStore.clases.length === 0"
      class="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
      <div class="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
        <UIcon name="heroicons-academic-cap" class="h-8 w-8 text-slate-400" />
      </div>
      <h3 class="text-lg font-semibold text-slate-700">No classes yet</h3>
      <p class="text-sm text-slate-500 mt-1 mb-6">
        {{ isTeacherOrAdmin ? 'Create your first class to get started' : 'Join a class with the code from your teacher' }}
      </p>
      <UButton v-if="isTeacherOrAdmin" color="neutral" icon="heroicons-plus" @click="modalCreate = true">Create Class</UButton>
      <UButton v-else color="neutral" icon="heroicons-arrow-right-on-rectangle" @click="modalJoin = true">Join Class</UButton>
    </div>

    <!-- Data State -->
    <div v-else data-walkthrough="class-list" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      <NuxtLink
        v-for="(classList, index) in LmsClassStore.clases"
        :key="classList.id"
        :to="'/classes/' + classList.id"
        :data-walkthrough="index === 0 ? 'class-card' : undefined"
        class="group relative bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 hover:border-slate-300 transition-all duration-200 flex flex-col"
      >
        <!-- Banner -->
        <div :class="['relative h-24 flex items-end p-4', cardColor(classList.id)]">
          <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/25 text-[11px] font-medium text-white">
            <UIcon name="heroicons-academic-cap" class="h-3 w-3" />
            {{ classList.visibility || 'Class' }}
          </span>
          <button
            v-if="classList.code"
            type="button"
            @click.prevent.stop="copyCode(classList.code!, classList.id)"
            :title="copiedId === classList.id ? 'Copied!' : 'Click to copy class code'"
            class="group/code absolute top-3 right-3 inline-flex items-center rounded-md bg-white/20 hover:bg-white/30 px-2 py-1 text-xs font-mono text-white transition cursor-pointer"
          >
            <span>{{ classList.code }}</span>
            <span class="inline-flex items-center justify-center w-0 opacity-0 group-hover/code:w-3.5 group-hover/code:opacity-100 group-hover/code:ml-1.5 transition-all duration-200 overflow-hidden">
              <UIcon
                :name="copiedId === classList.id ? 'heroicons-check' : 'heroicons-clipboard-document'"
                class="h-3.5 w-3.5 shrink-0"
              />
            </span>
          </button>
        </div>

        <!-- Body -->
        <div class="p-5 flex-1 flex flex-col">
          <h2 class="text-base font-semibold text-slate-900 line-clamp-1 group-hover:text-slate-700">
            {{ classList.title }}
          </h2>
          <p class="text-sm text-slate-500 line-clamp-2 mt-1 min-h-[2.5rem]">
            {{ classList.description || 'No description provided.' }}
          </p>

          <div class="flex items-center gap-2.5 mt-4">
            <div
              :class="avatarColor(classList.id)"
              class="w-8 h-8 rounded-full text-white flex items-center justify-center font-semibold text-xs shrink-0 ring-2 ring-white shadow-sm"
            >
              {{ classList.creator.profile?.display_name?.[0]?.toUpperCase() || classList.title[0]?.toUpperCase() }}
            </div>
            <div class="min-w-0 flex-1">
              <p class="text-xs font-medium text-slate-800 truncate">
                {{ classList.creator.profile?.display_name }}
              </p>
              <p class="text-[11px] text-slate-500 truncate">Teacher</p>
            </div>
          </div>

          <div class="mt-auto pt-4 border-t border-slate-100 space-y-3">
            <div class="flex items-center gap-4 text-xs text-slate-500">
              <div class="flex items-center gap-1.5">
                <UIcon name="heroicons-users" class="h-3.5 w-3.5" />
                <span><span class="font-medium text-slate-700">{{ classList.member_count }}</span> students</span>
              </div>
              <div class="flex items-center gap-1.5">
                <UIcon name="heroicons-book-open" class="h-3.5 w-3.5" />
                <span><span class="font-medium text-slate-700">{{ classList.lesson_count || 0 }}</span> lessons</span>
              </div>
            </div>
            <span class="inline-flex w-full mt-5 items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-slate-50 border text-xs font-medium text-slate-700 group-hover:bg-slate-700 group-hover:text-white transition">
              {{ isTeacherOrAdmin ? 'Manage Class' : 'Open Class' }}
            </span>
          </div>
        </div>
      </NuxtLink>
    </div>

    <!-- Create Class Modal -->
    <UModal v-model:open="modalCreate" :ui="{ content: 'sm:max-w-lg' }" @close="handleCancelCreate">
      <template #content>
        <div data-walkthrough="create-class-modal">
          <!-- Header with accent -->
          <div class="px-6 pt-6 pb-5 border-b border-slate-100">
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center ring-1 ring-blue-100 shrink-0">
                <UIcon name="heroicons-academic-cap" class="h-6 w-6 text-blue-600" />
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="text-xl font-semibold text-slate-900 tracking-tight">Create New Class</h3>
                <p class="text-sm text-slate-500 mt-0.5">Set up a new class for your students. You can edit details later.</p>
              </div>
            </div>
          </div>

          <UForm :schema="createSchema" :state="createState" @submit="handleCreate">
            <div class="px-6 py-6 space-y-5">
              <UFormField label="Class Title" name="title" required>
                <UInput v-model="createState.title" placeholder="e.g. Mathematics 101" class="w-full" size="lg" />
              </UFormField>

              <UFormField label="Description" name="description" required hint="A brief overview shown to students">
                <UTextarea v-model="createState.description" placeholder="What will students learn in this class?" :rows="4" class="w-full" />
              </UFormField>

              <div v-if="createError" class="flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg px-3 py-2.5">
                <UIcon name="heroicons-exclamation-circle" class="h-5 w-5 shrink-0 mt-0.5" />
                <div class="flex-1">
                  <p>{{ createError }}</p>
                  <button
                    v-if="createLimitReached && !isAdmin"
                    type="button"
                    class="mt-1 inline-flex items-center gap-1 text-red-700 font-medium underline underline-offset-2 hover:text-red-800"
                    @click="goToSubscription"
                  >
                    View subscription plans
                    <UIcon name="heroicons-arrow-right" class="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>

            <div class="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2 rounded-b-xl">
              <UButton @click.stop="handleCancelCreate" type="button" variant="ghost" color="neutral" size="lg">
                Cancel
              </UButton>
              <UButton type="submit" color="primary" size="lg" :loading="LmsClassStore.loading" icon="heroicons-plus">
                Create Class
              </UButton>
            </div>
          </UForm>
        </div>
      </template>
    </UModal>

    <!-- Join Class Modal -->
    <UModal v-model:open="modalJoin" :ui="{ content: 'sm:max-w-md' }" @close="handleCancelJoin">
      <template #content>
        <div>
          <!-- Header with accent -->
          <div class="px-6 pt-6 pb-5 border-b border-slate-100">
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 rounded-2xl bg-sky-50 flex items-center justify-center ring-1 ring-sky-100 shrink-0">
                <UIcon name="heroicons-arrow-right-on-rectangle" class="h-6 w-6 text-sky-600" />
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="text-xl font-semibold text-slate-900 tracking-tight">Join a Class</h3>
                <p class="text-sm text-slate-500 mt-0.5">Enter the class code shared by your teacher to enroll.</p>
              </div>
            </div>
          </div>

          <UForm :schema="joinSchema" :state="joinState" @submit="handleJoin">
            <div class="px-6 py-6 space-y-5">
              <UFormField label="Class Code" name="code" required hint="Usually a short alphanumeric code">
                <UInput
                  v-model="joinState.code"
                  placeholder="e.g. ABC123"
                  class="w-full"
                  size="xl"
                  :ui="{ base: 'font-mono tracking-widest text-center uppercase' }"
                />
              </UFormField>

              <div v-if="joinError" class="flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg px-3 py-2.5">
                <UIcon name="heroicons-exclamation-circle" class="h-5 w-5 shrink-0 mt-0.5" />
                <p>{{ joinError }}</p>
              </div>
            </div>

            <div class="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2 rounded-b-xl">
              <UButton @click.prevent="handleCancelJoin" type="button" variant="ghost" color="neutral" size="lg">
                Cancel
              </UButton>
              <UButton type="submit" color="primary" size="lg" :loading="LmsClassStore.loading" icon="heroicons-arrow-right-on-rectangle">
                Join Class
              </UButton>
            </div>
          </UForm>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import * as v from 'valibot'
import type { FormSubmitEvent } from '@nuxt/ui'
import { useLmsClassStore } from '~/stores/lmsclass'
import { useAuthStore } from '~/stores/auth'

const LmsClassStore = useLmsClassStore()
const authStore = useAuthStore()
const toast = useToast()

const isAdmin = computed(() => {
  const roles = authStore.user?.roles?.map(r => r.toLowerCase()) || []
  return roles.includes('admin')
})

const isTeacherOrAdmin = computed(() => {
  const roles = authStore.user?.roles?.map(r => r.toLowerCase()) || []
  return roles.includes('teacher') || roles.includes('admin')
})

const colors = ['bg-blue-500', 'bg-violet-500', 'bg-amber-500', 'bg-rose-500', 'bg-sky-500']

function avatarColor(id: number) {
  return colors[id % colors.length]
}

function cardColor(id: number) {
  return colors[id % colors.length]
}

const copiedId = ref<number | null>(null)
async function copyCode(code: string, id: number) {
  try {
    await navigator.clipboard.writeText(code)
    copiedId.value = id
    toast.add({ title: 'Class code copied', description: code, color: 'success' })
    setTimeout(() => {
      if (copiedId.value === id) copiedId.value = null
    }, 1500)
  } catch {
    toast.add({ title: 'Failed to copy code', color: 'error' })
  }
}

const createSchema = v.object({
  title: v.pipe(v.string(), v.minLength(1, 'Title is required')),
  description: v.pipe(v.string(), v.minLength(1, 'Description is required')),
})

const joinSchema = v.object({
  code: v.pipe(v.string(), v.minLength(1, 'Class code is required')),
})

type CreateSchema = v.InferOutput<typeof createSchema>
type JoinSchema = v.InferOutput<typeof joinSchema>

const modalCreate = ref(false)
const modalJoin = ref(false)

const createError = ref<string | null>(null)
const createLimitReached = ref(false)
const joinError = ref<string | null>(null)

const createState = reactive<CreateLmsClass>({
  title: '',
  description: '',
})

const joinState = reactive({
  code: '',
})

const handleCancelCreate = () => {
  modalCreate.value = false
  createError.value = null
  createLimitReached.value = false
  setTimeout(() => {
    createState.title = ''
    createState.description = ''
  }, 200)
}

const handleCancelJoin = () => {
  modalJoin.value = false
  joinError.value = null
  setTimeout(() => {
    joinState.code = ''
  }, 200)
}

const goToSubscription = () => {
  modalCreate.value = false
  navigateTo('/subscription')
}

const handleCreate = async (event: FormSubmitEvent<CreateSchema>) => {
  createError.value = null
  createLimitReached.value = false
  try {
    await LmsClassStore.createClass(event.data)
    modalCreate.value = false
    createState.title = ''
    createState.description = ''
    toast.add({ title: 'Class created successfully', color: 'success' })
  } catch (error: any) {
    createLimitReached.value = error?.status === 403
    createError.value = LmsClassStore.error || 'Failed to create class'
  }
}

const handleJoin = async (event: FormSubmitEvent<JoinSchema>) => {
  joinError.value = null
  try {
    await LmsClassStore.joinClassByCode(event.data.code)
    modalJoin.value = false
    joinState.code = ''
    toast.add({ title: 'Joined class successfully', color: 'success' })
  } catch (error: any) {
    joinError.value = LmsClassStore.error || 'Failed to join class'
  }
}

onMounted(() => {
  LmsClassStore.getMyClass()
})
</script>
