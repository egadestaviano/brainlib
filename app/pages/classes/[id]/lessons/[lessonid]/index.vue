<template>
  <div class="space-y-6 max-w-6xl mx-auto">
    <!-- Skeleton Loading -->
    <div v-if="lessonStore.loading" class="space-y-6 animate-pulse">
      <USkeleton class="h-4 w-72 rounded" />
      <USkeleton class="h-32 w-full rounded-2xl" />
      <USkeleton class="h-2 w-full rounded-full" />
      <USkeleton class="h-80 w-full rounded-2xl" />
    </div>

    <!-- Empty -->
    <div
      v-else-if="!lessonStore.lesson || !lessonStore.lesson.content_json || lessonStore.lesson.content_json.length === 0"
      class="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center"
    >
      <div class="flex justify-center mb-4">
        <div class="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
          <UIcon name="heroicons-document-text" class="h-7 w-7 text-slate-400" />
        </div>
      </div>
      <h3 class="font-semibold text-slate-800 text-lg">No content available</h3>
      <p class="text-sm text-slate-500 mt-1">This lesson doesn't have any content yet.</p>
      <UButton class="mt-5" color="neutral" variant="outline" icon="heroicons-arrow-left" :to="`/classes/${classId}`">
        Back to Class
      </UButton>
    </div>

    <!-- Main Content -->
    <div v-else class="space-y-6">
      <!-- Breadcrumb -->
      <nav class="flex items-center gap-2 text-sm">
        <NuxtLink to="/classes" class="text-slate-500 hover:text-slate-700 transition-colors">My Classes</NuxtLink>
        <UIcon name="heroicons-chevron-right" class="h-3.5 w-3.5 text-slate-400" />
        <NuxtLink :to="`/classes/${classId}`" class="text-slate-500 hover:text-slate-700 transition-colors truncate max-w-[200px]">
          {{ lmsClassStore.classDetail?.title || 'Class' }}
        </NuxtLink>
        <UIcon name="heroicons-chevron-right" class="h-3.5 w-3.5 text-slate-400" />
        <span class="text-slate-900 font-medium truncate">{{ lessonStore.lesson?.title || 'Lesson' }}</span>
      </nav>

      <!-- Lesson Hero -->
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div class="flex items-start gap-4">
          <div class="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center ring-1 ring-blue-100 shrink-0">
            <UIcon name="heroicons-book-open" class="h-6 w-6 text-blue-600" />
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex flex-wrap items-center gap-2 mb-1">
              <span v-if="isTeacher" class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 text-[11px] font-semibold uppercase tracking-wider">
                <UIcon name="heroicons-academic-cap" class="h-3 w-3" />
                Teacher View
              </span>
              <span v-else-if="isReviewMode" class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[11px] font-semibold uppercase tracking-wider">
                <UIcon name="heroicons-check-circle" class="h-3 w-3" />
                Submitted
              </span>
              <span class="text-xs text-slate-500">{{ totalPages }} {{ totalPages === 1 ? 'block' : 'blocks' }}</span>
            </div>
            <h1 class="text-2xl font-bold tracking-tight text-slate-900 truncate">{{ lessonStore.lesson?.title }}</h1>
            <p v-if="lessonStore.lesson?.summary" class="text-sm text-slate-600 mt-1 leading-relaxed line-clamp-2">
              {{ lessonStore.lesson.summary }}
            </p>
          </div>
        </div>
      </div>
      <div v-if="!isSubmitted">
        <!-- Progress Bar -->
        <div class="bg-white rounded-t-2xl border-t border-x border-slate-200 shadow-sm p-5">
          <div class="flex items-center justify-between text-sm mb-3">
            <span class="font-semibold text-slate-700">Section {{ currentIndex + 1 }} of {{ totalPages }}</span>
            <span class="inline-flex items-center gap-1.5 text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-semibold">
              <UIcon name="heroicons-chart-bar" class="h-3 w-3" />
              {{ Math.round(((currentIndex + 1) / totalPages) * 100) }}%
            </span>
          </div>
          <div class="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              class="h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full transition-all duration-500 ease-out"
              :style="{ width: ((currentIndex + 1) / totalPages) * 100 + '%' }"
            />
          </div>
          <!-- Step indicators -->
          <div class="flex items-center gap-1.5 mt-3">
            <button
              v-for="(_, idx) in totalPages"
              :key="idx"
              @click="goToPage(Number(idx))"
              :class="[
                'flex-1 h-1 rounded-full transition-all duration-200 cursor-pointer',
                idx === currentIndex
                  ? 'bg-blue-500'
                  : Number(idx) < currentIndex
                    ? 'bg-blue-300'
                    : 'bg-slate-200 hover:bg-slate-300'
              ]"
            />
          </div>
        </div>

        <!-- Content Block -->
        <div v-if="currentBlock" class="bg-white border-x border-slate-200 shadow-sm overflow-hidden">
          <!-- Block type indicator -->
          <div class="px-8 py-4 border-b border-slate-100 flex items-center gap-3">
            <div :class="['w-10 h-10 rounded-xl flex items-center justify-center', blockTypeStyle.bg]">
              <UIcon :name="blockTypeStyle.icon" :class="['h-5 w-5', blockTypeStyle.text]" />
            </div>
            <div class="flex-1 min-w-0">
              <span :class="['text-[11px] font-semibold uppercase tracking-wider', blockTypeStyle.text]">{{ blockTypeStyle.label }}</span>
              <p class="text-xs text-slate-500">Block {{ currentIndex + 1 }} of {{ totalPages }}</p>
            </div>
          </div>

          <div class="p-8">
            <h3 class="font-bold text-xl text-slate-900 mb-5">
              {{ currentBlock.title ?? currentBlock.question ?? `Section ${currentIndex + 1}` }}
            </h3>

            <!-- Text Content -->
            <div v-if="isType(currentBlock, 'text')" class="prose prose-slate prose-lg max-w-none leading-relaxed">
              <div v-html="safeHtml(currentBlock.content)"></div>
            </div>

            <!-- Image -->
            <div v-else-if="isType(currentBlock, 'image')" class="flex justify-center">
              <div class="rounded-xl overflow-hidden bg-slate-50 border border-slate-100">
                <img
                  :src="currentBlock.url"
                  :alt="currentBlock.alt ?? currentBlock.title ?? 'image'"
                  class="max-h-[28rem] object-contain"
                  @error="onMediaError(currentIndex)"
                />
              </div>
            </div>

            <!-- Video -->
            <div v-else-if="isType(currentBlock, 'video')" class="w-full">
              <div class="rounded-xl overflow-hidden bg-black">
                <video
                  controls
                  class="w-full"
                  :src="currentBlock.url"
                  @error="onMediaError(currentIndex)"
                >
                  Your browser does not support video tags.
                </video>
              </div>
            </div>

            <!-- Multiple Choice -->
            <div v-else-if="isType(currentBlock, 'multiple_choice')" class="space-y-3">
              <p v-if="!currentBlock.title && !currentBlock.question" class="text-slate-500 text-sm mb-4">
                Select the answer you think is correct:
              </p>

              <div v-if="currentBlock.options && currentBlock.options.length" class="space-y-2">
                <label
                  v-for="(option, optIdx) in currentBlock.options"
                  :key="optIdx"
                  @click="selectOption(option)"
                  :class="[
                    'flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200',
                    isReviewMode ? 'cursor-not-allowed' : 'cursor-pointer',
                    getOptionStyle(option, Number(optIdx))
                  ]"
                >
                  <div :class="[
                    'w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 transition-all',
                    isReviewMode
                      ? isOptionCorrect(option, Number(optIdx)) 
                        ? 'bg-blue-500 text-white' 
                        : isOptionSelected(option) ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-400'
                      : isOptionSelected(option) 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-slate-100 text-slate-600'
                  ]">
                    {{ String.fromCharCode(65 + Number(optIdx)) }}
                  </div>
                  <span class="text-sm font-medium text-slate-700 flex-1">{{ typeof option === 'string' ? option : (option.value ?? option.label ?? '') }}</span>
                  <UIcon
                    v-if="isReviewMode && (isOptionCorrect(option, Number(optIdx)) || isOptionSelected(option))"
                    :name="isOptionCorrect(option, Number(optIdx)) ? 'heroicons-check-circle' : 'heroicons-x-circle'"
                    :class="['h-5 w-5', isOptionCorrect(option, Number(optIdx)) ? 'text-blue-500' : 'text-red-500']"
                  />
                </label>

                <!-- Explanation -->
                <div
                  v-if="currentBlock.explanation && isReviewMode"
                  class="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-xl"
                >
                  <div class="flex items-start gap-2">
                    <UIcon name="heroicons-light-bulb" class="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
                    <div>
                      <p class="text-sm font-medium text-blue-800 mb-1">Explanation</p>
                      <p class="text-sm text-blue-700">{{ currentBlock.explanation }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div v-else class="p-4 bg-red-50 rounded-xl text-sm text-red-600 flex items-center gap-2">
                <UIcon name="heroicons-exclamation-triangle" class="h-4 w-4" />
                No options available (invalid option format).
              </div>
            </div>

            <!-- Essay -->
            <div v-else-if="isType(currentBlock, 'essay')" class="space-y-3">
              <UTextarea
                :placeholder="currentBlock.placeholder ?? 'Write your answer here...'"
                class="min-h-[160px] w-full"
                v-model="localEssay[currentIndex]"
                :disabled="isReviewMode"
                @blur="submitEssayDebounced(currentIndex, true)"
                @input="submitEssayDebounced(currentIndex, false)"
              />

              <div class="flex items-center justify-between">
                <span v-if="results[currentIndex]?.submitted" class="text-sm text-blue-600 flex items-center gap-1.5 font-medium">
                  <UIcon name="heroicons-check-circle" class="h-4 w-4" />
                  Answer saved
                </span>
                <span v-else class="text-sm text-slate-400 flex items-center gap-1.5">
                  <UIcon name="heroicons-arrow-path" class="h-3.5 w-3.5" />
                  Auto-saves when you stop typing
                </span>
                <span v-if="currentBlock.max_length" class="text-xs text-slate-400">
                  {{ (localEssay[currentIndex] || '').length }} / {{ currentBlock.max_length }}
                </span>
              </div>

              <div
                v-if="currentBlock.explanation && isReviewMode"
                class="p-4 bg-blue-50 border border-blue-100 rounded-xl"
              >
                <div class="flex items-start gap-2">
                  <UIcon name="heroicons-light-bulb" class="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
                  <p class="text-sm text-blue-700">{{ currentBlock.explanation }}</p>
                </div>
              </div>
            </div>

            <!-- Unknown -->
            <div v-else class="p-4 bg-amber-50 rounded-xl text-sm text-amber-700 flex items-center gap-2">
              <UIcon name="heroicons-exclamation-triangle" class="h-4 w-4" />
              Unrecognized content type: <strong>{{ getBlockType(currentBlock) }}</strong>
            </div>

            <!-- Error display -->
            <div v-if="results[currentIndex]?.error" class="mt-3 p-3 bg-red-50 rounded-xl text-sm text-red-600 flex items-center gap-2">
              <UIcon name="heroicons-exclamation-circle" class="h-4 w-4 shrink-0" />
              {{ results[currentIndex].error }}
            </div>
          </div>
        </div>

        <!-- Pagination Controls -->
        <div class="flex items-center justify-between bg-white rounded-b-2xl border-x border-b border-slate-200 px-5 py-3">
          <UButton v-if="!isReviewMode" variant="ghost" color="neutral" icon="heroicons-arrow-path" @click="resetAll">
            Reset
          </UButton>
          <UButton v-else variant="ghost" color="primary" icon="heroicons-chart-pie" @click="handleViewSubmissions">
            {{ isTeacher ? 'View Student Submissions' : 'View Score' }}
          </UButton>

          <div class="flex items-center gap-2">
            <UButton
              variant="outline"
              color="neutral"
              icon="heroicons-chevron-left"
              :disabled="currentIndex === 0"
              @click="prevPage"
            >
              Prev
            </UButton>

            <UButton
              v-if="currentIndex < totalPages - 1"
              color="neutral"
              trailing-icon="heroicons-chevron-right"
              @click="nextPage"
            >
              Next
            </UButton>

            <UButton
              v-else-if="!isReviewMode"
              color="primary"
              icon="heroicons-paper-airplane"
              @click="submitAll"
            >
              Submit All
            </UButton>
          </div>
        </div>
      </div>

      <!-- Results -->
      <div v-else class="space-y-6">
        <div v-if="!isTeacher" class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <!-- Banner -->
          <div class="bg-gradient-to-br from-blue-500 to-blue-600 px-8 py-10 text-center text-white">
            <div class="flex justify-center mb-4">
              <div class="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center ring-4 ring-white/10">
                <UIcon name="heroicons-trophy" class="h-8 w-8" />
              </div>
            </div>
            <h2 class="text-3xl font-bold tracking-tight mb-1">Lesson Complete!</h2>
            <p class="text-blue-50 text-sm">Here's how you did on the assessment</p>
          </div>

          <div class="p-8">
            <div class="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
              <div class="bg-blue-50 border border-blue-200 rounded-2xl p-5 text-center">
                <p class="text-3xl font-bold text-blue-600">{{ score.correct }}</p>
                <p class="text-xs text-blue-700 mt-1 font-semibold uppercase tracking-wider">Correct</p>
              </div>
              <div class="bg-red-50 border border-red-200 rounded-2xl p-5 text-center">
                <p class="text-3xl font-bold text-red-600">{{ score.wrong }}</p>
                <p class="text-xs text-red-700 mt-1 font-semibold uppercase tracking-wider">Wrong</p>
              </div>
              <div class="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center">
                <p class="text-3xl font-bold text-slate-700">
                  {{ score.correct + score.wrong > 0 ? Math.round((score.correct / (score.correct + score.wrong)) * 100) : 0 }}%
                </p>
                <p class="text-xs text-slate-600 mt-1 font-semibold uppercase tracking-wider">Accuracy</p>
              </div>
            </div>

            <div v-if="score.correct + score.wrong > 0" class="max-w-md mx-auto mb-8">
              <div class="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span class="font-medium">Score</span>
                <span>{{ score.correct }}/{{ score.correct + score.wrong }}</span>
              </div>
              <div class="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  class="h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full transition-all duration-700"
                  :style="{ width: (score.correct / (score.correct + score.wrong)) * 100 + '%' }"
                />
              </div>
            </div>

            <div class="flex justify-center">
              <UButton color="primary" size="lg" icon="heroicons-eye" @click="goToFirstPage">
                Review Answers
              </UButton>
            </div>
          </div>
        </div>

        <div v-else class="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="flex items-start gap-3">
            <div class="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center ring-1 ring-violet-100 shrink-0">
              <UIcon name="heroicons-chart-bar" class="h-5 w-5 text-violet-600" />
            </div>
            <div>
              <h2 class="text-base font-semibold text-slate-900">Content Overview</h2>
              <p class="text-sm text-slate-500 mt-0.5">You are viewing this lesson as a teacher.</p>
            </div>
          </div>
          <UButton color="neutral" variant="outline" icon="heroicons-arrow-uturn-left" @click="goToFirstPage">
            Back to Content
          </UButton>
        </div>

        <!-- Teacher: Student Submissions -->
        <div v-if="isTeacher" class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div class="px-6 py-5 border-b border-slate-100 flex items-center justify-between gap-3">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center ring-1 ring-blue-100 shrink-0">
                <UIcon name="heroicons-users" class="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 class="font-semibold text-slate-900">Student Submissions</h3>
                <p class="text-xs text-slate-500">{{ allMembersSubmissions.filter(s => s.has_submitted).length }} of {{ allMembersSubmissions.length }} students submitted</p>
              </div>
            </div>
            <UButton variant="outline" color="neutral" size="sm" icon="heroicons-arrow-path" @click="loadTeacherSubmissions" :loading="lessonStore.loading">
              Refresh
            </UButton>
          </div>
          
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                  <th class="px-8 py-4 font-semibold">Student</th>
                  <th class="px-8 py-4 font-semibold text-center">Status</th>
                  <th class="px-8 py-4 font-semibold text-center">Correct</th>
                  <th class="px-8 py-4 font-semibold text-center">Wrong</th>
                  <th class="px-8 py-4 font-semibold text-center">Accuracy</th>
                  <th class="px-8 py-4 font-semibold">Submitted At</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                <tr v-for="sub in allMembersSubmissions" :key="sub.user_id" class="hover:bg-slate-50/50 transition-colors">
                  <td class="px-8 py-4">
                    <div class="flex flex-col">
                      <span class="font-medium text-slate-700">{{ sub.user_name }}</span>
                      <span class="text-[10px] uppercase text-slate-400 font-bold tracking-tight">{{ sub.role }}</span>
                    </div>
                  </td>
                  <td class="px-8 py-4 text-center">
                    <span v-if="sub.has_submitted" class="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold uppercase">
                      Submitted
                    </span>
                    <span v-else class="inline-flex items-center px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase">
                      Pending
                    </span>
                  </td>
                  <td class="px-8 py-4 text-center text-blue-600 font-semibold">{{ sub.has_submitted ? sub.score_correct : '-' }}</td>
                  <td class="px-8 py-4 text-center text-red-600 font-semibold">{{ sub.has_submitted ? sub.score_wrong : '-' }}</td>
                  <td class="px-8 py-4 text-center">
                    <span v-if="sub.has_submitted && (sub.score_correct + sub.score_wrong > 0)" class="inline-flex items-center px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-bold">
                      {{ Math.round((sub.score_correct / (sub.score_correct + sub.score_wrong)) * 100) }}%
                    </span>
                    <span v-else class="text-slate-400">-</span>
                  </td>
                  <td class="px-8 py-4 text-sm text-slate-500">
                    {{ sub.submitted_at ? new Date(sub.submitted_at).toLocaleDateString() : '-' }}
                  </td>
                </tr>
                <tr v-if="!allMembersSubmissions.length">
                  <td colspan="6" class="px-8 py-12 text-center text-slate-400 italic">No students joined yet</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useLessonStore } from '~/stores/lesson'
import { useLmsClassStore } from '~/stores/lmsclass'

const route = useRoute()
const classId = computed(() => Number(route.params.id))
const lessonId = computed(() => Number(route.params.lessonid))
const lessonStore = useLessonStore()
const authStore = useAuthStore()
const lmsClassStore = useLmsClassStore()
const userId = computed(() => authStore.user?.id || 'guest')
const isTeacher = computed(() => {
  const roles = authStore.user?.roles?.map(r => r.toLowerCase()) || []
  return roles.includes('teacher') || roles.includes('admin')
})

const allMembersSubmissions = computed(() => {
  const members = lmsClassStore.classDetail?.memberships || []
  return members.map((member:any) => {
    const submission = lessonStore.allSubmissions.find((s:any) => s.user_id === member.user.id)
    return {
      user_id: member.user.id,
      user_name: member.user.profile?.display_name || member.user.email,
      role: member.role,
      ...submission,
      has_submitted: !!submission
    }
  })
})

const currentIndex = ref(0)
const isSubmitted = ref(false)
const isReviewMode = ref(isTeacher.value)
const score = ref({ correct: 0, wrong: 0 })
const results = ref<Record<number, any>>({})
const localEssay = reactive<Record<number, string>>({})
const answers = reactive<Record<number, string>>({})
const essayTimers = new Map<number, number | undefined>()

const totalPages = computed(() => lessonStore.lesson?.content_json?.length ?? 0)
const currentBlock = computed(() => lessonStore.lesson?.content_json?.[currentIndex.value])

const blockTypeStyle = computed(() => {
  const type = currentBlock.value?.type
  const styles: Record<string, { icon: string; bg: string; text: string; label: string }> = {
    text: { icon: 'heroicons-bars-3-bottom-left', bg: 'bg-sky-50', text: 'text-sky-600', label: 'Reading' },
    image: { icon: 'heroicons-photo', bg: 'bg-amber-50', text: 'text-amber-600', label: 'Image' },
    video: { icon: 'heroicons-video-camera', bg: 'bg-rose-50', text: 'text-rose-600', label: 'Video' },
    multiple_choice: { icon: 'heroicons-list-bullet', bg: 'bg-violet-50', text: 'text-violet-600', label: 'Quiz' },
    essay: { icon: 'heroicons-pencil-square', bg: 'bg-blue-50', text: 'text-blue-600', label: 'Essay' },
  }
  return styles[type ?? ''] ?? { icon: 'heroicons-question-mark-circle', bg: 'bg-slate-50', text: 'text-slate-500', label: 'Content' }
})

function parseSimpleMarkdown(text: string = ''): string {
  if (!text) return ''
  text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  text = text.replace(/\*(.+?)\*/g, '<em>$1</em>')
  text = text.replace(/`([^`]+)`/g, '<code>$1</code>')
  return text
}

const safeHtml = (html?: string) => parseSimpleMarkdown(html ?? '')
const setErrorFor = (idx: number, msg: string) => {
  results.value[idx] = { ...(results.value[idx] ?? {}), error: msg, submitted: false }
}
const clearErrorFor = (idx: number) => {
  if (results.value[idx]) delete results.value[idx].error
}
const isType = (block: any, t: string) => !!(block && block.type === t)
const getBlockType = (block: any) => block?.type ?? 'unknown'
const onMediaError = (idx: number) => setErrorFor(idx, 'Failed to load media (video/image).')

function isOptionCorrect(option: any, optIdx: number) {
  if (!currentBlock.value) return false
  const block = currentBlock.value
  
  // 1. Check if option object has is_correct
  if (typeof option === 'object' && option !== null && (option.is_correct === true || option.is_correct === false)) {
    return !!option.is_correct
  }
  
  // 2. Check if block has answer index
  if (typeof block.answer === 'number') {
    return optIdx === block.answer
  }
  
  // 3. Check if block has correctAnswer string
  const blockCorrectVal = block.correctAnswer ?? block.correct_answer
  if (typeof blockCorrectVal === 'string') {
    const value = typeof option === 'string' ? option : (option.value ?? option.label)
    return value === blockCorrectVal
  }
  
  // 4. Fallback for string options if answer is index
  if (typeof option === 'string' && typeof block.answer === 'number') {
    return optIdx === block.answer
  }

  return false
}

function selectOption(option: any) {
  if (isReviewMode.value) return
  const value = typeof option === 'string' ? option : (option.value ?? option.label)
  answers[currentIndex.value] = value
  computeMCQResult(currentIndex.value, value)
}

function isOptionSelected(option: any) {
  const value = typeof option === 'string' ? option : (option.value ?? option.label)
  return answers[currentIndex.value] === value
}

function getOptionStyle(option: any, optIdx: number) {
  const selected = isOptionSelected(option)

  if (!isReviewMode.value) {
    return selected 
      ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500/20' 
      : 'border-slate-200 hover:border-blue-200 hover:bg-slate-50'
  }

  // Review mode
  const correct = isOptionCorrect(option, optIdx)

  if (correct) {
    return 'border-blue-500 bg-blue-50 ring-2 ring-blue-500/30'
  }
  if (selected && !correct) {
    return 'border-red-500 bg-red-50 ring-2 ring-red-500/30'
  }
  return 'border-slate-200 opacity-50'
}

function getRadioItems(options: any[] | undefined) {
  if (!Array.isArray(options)) return []
  return options.map((o: any, i: number) => ({
    label: o.value ?? String.fromCharCode(65 + i),
    value: o.value ?? o.label ?? String.fromCharCode(65 + i),
  }))
}

function computeMCQResult(idx: number, value: string | undefined) {
  if (!lessonStore.lesson?.content_json) return
  const block = lessonStore.lesson.content_json[idx] as any
  if (!block) return
  if (!value) {
    delete results.value[idx]
    return
  }

  try {
    const options = Array.isArray(block?.options) ? block.options : []
    const optIndex = options.findIndex((o: any) => (typeof o === 'string' ? o : (o.value ?? o.label)) === value)
    let isCorrect: boolean | undefined

    if (optIndex >= 0) {
      const chosen = options[optIndex]
      // Support both direct is_correct on option or answer index on block
      if (typeof chosen === 'object' && (chosen.is_correct === true || chosen.is_correct === false)) {
        isCorrect = !!chosen.is_correct
      } else if (typeof block.answer === 'number') {
        isCorrect = optIndex === block.answer
      } else {
        const blockCorrectVal = block.correctAnswer ?? block.correct_answer
        if (typeof blockCorrectVal === 'string') {
          const chosenVal = typeof chosen === 'string' ? chosen : (chosen.value ?? chosen.label)
          isCorrect = chosenVal === blockCorrectVal
        }
      }
    }

    results.value[idx] = {
      type: 'multiple_choice',
      value,
      isCorrect,
      submitted: true,
      submittedAt: new Date().toISOString(),
    }
  } catch (err) {
    console.error("Error in computeMCQResult", err)
    setErrorFor(idx, 'Errors when evaluating multiple choice answers.')
  }
}

watch(answers, (newVal) => {
  for (const k in newVal) computeMCQResult(Number(k), newVal[k])
}, { deep: true })

function submitEssay(idx: number) {
  if (isReviewMode.value) return
  try {
    clearErrorFor(idx)
    const block = lessonStore.lesson?.content_json?.[idx] as any
    const text = (localEssay[idx] ?? '').trim()

    if (block?.max_length && text.length > block.max_length) {
      setErrorFor(idx, `Answer exceeds the ${block.max_length} character limit.`)
      return
    }

    results.value[idx] = {
      type: 'essay',
      value: text,
      submitted: true,
      submittedAt: new Date().toISOString(),
    }
  } catch {
    setErrorFor(idx, 'Error.')
  }
}

function submitEssayDebounced(idx: number, forceNow = false) {
  if (isReviewMode.value) return
  if (forceNow) {
    const t = essayTimers.get(idx)
    if (t) window.clearTimeout(t)
    essayTimers.delete(idx)
    submitEssay(idx)
    return
  }

  const existing = essayTimers.get(idx)
  if (existing) window.clearTimeout(existing)
  const timer = window.setTimeout(() => {
    essayTimers.delete(idx)
    submitEssay(idx)
  }, 900)
  essayTimers.set(idx, timer)
}

async function saveResults() {
  const payload = {
    results: results.value,
    score_correct: score.value.correct,
    score_wrong: score.value.wrong,
    answers: answers,
    localEssay: localEssay,
    savedAt: new Date().toISOString(),
  }
  
  // Local backup
  lessonStore.saveSubmission(userId.value, lessonId.value, payload)
  
  // Backend sync
  try {
    await lessonStore.submitLesson(lessonId.value, payload)
  } catch (err: any) {
    console.error("Failed to sync with backend", err)
  }
  
  isReviewMode.value = true
}

async function loadTeacherSubmissions() {
  if (!isTeacher.value) return
  await lessonStore.fetchAllSubmissions(lessonId.value)
}

async function handleViewSubmissions() {
  isSubmitted.value = true
  if (isTeacher.value) {
    await loadTeacherSubmissions()
  }
}

async function goToPage(idx: number) {
  if (isType(currentBlock.value, 'essay')) submitEssay(currentIndex.value)
  currentIndex.value = idx
}

function prevPage() {
  if (isType(currentBlock.value, 'essay')) submitEssay(currentIndex.value)
  if (currentIndex.value > 0) currentIndex.value--
}

function nextPage() {
  if (isType(currentBlock.value, 'essay')) submitEssay(currentIndex.value)
  if (currentIndex.value < totalPages.value - 1) currentIndex.value++
}

function goToFirstPage() {
  isSubmitted.value = false
  currentIndex.value = 0
}

async function submitAll() {
  const content = lessonStore.lesson?.content_json || []

  // Ensure all essays are "submitted"
  content.forEach((b: any, i: number) => {
    if (b.type === 'essay' && !results.value[i]) submitEssay(i)
  })

  let correctCount = 0
  let wrongCount = 0

  // Count scores accurately across ALL quiz questions
  content.forEach((block: any, i: number) => {
    if (block.type === 'multiple_choice') {
      const res = results.value[i]
      if (res && res.isCorrect) {
        correctCount++
      } else {
        wrongCount++
        // If not answered, ensure we have a result entry for review mode
        if (!res) {
          results.value[i] = {
            type: 'multiple_choice',
            value: undefined,
            isCorrect: false,
            submitted: true,
            submittedAt: new Date().toISOString()
          }
        }
      }
    }
  })

  score.value.correct = correctCount
  score.value.wrong = wrongCount
  isSubmitted.value = true

  await saveResults()
}

function resetAll() {
  Object.keys(results.value).forEach((k) => delete results.value[Number(k)])
  Object.keys(localEssay).forEach((k) => delete localEssay[Number(k)])
  Object.keys(answers).forEach((k) => delete answers[Number(k)])
  score.value.correct = 0
  score.value.wrong = 0
  isSubmitted.value = false
  isReviewMode.value = false
  lessonStore.saveSubmission(userId.value, lessonId.value, null)
  currentIndex.value = 0
}

onMounted(async () => {
  await lessonStore.getDetailLesson(lessonId.value)
  
  if (!lmsClassStore.classDetail || lmsClassStore.classDetail.id !== classId.value) {
    await lmsClassStore.getDetailsClass(classId.value)
  }
  
  if (isTeacher.value) {
    isReviewMode.value = true
    isSubmitted.value = false // Start with content view for teachers
    await loadTeacherSubmissions()
    return
  }

  // Check backend first
  const backendSaved = await lessonStore.fetchSubmission(lessonId.value)
  const saved = backendSaved || lessonStore.getSubmission(userId.value, lessonId.value)
  
  if (saved) {
    isSubmitted.value = true
    isReviewMode.value = true
    
    // Auto-sync if it was only local
    if (!backendSaved && saved.results) {
      try {
        await lessonStore.submitLesson(lessonId.value, saved)
        console.log("Auto-synced local submission to backend")
      } catch (err) {
        console.warn("Auto-sync failed", err)
      }
    }
    
    Object.assign(results.value, saved.results || {})
    score.value.correct = saved.score_correct || saved.score?.correct || 0
    score.value.wrong = saved.score_wrong || saved.score?.wrong || 0
    
    Object.assign(answers, saved.answers || {})
    Object.assign(localEssay, saved.localEssay || {})
  } else {
    lessonStore.lesson?.content_json?.forEach((b: any, i: number) => {
      if (b.type === 'essay') localEssay[i] = localEssay[i] ?? ''
    })
  }
})
</script>

<style scoped>
.prose img {
  max-width: 100%;
}
.prose :deep(p) {
  margin-bottom: 0.75rem;
  line-height: 1.8;
}
.prose :deep(strong) {
  color: #1e293b;
}
.prose :deep(code) {
  background: #f1f5f9;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  font-size: 0.875em;
  color: #475569;
}
</style>
