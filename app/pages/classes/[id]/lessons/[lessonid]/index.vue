<template>
  <div class="max-w-3xl mx-auto p-6 space-y-6">
    <!-- loading -->
    <div v-if="lessonStore.loading" class="space-y-4">
      <USkeleton class="h-6 w-1/3" />
      <USkeleton class="h-4 w-full" v-for="i in 3" :key="i" />
    </div>

    <!-- empty -->
    <div v-else-if="
      !lessonStore.lesson ||
      !lessonStore.lesson.content_json ||
      lessonStore.lesson.content_json.length === 0
    ">
      <UCard class="p-4" :bordered="false">
        <template #header>
          <h3 class="text-lg font-semibold">Empty Content</h3>
        </template>
        <div>There is no content to display.</div>
      </UCard>
    </div>

    <!-- main -->
    <div v-else>
      <!-- SOAL (per-content) -->
      <div>
        <!-- Summary results if submitted -->
        <div v-if="isSubmitted" class="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h2 class="text-lg font-bold mb-2">📊 Result Summary</h2>
          <div class="flex gap-4">
            <p class="text-green-700 font-semibold">Correct: {{ score.correct }}</p>
            <p class="text-red-600 font-semibold">Wrong: {{ score.wrong }}</p>
          </div>
          <p class="text-xs text-gray-500 mt-1 italic">This lesson has been submitted and is now locked.</p>
        </div>

        <div v-if="currentBlock" class="p-4 shadow-sm bg-white">
          <div class="mb-3">
            <h3 class="font-semibold text-lg">
              {{ currentBlock.title ?? `Section ${currentIndex + 1}` }}
            </h3>
          </div>

          <div :class="['space-y-4', { 'pointer-events-none': isSubmitted }]">
            <!-- text -->
            <div v-if="isType(currentBlock, 'text')" class="prose">
              <div v-html="safeHtml(currentBlock.content)"></div>
            </div>

            <!-- image -->
            <div v-else-if="isType(currentBlock, 'image')" class="flex justify-center">
              <img :src="currentBlock.url" :alt="currentBlock.alt ?? currentBlock.title ?? 'image'"
                class="max-h-80 object-contain rounded" @error="onMediaError(currentIndex)" />
            </div>

            <!-- video -->
            <div v-else-if="isType(currentBlock, 'video')" class="w-full">
              <video controls class="w-full rounded shadow-md" :src="currentBlock.url"
                @error="onMediaError(currentIndex)">
                Your browser does not support video tags.
              </video>
            </div>

            <!-- multiple_choice -->
            <div v-else-if="isType(currentBlock, 'multiple_choice')" class="space-y-2">
              <p class="text-gray-700">
                {{
                  currentBlock.title
                    ? ""
                    : "Select the answer you think is correct:"
                }}
              </p>

              <div v-if="currentBlock.options && currentBlock.options.length">
                <!-- NOTE: bind to answers[currentIndex] -->
                <URadioGroup v-model="answers[currentIndex]" :items="getRadioItems(currentBlock.options)"
                  @update:modelValue="
                    (val) => computeMCQResult(currentIndex, val)
                  " />

                <div v-if="
                  currentBlock.explanation && results[currentIndex]?.submitted
                " class="mt-2 text-sm text-gray-600">
                  <strong>Explanation:</strong> {{ currentBlock.explanation }}
                </div>
              </div>

              <div v-else class="text-sm text-red-600">
                No options available (invalid option format).
              </div>
            </div>

            <!-- essay -->
            <div v-else-if="isType(currentBlock, 'essay')">
              <UTextarea :placeholder="currentBlock.placeholder ?? 'Write your answer here...'
                " class="min-h-[120px] w-full" v-model="localEssay[currentIndex]"
                @blur="submitEssayDebounced(currentIndex, true)" @input="submitEssayDebounced(currentIndex, false)" />

              <div class="flex items-center gap-3 mt-2">
                <div v-if="results[currentIndex]?.submitted" class="text-sm text-green-600">
                  Answer sent
                </div>
                <div v-else class="text-sm text-gray-500">
                  The answer will be saved automatically when you stop typing or
                  exit the box.
                </div>
                <div v-if="
                  currentBlock.explanation && results[currentIndex]?.submitted
                " class="text-sm text-gray-600">
                  • {{ currentBlock.explanation }}
                </div>
              </div>
            </div>

            <!-- unknown -->
            <div v-else class="text-sm text-red-600">
              Unrecognized content type:
              <strong>{{ getBlockType(currentBlock) }}</strong>
            </div>

            <div v-if="results[currentIndex]?.error" class="text-sm text-red-600">
              {{ results[currentIndex].error }}
            </div>
          </div>
        </div>

        <!-- pagination controls -->
        <div class="flex items-center justify-between mt-6">
          <div class="flex items-center gap-2">
            <UButton v-if="!isSubmitted" color="neutral" @click="resetAll" :disabled="isSubmitted"
              class="cursor-pointer">
              Reset All</UButton>
          </div>

          <div class="flex items-center gap-3">
            <UButton :disabled="currentIndex === 0" size="sm" @click="prevPage" class="cursor-pointer">Prev</UButton>
            <div class="text-sm text-gray-600">
              Page {{ currentIndex + 1 }} / {{ totalPages }}
            </div>
            <UButton :disabled="currentIndex >= totalPages - 1" size="sm" @click="nextPage" class="cursor-pointer">Next
            </UButton>
            <!-- jika di page terakhir, tombol submitAll -->
            <UButton color="success" @click="submitAll" v-if="currentIndex >= totalPages - 1 && !isSubmitted"
              class="cursor-pointer">Submit all</UButton>
          </div>
        </div>
      </div>


    </div>
  </div>
</template>

<script setup lang="ts">
import { useLessonStore } from "~/stores/lesson";

const route = useRoute();
const classId = computed(() => Number(route.params.id));
const lessonId = computed(() => Number(route.params.lessonid));
const lessonStore = useLessonStore();

// pagination
const currentIndex = ref(0);
const isSubmitted = ref(false);
const score = ref({ correct: 0, wrong: 0 });
const results = ref<Record<number, any>>({});
const localEssay = reactive<Record<number, string>>({});
const answers = reactive<Record<number, string>>({});
const essayTimers = new Map<number, number | undefined>();

// computed helpers
const totalPages = computed(
  () => lessonStore.lesson?.content_json?.length ?? 0
);
const currentBlock = computed(
  () => lessonStore.lesson?.content_json?.[currentIndex.value]
);

// helpers
function parseSimpleMarkdown(text: string = ""): string {
  if (!text) return "";
  text = text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  text = text.replace(/\*(.+?)\*/g, "<em>$1</em>");
  text = text.replace(/`([^`]+)`/g, "<code>$1</code>");
  return text;
}

const safeHtml = (html?: string) => parseSimpleMarkdown(html ?? "");
const setErrorFor = (idx: number, msg: string) => {
  results.value[idx] = {
    ...(results.value[idx] ?? {}),
    error: msg,
    submitted: false,
  };
};
const clearErrorFor = (idx: number) => {
  if (results.value[idx]) delete results.value[idx].error;
};
const isType = (block: any, t: string) => !!(block && block.type === t);
const getBlockType = (block: any) => block?.type ?? "unknown";
const onMediaError = (idx: number) =>
  setErrorFor(idx, "Failed to load media (video/image).");

// radio items
function getRadioItems(options: any[] | undefined) {
  if (!Array.isArray(options)) return [];
  return options.map((o: any, i: number) => ({
    label: o.value ?? String.fromCharCode(65 + i),
    value: o.value ?? o.label ?? String.fromCharCode(65 + i),
  }));
}

// evaluasi multiple choice
function computeMCQResult(idx: number, value: string | undefined) {
  if (isSubmitted.value) return;
  if (!lessonStore.lesson?.content_json) return;
  const block = lessonStore.lesson.content_json[idx] as any;
  if (!block) return;
  if (!value) {
    delete results.value[idx];
    return;
  }

  try {
    const options = Array.isArray(block?.options) ? block.options : [];
    const optIndex = options.findIndex(
      (o: any) => (o.value ?? o.label) === value
    );
    let isCorrect: boolean | undefined;

    if (optIndex >= 0) {
      const chosen = options[optIndex];
      if (typeof chosen.is_correct === "boolean") isCorrect = chosen.is_correct;
    } else if (typeof block.correctAnswer === "string") {
      const chosen = options.find((o: any) => (o.value ?? o.label) === value);
      const chosenLabel = chosen?.label ?? value;
      isCorrect = chosenLabel === block.correctAnswer;
    }

    results.value[idx] = {
      type: "multiple_choice",
      value,
      isCorrect,
      submitted: true,
      submittedAt: new Date().toISOString(),
    };

    saveProgress();
  } catch (err) {
    console.error("computeMCQResult error", err);
    setErrorFor(idx, "Errors when evaluating multiple choice answers.");
  }
}

watch(
  answers,
  (newVal) => {
    for (const k in newVal) computeMCQResult(Number(k), newVal[k]);
  },
  { deep: true }
);

// essay
function submitEssay(idx: number) {
  if (isSubmitted.value) return;
  try {
    clearErrorFor(idx);
    const block = lessonStore.lesson?.content_json?.[idx] as any;
    const text = (localEssay[idx] ?? "").trim();

    if (block?.max_length && text.length > block.max_length) {
      setErrorFor(
        idx,
        `Answer exceeds the ${block.max_length} character limit.`
      );
      return;
    }

    results.value[idx] = {
      type: "essay",
      value: text,
      submitted: true,
      submittedAt: new Date().toISOString(),
    };
    saveProgress();
  } catch (err) {
    console.error(err);
    setErrorFor(idx, "Error.");
  }
}

function submitEssayDebounced(idx: number, forceNow = false) {
  if (forceNow) {
    const t = essayTimers.get(idx);
    if (t) window.clearTimeout(t);
    essayTimers.delete(idx);
    submitEssay(idx);
    return;
  }

  const existing = essayTimers.get(idx);
  if (existing) window.clearTimeout(existing);
  const timer = window.setTimeout(() => {
    essayTimers.delete(idx);
    submitEssay(idx);
  }, 900);
  essayTimers.set(idx, timer);
}

async function saveResults() {
  // This is where you would call an API to save results permanently
  try {
    const payload = {
      results: results.value,
      savedAt: new Date().toISOString(),
    };
    console.log("Saving results to backend (mock):", payload);
  } catch (err) {
    console.error(err);
  }
}

function saveProgress() {
  const storageKey = `lesson_result_${lessonId.value}`;
  const existingData = localStorage.getItem(storageKey);
  const parsedExisting = existingData ? JSON.parse(existingData) : {};

  localStorage.setItem(storageKey, JSON.stringify({
    results: results.value,
    score: score.value,
    isSubmitted: isSubmitted.value,
    submittedAt: isSubmitted.value ? (parsedExisting.submittedAt || new Date().toISOString()) : null
  }));
}

function prevPage() {
  // save current essay (force)
  if (isType(currentBlock.value, "essay")) submitEssay(currentIndex.value);
  if (currentIndex.value > 0) currentIndex.value--;
}

function nextPage() {
  if (isType(currentBlock.value, "essay")) submitEssay(currentIndex.value);
  if (currentIndex.value < totalPages.value - 1) currentIndex.value++;
}

function goToFirstPage() {
  isSubmitted.value = false;
  currentIndex.value = 0;
}

async function submitAll() {
  if (isSubmitted.value) return;
  lessonStore.lesson?.content_json?.forEach((b: any, i: any) => {
    if (b.type === "essay" && !results.value[i]) submitEssay(i);
  });

  let correctCount = 0;
  let wrongCount = 0;

  for (const [_, res] of Object.entries(results.value)) {
    if (res.type === "multiple_choice") {
      if (res.isCorrect) correctCount++;
      else wrongCount++;
    }
  }

  score.value.correct = correctCount;
  score.value.wrong = wrongCount;
  isSubmitted.value = true;

  saveProgress();
  await saveResults();
}

function resetAll() {
  if (isSubmitted.value) return;

  Object.keys(results.value).forEach((k) => delete results.value[Number(k)]);
  Object.keys(localEssay).forEach((k) => delete localEssay[Number(k)]);
  Object.keys(answers).forEach((k) => delete answers[Number(k)]);
  score.value.correct = 0;
  score.value.wrong = 0;
  isSubmitted.value = false;
  currentIndex.value = 0;

  localStorage.removeItem(`lesson_result_${lessonId.value}`);
}

onMounted(async () => {
  await lessonStore.getDetailLesson(lessonId.value);

  // Load from local storage
  const savedData = localStorage.getItem(`lesson_result_${lessonId.value}`);
  if (savedData) {
    const parsed = JSON.parse(savedData);
    results.value = parsed.results || {};
    score.value = parsed.score || { correct: 0, wrong: 0 };
    isSubmitted.value = parsed.isSubmitted || false;

    // Fill local essay and answers for UI
    for (const [idx, res] of Object.entries(results.value) as any) {
      if (res.type === 'essay') {
        localEssay[idx] = res.value;
      } else if (res.type === 'multiple_choice') {
        answers[idx] = res.value;
      }
    }
  }

  lessonStore.lesson?.content_json?.forEach((b: any, i: number) => {
    if (b.type === "essay") localEssay[i] = localEssay[i] ?? "";
  });
});

const prettyResults = computed(() => JSON.stringify(results.value, null, 2));
</script>

<style scoped>
.prose img {
  max-width: 100%;
}
</style>
