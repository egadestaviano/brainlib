<template>
  <div>
    <!-- Skeleton Loading -->
    <div v-if="lmsClassStore.detailLoading" class="space-y-6 animate-pulse">
      <!-- Breadcrumb skeleton -->
      <div class="flex items-center gap-2">
        <USkeleton class="h-4 w-16 rounded" />
        <USkeleton class="h-4 w-4 rounded" />
        <USkeleton class="h-4 w-40 rounded" />
      </div>

      <!-- Stats skeleton -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div v-for="n in 4" :key="n" class="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
          <USkeleton class="h-4 w-20 rounded" />
          <USkeleton class="h-6 w-28 rounded" />
        </div>
      </div>

      <!-- Tabs skeleton -->
      <div class="flex gap-4 border-b border-slate-200 pb-3">
        <USkeleton class="h-8 w-24 rounded" />
        <USkeleton class="h-8 w-24 rounded" />
      </div>

      <!-- Content skeleton -->
      <div class="space-y-3">
        <div v-for="n in 3" :key="n" class="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4">
          <USkeleton class="h-5 w-5 rounded" />
          <div class="flex-1 space-y-2">
            <USkeleton class="h-5 w-1/3 rounded" />
            <USkeleton class="h-4 w-2/3 rounded" />
          </div>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div v-else-if="lmsClassStore.classDetail" class="space-y-6">
      <!-- Breadcrumb -->
      <nav class="flex items-center gap-2 text-sm">
        <NuxtLink to="/home" class="text-slate-500 hover:text-slate-700 transition-colors">Home</NuxtLink>
        <UIcon name="heroicons-chevron-right" class="h-3.5 w-3.5 text-slate-400" />
        <span class="text-slate-900 font-medium">{{ lmsClassStore.classDetail.title }}</span>
      </nav>

      <!-- Stats Grid -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white rounded-xl border border-slate-200 p-4">
          <div class="flex items-center gap-2 text-slate-500 text-sm mb-1">
            <UIcon name="heroicons-user" class="h-4 w-4" />
            <span>Teacher</span>
          </div>
          <p class="text-slate-900 font-semibold truncate">
            {{ lmsClassStore.classDetail.creator.profile?.display_name }}
          </p>
        </div>

        <div class="bg-white rounded-xl border border-slate-200 p-4">
          <div class="flex items-center gap-2 text-slate-500 text-sm mb-1">
            <UIcon name="heroicons-users" class="h-4 w-4" />
            <span>Students</span>
          </div>
          <p class="text-slate-900 font-semibold">
            {{ lmsClassStore.classDetail.memberships?.length || 0 }}
          </p>
        </div>

        <div class="bg-white rounded-xl border border-slate-200 p-4">
          <div class="flex items-center gap-2 text-slate-500 text-sm mb-1">
            <UIcon name="heroicons-key" class="h-4 w-4" />
            <span>Class Code</span>
          </div>
          <div class="flex items-center gap-2">
            <p class="text-slate-900 font-semibold font-mono">
              {{ lmsClassStore.classDetail.code }}
            </p>
            <UTooltip :text="copied ? 'Copied!' : 'Copy code'">
              <button
                @click="copyCode"
                class="p-1 rounded hover:bg-slate-100 transition-colors"
              >
                <UIcon
                  :name="copied ? 'heroicons-check' : 'heroicons-clipboard-document'"
                  :class="['h-4 w-4', copied ? 'text-emerald-500' : 'text-slate-400']"
                />
              </button>
            </UTooltip>
          </div>
        </div>

        <div class="bg-white rounded-xl border border-slate-200 p-4">
          <div class="flex items-center gap-2 text-slate-500 text-sm mb-1">
            <UIcon name="heroicons-book-open" class="h-4 w-4" />
            <span>Lessons</span>
          </div>
          <p class="text-slate-900 font-semibold">
            {{ lmsClassStore.classDetail.lessons?.length || 0 }}
          </p>
        </div>
      </div>

      <!-- Tabs -->
      <UTabs :items="tabs">
        <template #lessons>
          <ClassComTabLessons :class-id="classId" />
        </template>

        <template #students>
          <ClassComTabStudents :class-id="classId" />
        </template>
      </UTabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLmsClassStore } from "~/stores/lmsclass"
const route = useRoute()
const lmsClassStore = useLmsClassStore()
const classId = computed(() => Number(route.params.id) || 1)

const copied = ref(false)

const copyCode = async () => {
  const code = lmsClassStore.classDetail?.code
  if (!code) return
  await navigator.clipboard.writeText(code)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}

const tabs = [
  { label: 'Lessons', slot: 'lessons' },
  { label: 'Students', slot: 'students' },
]

onMounted(async () => {
  await lmsClassStore.getDetailsClass(classId.value)
})

watch(() => route.params.id, async (newId) => {
  if (newId) {
    await lmsClassStore.getDetailsClass(Number(newId))
  }
})
</script>
