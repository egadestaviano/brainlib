<template>
  <div>
    <!-- Skeleton Loading -->
    <div v-if="lmsClassStore.detailLoading" class="space-y-6 animate-pulse">
      <USkeleton class="h-4 w-64 rounded" />
      <USkeleton class="h-44 w-full rounded-2xl" />
      <div class="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <USkeleton v-for="n in 3" :key="n" class="h-24 rounded-xl" />
      </div>
      <USkeleton class="h-10 w-full rounded-xl" />
      <div class="space-y-3">
        <USkeleton v-for="n in 3" :key="n" class="h-20 w-full rounded-xl" />
      </div>
    </div>

    <!-- Content -->
    <div v-else-if="lmsClassStore.classDetail" class="space-y-6">
      <!-- Breadcrumb -->
      <nav data-walkthrough="class-detail-breadcrumb" class="flex items-center gap-2 text-sm">
        <NuxtLink to="/classes" class="inline-flex items-center gap-1 text-slate-500 hover:text-slate-700 transition-colors">
          <UIcon name="heroicons-arrow-left" class="h-3.5 w-3.5" />
          My Classes
        </NuxtLink>
        <UIcon name="heroicons-chevron-right" class="h-3.5 w-3.5 text-slate-400" />
        <span class="text-slate-900 font-medium truncate">{{ lmsClassStore.classDetail.title }}</span>
      </nav>

      <!-- Hero Header -->
      <div data-walkthrough="class-detail-hero" class="relative bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <!-- Color banner (decorative strip only) -->
        <div :class="['h-16 sm:h-20 relative', cardColor(lmsClassStore.classDetail.id)]">
          <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.25),transparent_60%)]"></div>
          <div class="absolute top-3 right-3 sm:top-4 sm:right-4 flex flex-col items-end gap-2">
            <span class="inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-full bg-white/30 backdrop-blur-sm text-[10px] sm:text-[11px] font-semibold text-white capitalize">
              <UIcon name="heroicons-academic-cap" class="h-3 w-3" />
              {{ lmsClassStore.classDetail.visibility || 'Class' }}
            </span>
            <button
              type="button"
              @click="copyCode"
              :title="copied ? 'Copied!' : 'Click to copy'"
              data-walkthrough="class-detail-code"
              class="group text-white inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 rounded-lg bg-white/30 hover:bg-white shadow-sm border border-white/40 transition cursor-pointer"
            >
              <span class="font-mono font-semibold tracking-widest text-xs sm:text-sm text-white">{{ lmsClassStore.classDetail.code }}</span>
              <UIcon
                :name="copied ? 'heroicons-check' : 'heroicons-clipboard-document'"
                :class="['h-3.5 w-3.5 sm:h-4 sm:w-4 transition', copied ? 'text-blue-500' : 'text-white group-hover:text-slate-700']"
              />
            </button>
          </div>
        </div>

        <!-- Title row (white background) -->
        <div class="px-4 sm:px-6 pb-5 sm:pb-6 -mt-8 sm:-mt-10 relative">
          <div class="flex items-end gap-3 sm:gap-4 mb-4 sm:mb-5">
            <div
              :class="cardColor(lmsClassStore.classDetail.id)"
              class="w-14 h-14 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl text-white flex items-center justify-center font-bold text-xl sm:text-3xl shrink-0 ring-3 sm:ring-4 ring-white shadow-md"
            >
              {{ lmsClassStore.classDetail.title[0]?.toUpperCase() }}
            </div>
          </div>

          <div class="min-w-0">
            <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-slate-900">
              {{ lmsClassStore.classDetail.title }}
            </h1>
            <p v-if="lmsClassStore.classDetail.description" class="text-xs sm:text-sm text-slate-600 mt-1.5 sm:mt-2 leading-relaxed line-clamp-3">
              {{ lmsClassStore.classDetail.description }}
            </p>
          </div>

          <!-- Meta row -->
          <div data-walkthrough="class-detail-meta" class="mt-4 sm:mt-6 pt-4 sm:pt-5 border-t border-slate-100 grid grid-cols-2 sm:flex sm:flex-wrap sm:items-center gap-x-4 sm:gap-x-6 gap-y-3 text-xs sm:text-sm">
            <div class="flex items-center gap-2 sm:gap-2.5 col-span-2 sm:col-span-1">
              <div :class="avatarColor(lmsClassStore.classDetail.id)" class="w-7 h-7 sm:w-8 sm:h-8 rounded-full text-white flex items-center justify-center font-semibold text-[10px] sm:text-xs shrink-0">
                {{ lmsClassStore.classDetail.creator.profile?.display_name?.[0]?.toUpperCase() }}
              </div>
              <div class="min-w-0">
                <p class="text-[10px] sm:text-xs text-slate-500 leading-tight">Teacher</p>
                <p class="text-xs sm:text-sm font-medium text-slate-900 leading-tight truncate">
                  {{ lmsClassStore.classDetail.creator.profile?.display_name }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-1.5 sm:gap-2 text-slate-600">
              <UIcon name="heroicons-users" class="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-400" />
              <span><span class="font-semibold text-slate-900">{{ lmsClassStore.classDetail.memberships?.length || 0 }}</span> students</span>
            </div>

            <div class="flex items-center gap-1.5 sm:gap-2 text-slate-600">
              <UIcon name="heroicons-book-open" class="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-400" />
              <span><span class="font-semibold text-slate-900">{{ lmsClassStore.classDetail.lessons?.length || 0 }}</span> lessons</span>
            </div>

            <div v-if="lmsClassStore.classDetail.created_at" class="flex items-center gap-1.5 sm:gap-2 text-slate-600 col-span-2 sm:col-span-1">
              <UIcon name="heroicons-calendar" class="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-400" />
              <span>Created {{ formatDate(lmsClassStore.classDetail.created_at) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div data-walkthrough="class-detail-tabs" class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="px-2 pt-2 border-b border-slate-100 overflow-x-auto scrollbar-hide">
          <div class="flex items-center gap-1 min-w-max">
            <button
              v-for="tab in tabs"
              :key="tab.slot"
              type="button"
              @click="activeTab = tab.slot"
              :class="[
                'relative inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium transition rounded-t-lg whitespace-nowrap',
                activeTab === tab.slot
                  ? 'text-blue-700'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              ]"
            >
              <UIcon :name="tab.icon" class="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              {{ tab.label }}
              <span v-if="tab.count !== undefined" :class="[
                'inline-flex items-center justify-center min-w-5 h-5 px-1.5 text-[10px] sm:text-[11px] font-semibold rounded-full',
                activeTab === tab.slot ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
              ]">
                {{ tab.count }}
              </span>
              <span v-if="activeTab === tab.slot" class="absolute bottom-0 left-2 right-2 h-0.5 bg-blue-500 rounded-full"></span>
            </button>
          </div>
        </div>

        <div class="p-3 sm:p-4 md:p-6">
          <ClassComTabLessons v-if="activeTab === 'lessons'" :class-id="classId" />
          <ClassComTabStudents v-else-if="activeTab === 'students'" :class-id="classId" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLmsClassStore } from '~/stores/lmsclass'

const route = useRoute()
const lmsClassStore = useLmsClassStore()
const classId = computed(() => Number(route.params.id) || 1)

const copied = ref(false)
const activeTab = ref<'lessons' | 'students'>('lessons')

const copyCode = async () => {
  const code = lmsClassStore.classDetail?.code
  if (!code) return
  await navigator.clipboard.writeText(code)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}

const colors = ['bg-blue-500', 'bg-violet-500', 'bg-amber-500', 'bg-rose-500', 'bg-sky-500']

function cardColor(id: number) {
  return colors[id % colors.length]
}

function avatarColor(id: number) {
  return colors[id % colors.length]
}

function formatDate(value: Date | string) {
  try {
    return new Date(value).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })
  } catch {
    return ''
  }
}

const tabs = computed(() => [
  { label: 'Lessons', slot: 'lessons' as const, icon: 'heroicons-book-open', count: lmsClassStore.classDetail?.lessons?.length ?? 0 },
  { label: 'Students', slot: 'students' as const, icon: 'heroicons-users', count: lmsClassStore.classDetail?.memberships?.length ?? 0 },
])

onMounted(async () => {
  await lmsClassStore.getDetailsClass(classId.value)
})

watch(() => route.params.id, async (newId) => {
  if (newId) {
    await lmsClassStore.getDetailsClass(Number(newId))
  }
})
</script>
