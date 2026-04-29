<template>
  <div class="max-w-3xl mx-auto py-6 space-y-6">
    <!-- Skeleton Loading -->
    <div v-if="lessonStore.loading" class="space-y-5 animate-pulse">
      <USkeleton class="h-1.5 w-full rounded-full" />
      <div class="bg-white rounded-2xl border border-slate-200 p-8 space-y-5">
        <USkeleton class="h-7 w-1/3 rounded" />
        <div class="space-y-3">
          <USkeleton class="h-4 w-full rounded" />
          <USkeleton class="h-4 w-4/5 rounded" />
          <USkeleton class="h-4 w-2/3 rounded" />
        </div>
      </div>
      <div class="flex justify-between">
        <USkeleton class="h-10 w-28 rounded-lg" />
        <div class="flex gap-3">
          <USkeleton class="h-10 w-20 rounded-lg" />
          <USkeleton class="h-10 w-20 rounded-lg" />
        </div>
      </div>
    </div>

    <!-- Empty -->
    <div
      v-else-if="!lessonStore.lesson || !lessonStore.lesson.content_json || lessonStore.lesson.content_json.length === 0"
      class="bg-white rounded-2xl border border-slate-200 p-12 text-center"
    >
      <div class="flex justify-center mb-4">
        <div class="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
          <UIcon name="heroicons-document-text" class="h-7 w-7 text-slate-400" />
        </div>
      </div>
      <h3 class="font-semibold text-slate-800 text-lg">No content available</h3>
      <p class="text-sm text-slate-500 mt-1">This lesson doesn't have any content yet.</p>
    </div>

    <!-- Main Content -->
    <div v-else>
      <!-- Teacher Tabs -->
      <div v-if="isTeacherOrAdmin" class="flex gap-4 border-b border-slate-200 mb-6">
        <button @click="teacherTab = 'content'" :class="['pb-3 px-2 border-b-2 font-medium text-sm transition-colors cursor-pointer', teacherTab === 'content' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700']">Content</button>
        <button @click="teacherTab = 'grades'" :class="['pb-3 px-2 border-b-2 font-medium text-sm transition-colors cursor-pointer', teacherTab === 'grades' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700']">Grades</button>
      </div>

      <div v-if="!isTeacherOrAdmin || teacherTab === 'content'">
        <div v-if="!isSubmitted">
        <!-- Progress Bar -->
        <div class="mb-8">
          <div class="flex items-center justify-between text-sm text-slate-500 mb-3">
            <span class="font-medium text-slate-700">Section {{ currentIndex + 1 }} of {{ totalPages }}</span>
            <span class="text-xs bg-slate-100 px-2.5 py-1 rounded-full font-medium">
              {{ Math.round(((currentIndex + 1) / totalPages) * 100) }}%
            </span>
          </div>
          <div class="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              class="h-full bg-emerald-500 rounded-full transition-all duration-500 ease-out"
              :style="{ width: ((currentIndex + 1) / totalPages) * 100 + '%' }"
            />
          </div>
          <!-- Step indicators -->
          <div class="flex justify-between mt-2 px-0.5">
            <button
              v-for="(_, idx) in lessonStore.lesson.content_json"
              :key="idx"
              @click="goToPage(Number(idx))"
              :class="[
                'w-2 h-2 rounded-full transition-all duration-200 cursor-pointer',
                Number(idx) === currentIndex
                  ? 'bg-emerald-500 scale-125'
                  : Number(idx) < currentIndex
                    ? 'bg-emerald-300'
                    : 'bg-slate-200'
              ]"
            />
          </div>
        </div>

        <!-- Content Block -->
        <div v-if="currentBlock" class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <!-- Block type indicator -->
          <div class="px-8 pt-6 pb-0 flex items-center gap-2">
            <div :class="['w-8 h-8 rounded-lg flex items-center justify-center', blockTypeStyle.bg]">
              <UIcon :name="blockTypeStyle.icon" :class="['h-4 w-4', blockTypeStyle.text]" />
            </div>
            <span class="text-xs font-medium text-slate-400 uppercase tracking-wide">{{ blockTypeStyle.label }}</span>
          </div>

          <div class="p-8 pt-4">
            <h3 class="font-bold text-xl text-slate-900 mb-5">
              {{ currentBlock.title ?? `Section ${currentIndex + 1}` }}
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
              <p v-if="!currentBlock.title" class="text-slate-500 text-sm mb-4">
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
                    getOptionStyle(option)
                  ]"
                >
                  <div :class="[
                    'w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 transition-all',
                    isReviewMode
                      ? option.is_correct 
                        ? 'bg-emerald-500 text-white' 
                        : isOptionSelected(option) ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-400'
                      : isOptionSelected(option) 
                        ? 'bg-emerald-500 text-white' 
                        : 'bg-slate-100 text-slate-600'
                  ]">
                    {{ String.fromCharCode(65 + Number(optIdx)) }}
                  </div>
                  <span class="text-sm font-medium text-slate-700 flex-1">{{ option.value ?? option.label }}</span>
                  <UIcon
                    v-if="isReviewMode && (option.is_correct || isOptionSelected(option))"
                    :name="option.is_correct ? 'heroicons-check-circle' : 'heroicons-x-circle'"
                    :class="['h-5 w-5', option.is_correct ? 'text-emerald-500' : 'text-red-500']"
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
                <span v-if="results[currentIndex]?.submitted" class="text-sm text-emerald-600 flex items-center gap-1.5 font-medium">
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
        <div class="flex items-center justify-between mt-8">
          <UButton v-if="!isReviewMode && !isStudent" variant="ghost" color="neutral" @click="resetAll" class="text-slate-500 cursor-pointer">
            <UIcon name="heroicons-arrow-path" class="h-4 w-4 mr-1.5" />
            Reset
          </UButton>
          <UButton v-else-if="!isTeacherOrAdmin" variant="ghost" color="primary" @click="isSubmitted = true" class="cursor-pointer">
            <UIcon name="heroicons-trophy" class="h-4 w-4 mr-1.5" />
            View Score
          </UButton>

          <div class="flex items-center gap-2">
            <UButton
              variant="outline"
              color="neutral"
              :disabled="currentIndex === 0"
              @click="prevPage"
              class="px-4 cursor-pointer"
            >
              <UIcon name="heroicons-chevron-left" class="h-4 w-4 mr-1" />
              Prev
            </UButton>

            <UButton
              v-if="currentIndex < totalPages - 1"
              color="neutral"
              @click="nextPage"
              class="px-4 cursor-pointer"
            >
              Next
              <UIcon name="heroicons-chevron-right" class="h-4 w-4 ml-1" />
            </UButton>

            <UButton
              v-else-if="!isReviewMode"
              color="primary"
              @click="submitAll"
              class="px-5 cursor-pointer"
            >
              <UIcon name="heroicons-paper-airplane" class="h-4 w-4 mr-1.5" />
              Submit All
            </UButton>
          </div>
        </div>
      </div>

      <!-- Results -->
      <div v-else class="space-y-6">
        <div class="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
          <div class="flex justify-center mb-4">
            <div class="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center">
              <UIcon name="heroicons-trophy" class="h-8 w-8 text-emerald-600" />
            </div>
          </div>
          <h2 class="text-2xl font-bold text-slate-900 mb-2">Lesson Complete!</h2>
          <p class="text-slate-500 mb-8">Here's how you did on the multiple choice questions</p>

          <div class="grid grid-cols-2 gap-4 max-w-sm mx-auto mb-8">
            <div class="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
              <p class="text-4xl font-bold text-emerald-600">{{ score.correct }}</p>
              <p class="text-sm text-emerald-700 mt-1 font-medium">Correct</p>
            </div>
            <div class="bg-red-50 border border-red-200 rounded-2xl p-6">
              <p class="text-4xl font-bold text-red-600">{{ score.wrong }}</p>
              <p class="text-sm text-red-700 mt-1 font-medium">Wrong</p>
            </div>
          </div>

          <div v-if="score.correct + score.wrong > 0" class="mb-8">
            <div class="h-3 bg-slate-100 rounded-full overflow-hidden max-w-sm mx-auto">
              <div
                class="h-full bg-emerald-500 rounded-full transition-all duration-500"
                :style="{ width: (score.correct / (score.correct + score.wrong)) * 100 + '%' }"
              />
            </div>
            <p class="text-sm text-slate-500 mt-2">
              {{ Math.round((score.correct / (score.correct + score.wrong)) * 100) }}% accuracy
            </p>
          </div>

          <div class="flex justify-center gap-3">
            <UButton v-if="!isStudent" variant="outline" color="neutral" @click="resetAll" class="cursor-pointer">
              <UIcon name="heroicons-arrow-path" class="h-4 w-4 mr-1.5" />
              Try Again
            </UButton>
            <UButton color="primary" @click="goToFirstPage" class="cursor-pointer">
              <UIcon name="heroicons-eye" class="h-4 w-4 mr-1.5" />
              Review Answers
            </UButton>
          </div>
        </div>
      </div>
      </div>

      <!-- Grades Tab -->
      <div v-if="isTeacherOrAdmin && teacherTab === 'grades'" class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
          <h3 class="font-bold text-lg text-slate-900">Student Grades</h3>
        </div>
        <div class="divide-y divide-slate-100">
          <div v-for="grade in studentGrades" :key="grade.user.id" class="px-8 py-4 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-semibold shrink-0">
                {{ grade.user.profile?.display_name?.[0]?.toUpperCase() || 'U' }}
              </div>
              <div class="min-w-0">
                <p class="font-medium text-slate-900 truncate">{{ grade.user.profile?.display_name }}</p>
                <p class="text-xs text-slate-500 truncate">{{ grade.user.email }}</p>
              </div>
            </div>
            <div v-if="grade.submitted" class="text-right shrink-0">
              <p class="font-semibold text-emerald-600">{{ grade.score.correct }} / {{ grade.score.correct + grade.score.wrong }}</p>
              <p class="text-xs text-slate-500">Correct</p>
            </div>
            <div v-else class="text-right shrink-0">
              <span class="inline-block px-2.5 py-1 bg-slate-100 text-slate-500 text-xs font-medium rounded-full">Not submitted</span>
            </div>
          </div>
          <div v-if="studentGrades.length === 0" class="px-8 py-12 text-center text-slate-500">
            No students found in this class.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useLessonStore } from '~/stores/lesson'

const route = useRoute()
const classId = computed(() => Number(route.params.id))
const lessonId = computed(() => Number(route.params.lessonid))
const lessonStore = useLessonStore()
const lmsClassStore = useLmsClassStore()
const authStore = useAuthStore()
const userId = computed(() => authStore.user?.id || 'guest')

const isTeacherOrAdmin = computed(() => authStore.user?.roles?.includes('admin') || authStore.user?.roles?.includes('teacher'))
const isStudent = computed(() => authStore.user?.roles?.includes('student'))
const teacherTab = ref('content')

const studentGrades = computed(() => {
  const members = lmsClassStore.classDetail?.memberships || []
  return members.map((m: any) => {
    const saved = lessonStore.getSubmission(m.user.id, lessonId.value)
    return {
      user: m.user,
      score: saved?.score || { correct: 0, wrong: 0 },
      submitted: !!saved
    }
  })
})

const currentIndex = ref(0)
const isSubmitted = ref(false)
const isReviewMode = ref(false)
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
    text: { icon: 'heroicons-document-text', bg: 'bg-blue-50', text: 'text-blue-500', label: 'Reading' },
    image: { icon: 'heroicons-photo', bg: 'bg-purple-50', text: 'text-purple-500', label: 'Image' },
    video: { icon: 'heroicons-play-circle', bg: 'bg-rose-50', text: 'text-rose-500', label: 'Video' },
    multiple_choice: { icon: 'heroicons-list-bullet', bg: 'bg-amber-50', text: 'text-amber-500', label: 'Quiz' },
    essay: { icon: 'heroicons-pencil-square', bg: 'bg-emerald-50', text: 'text-emerald-500', label: 'Essay' },
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

function selectOption(option: any) {
  if (isReviewMode.value) return
  const value = option.value ?? option.label
  answers[currentIndex.value] = value
  computeMCQResult(currentIndex.value, value)
}

function isOptionSelected(option: any) {
  const value = option.value ?? option.label
  return answers[currentIndex.value] === value
}

function getOptionStyle(option: any) {
  const selected = isOptionSelected(option)

  if (!isReviewMode.value) {
    return selected 
      ? 'border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500/20' 
      : 'border-slate-200 hover:border-emerald-200 hover:bg-slate-50'
  }

  // Review mode
  if (option.is_correct) {
    return 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-500/30'
  }
  if (selected && !option.is_correct) {
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
    const optIndex = options.findIndex((o: any) => (o.value ?? o.label) === value)
    let isCorrect: boolean | undefined

    if (optIndex >= 0) {
      const chosen = options[optIndex]
      if (typeof chosen.is_correct === 'boolean') isCorrect = chosen.is_correct
    } else if (typeof block.correctAnswer === 'string') {
      const chosen = options.find((o: any) => (o.value ?? o.label) === value)
      const chosenLabel = chosen?.label ?? value
      isCorrect = chosenLabel === block.correctAnswer
    }

    results.value[idx] = {
      type: 'multiple_choice',
      value,
      isCorrect,
      submitted: true,
      submittedAt: new Date().toISOString(),
    }
  } catch {
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
    score: score.value,
    answers: answers,
    localEssay: localEssay,
    savedAt: new Date().toISOString(),
  }
  lessonStore.saveSubmission(userId.value, lessonId.value, payload)
  isReviewMode.value = true
}

function goToPage(idx: number) {
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
  lessonStore.lesson?.content_json?.forEach((b: any, i: any) => {
    if (b.type === 'essay' && !results.value[i]) submitEssay(i)
  })

  let correctCount = 0
  let wrongCount = 0

  for (const [_, res] of Object.entries(results.value)) {
    if (res.type === 'multiple_choice') {
      if (res.isCorrect) correctCount++
      else wrongCount++
    }
  }

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
  if (isTeacherOrAdmin.value && !lmsClassStore.classDetail) {
    await lmsClassStore.getDetailsClass(classId.value)
  }
  
  if (isTeacherOrAdmin.value) {
    isReviewMode.value = true
    isSubmitted.value = false
    lessonStore.lesson?.content_json?.forEach((b: any, i: number) => {
      if (b.type === 'essay') localEssay[i] = localEssay[i] ?? ''
    })
    return
  }
  
  const saved = lessonStore.getSubmission(userId.value, lessonId.value)
  if (saved) {
    isSubmitted.value = true
    isReviewMode.value = true
    
    Object.assign(results.value, saved.results || {})
    score.value.correct = saved.score?.correct || 0
    score.value.wrong = saved.score?.wrong || 0
    
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
