<template>
  <div>
    <div class="flex flex-row mt-4" v-if="isTeacherOrAdmin">
      <ClassComLessonDialog :class-id="classId" data-walkthrough="class-detail-add-lesson" />
    </div>

    <div v-if="lessons && lessons.length > 0" class="mt-3 space-y-2">
      <NuxtLink v-for="(item, index) in lessons" :key="item.id" :to="'/classes/' + classId + '/lessons/' + item.id"
        :data-walkthrough="index === 0 ? 'class-detail-lesson-item' : undefined"
        class="flex items-center gap-3 sm:gap-4 bg-white rounded-xl border border-slate-200 p-3 sm:p-4 hover:shadow-md hover:border-slate-300 transition-all duration-200 group">
        <div class="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-slate-100 text-slate-600 shrink-0">
          <UIcon name="heroicons-book-open" class="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
        <div class="flex-1 min-w-0">
          <h3 class="font-semibold text-slate-900 truncate text-sm sm:text-base">{{ item.title }}</h3>
          <p v-if="item.summary" class="text-xs sm:text-sm text-slate-500 mt-0.5 line-clamp-1">{{ item.summary }}</p>
        </div>
        <UIcon name="heroicons-chevron-right"
          class="h-4 w-4 sm:h-5 sm:w-5 text-slate-400 group-hover:text-slate-600 transition-colors shrink-0" />
      </NuxtLink>
    </div>

    <div v-else class="bg-white rounded-xl border border-slate-200 p-8 mt-3 text-center">
      <div class="flex justify-center mb-3">
        <div class="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
          <UIcon name="heroicons-book-open" class="h-6 w-6 text-slate-400" />
        </div>
      </div>
      <p class="font-medium text-slate-700">No lessons available yet</p>
      <p class="text-sm text-slate-500 mt-1">Click "Add Lesson" to start creating content.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLmsClassStore } from "~/stores/lmsclass"
import { useAuthStore } from "~/stores/auth"

const props = defineProps<{ classId: number }>()
const lmsClassStore = useLmsClassStore()
const authStore = useAuthStore()

const lessons = computed(() => lmsClassStore.classDetail?.lessons || [])
const isTeacherOrAdmin = computed(() => authStore.user?.roles?.includes('admin') || authStore.user?.roles?.includes('teacher'))
</script>
