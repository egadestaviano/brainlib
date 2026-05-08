<template>
  <div class="w-full">
    <UButton
      color="primary"
      size="md"
      icon="heroicons-plus"
      class="cursor-pointer"
      @click="openLessonModal"
    >
      Add Lesson
    </UButton>

    <!-- Main Modal: Lesson Editor -->
    <UModal v-model:open="modalOpen" :ui="{ content: 'sm:max-w-3xl' }">
      <template #content>
        <div class="flex flex-col max-h-[90vh]">
          <!-- Header -->
          <div class="px-6 pt-6 pb-4 border-b border-slate-100">
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center ring-1 ring-blue-100 shrink-0">
                <UIcon name="heroicons-book-open" class="h-6 w-6 text-blue-600" />
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="text-xl font-semibold text-slate-900 tracking-tight">Create New Lesson</h3>
                <p class="text-sm text-slate-500 mt-0.5">Fill in lesson details, then add content blocks. You can edit anything before saving.</p>
              </div>
            </div>

            <!-- Tabs -->
            <div class="mt-5 flex items-center gap-1 -mb-4">
              <button
                v-for="t in lessonTabs"
                :key="t.key"
                type="button"
                @click="activeTab = t.key"
                :class="[
                  'relative inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition rounded-t-lg',
                  activeTab === t.key
                    ? 'text-blue-700'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50',
                  t.key === 'content' && !canAccessContent ? 'opacity-50 cursor-not-allowed' : ''
                ]"
                :disabled="t.key === 'content' && !canAccessContent"
              >
                <UIcon :name="t.icon" class="h-4 w-4" />
                {{ t.label }}
                <span v-if="t.key === 'content' && state.content_json.length"
                  class="inline-flex items-center justify-center min-w-5 h-5 px-1.5 text-[11px] font-semibold rounded-full"
                  :class="activeTab === 'content' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'"
                >
                  {{ state.content_json.length }}
                </span>
                <span v-if="activeTab === t.key" class="absolute bottom-0 left-2 right-2 h-0.5 bg-blue-500 rounded-full"></span>
              </button>
            </div>
          </div>

          <!-- Tab: Details -->
          <div v-if="activeTab === 'details'" class="flex-1 overflow-y-auto px-6 py-6">
            <UForm :schema="schema" :state="formState" class="space-y-5" @submit.prevent="syncDetailsAndContinue">
              <UFormField label="Lesson Title" name="title" required>
                <UInput v-model="formState.title" placeholder="e.g. Introduction to Algebra" class="w-full" size="lg" />
              </UFormField>

              <UFormField label="Description" name="summary" hint="Short overview shown to students" required>
                <UTextarea v-model="formState.summary" placeholder="What will students learn in this lesson?" :rows="3" class="w-full" />
              </UFormField>

              <UFormField label="Short Content" name="content" hint="Optional preview text">
                <UTextarea v-model="formState.content" placeholder="Optional short content..." :rows="3" class="w-full" />
              </UFormField>

              <div v-if="lessonStore.error" class="flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg px-3 py-2.5">
                <UIcon name="heroicons-exclamation-circle" class="h-5 w-5 shrink-0 mt-0.5" />
                <p>{{ lessonStore.error }}</p>
              </div>
            </UForm>
          </div>

          <!-- Tab: Content -->
          <div v-else class="flex-1 overflow-y-auto px-6 py-6 space-y-5">
            <!-- AI Generator -->
            <div class="rounded-xl border border-violet-200 bg-violet-50/50 p-4">
              <div class="flex items-center gap-2 mb-2">
                <UIcon name="heroicons-sparkles" class="h-4 w-4 text-violet-600" />
                <span class="text-sm font-semibold text-violet-900">Generate with AI</span>
              </div>
              <p class="text-xs text-violet-700/80 mb-3">Describe the lesson content you want, and AI will generate the blocks for you.</p>
              <div class="flex gap-2">
                <UTextarea
                  v-model="aiPrompt"
                  placeholder="e.g. Module about photosynthesis with 5 multiple choices and 1 essay question"
                  :rows="2"
                  class="flex-1"
                />
                <UButton
                  color="primary"
                  variant="solid"
                  size="md"
                  icon="heroicons-sparkles"
                  :loading="aiLoading.block"
                  @click="aiGenerateBlock"
                  class="self-stretch"
                >
                  Generate
                </UButton>
              </div>
            </div>

            <!-- Block list -->
            <div class="flex items-center justify-between">
              <h4 class="text-sm font-semibold text-slate-900">Content Blocks <span class="text-slate-400 font-normal">({{ state.content_json.length }})</span></h4>
              <UButton color="neutral" size="sm" icon="heroicons-plus" @click="openBlockModalNew">
                Add Block
              </UButton>
            </div>

            <div v-if="state.content_json.length === 0" class="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 py-10 text-center">
              <div class="w-12 h-12 mx-auto rounded-full bg-white border border-slate-200 flex items-center justify-center mb-3">
                <UIcon name="heroicons-rectangle-stack" class="h-5 w-5 text-slate-400" />
              </div>
              <p class="text-sm font-medium text-slate-700">No content blocks yet</p>
              <p class="text-xs text-slate-500 mt-1">Click "Add Block" or generate with AI to begin.</p>
            </div>

            <div v-else class="space-y-2">
              <div
                v-for="(block, idx) in state.content_json"
                :key="block.__id || idx"
                class="group flex items-start gap-3 bg-white rounded-xl border border-slate-200 p-4 hover:border-slate-300 hover:shadow-sm transition"
              >
                <div :class="['w-10 h-10 rounded-lg flex items-center justify-center shrink-0', blockTypeStyle(block.type).bg]">
                  <UIcon :name="blockTypeStyle(block.type).icon" :class="['h-5 w-5', blockTypeStyle(block.type).text]" />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2">
                    <span class="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{{ Number(idx) + 1 }}</span>
                    <span :class="['text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded', blockTypeStyle(block.type).bg, blockTypeStyle(block.type).text]">
                      {{ blockTypeStyle(block.type).label }}
                    </span>
                  </div>
                  <p class="text-sm font-medium text-slate-900 mt-1 truncate">{{ block.title || '(Untitled)' }}</p>
                  <p class="text-xs text-slate-500 truncate">{{ blockPreview(block) }}</p>
                </div>
                <div class="flex items-center gap-1 shrink-0">
                  <UButton size="xs" variant="ghost" color="neutral" icon="heroicons-arrow-up" :disabled="idx === 0" @click="moveUp(Number(idx))" />
                  <UButton size="xs" variant="ghost" color="neutral" icon="heroicons-arrow-down" :disabled="idx === state.content_json.length - 1" @click="moveDown(Number(idx))" />
                  <UButton size="xs" variant="ghost" color="neutral" icon="heroicons-pencil-square" @click="openBlockModalEdit(Number(idx))" />
                  <UButton size="xs" variant="ghost" color="error" icon="heroicons-trash" @click="removeBlock(Number(idx))" />
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
            <UButton variant="ghost" color="neutral" size="lg" @click="closeLessonModal">
              Cancel
            </UButton>
            <div class="flex items-center gap-2">
              <UButton
                v-if="activeTab === 'content'"
                variant="outline"
                color="neutral"
                size="lg"
                icon="heroicons-arrow-left"
                @click="activeTab = 'details'"
              >
                Back to Details
              </UButton>
              <UButton
                v-if="activeTab === 'details'"
                color="primary"
                size="lg"
                icon="heroicons-arrow-right"
                @click="syncDetailsAndContinue"
              >
                Continue to Content
              </UButton>
              <UButton
                v-else
                color="primary"
                size="lg"
                icon="heroicons-check"
                :loading="lmsClassStore.loading"
                @click="submitFinal"
              >
                Save Lesson
              </UButton>
            </div>
          </div>
        </div>
      </template>
    </UModal>

    <!-- Sub-Modal: Block Picker / Editor -->
    <UModal v-model:open="blockModalOpen" :ui="{ content: 'sm:max-w-2xl' }">
      <template #content>
        <div class="flex flex-col max-h-[90vh]">
          <!-- Header -->
          <div class="px-6 pt-6 pb-4 border-b border-slate-100">
            <h3 class="text-lg font-semibold text-slate-900 tracking-tight">
              {{ editingBlockIndex === null ? 'Add Content Block' : 'Edit Content Block' }}
            </h3>
            <p class="text-sm text-slate-500 mt-0.5">Choose a type and fill in the content. The block will be added to your lesson.</p>
          </div>

          <div class="flex-1 overflow-y-auto px-6 py-6 space-y-5">
            <!-- Type picker (always shown for context) -->
            <div>
              <label class="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Block Type</label>
              <div class="grid grid-cols-2 sm:grid-cols-5 gap-2">
                <button
                  v-for="t in blockTypes"
                  :key="t.value"
                  type="button"
                  @click="changeDraftType(t.value)"
                  :class="[
                    'flex flex-col items-center gap-1.5 p-3 rounded-lg border transition text-center',
                    draftBlock.type === t.value
                      ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                  ]"
                >
                  <div :class="['w-8 h-8 rounded-lg flex items-center justify-center', t.bg]">
                    <UIcon :name="t.icon" :class="['h-4 w-4', t.text]" />
                  </div>
                  <span :class="['text-xs font-medium', draftBlock.type === t.value ? 'text-blue-900' : 'text-slate-700']">
                    {{ t.label }}
                  </span>
                </button>
              </div>
            </div>

            <!-- Config fields based on type -->
            <div class="border-t border-slate-100 pt-5 space-y-4">
              <!-- Text -->
              <template v-if="draftBlock.type === 'text'">
                <UFormField label="Title">
                  <UInput v-model="draftBlock.title" placeholder="e.g. Introduction" class="w-full" />
                </UFormField>
                <UFormField label="Content" required>
                  <UTextarea v-model="draftBlock.content" placeholder="Write the lesson content here..." :rows="6" class="w-full" />
                </UFormField>
              </template>

              <!-- Image -->
              <template v-else-if="draftBlock.type === 'image'">
                <UFormField label="Title">
                  <UInput v-model="draftBlock.title" placeholder="e.g. Diagram of cell structure" class="w-full" />
                </UFormField>
                <UFormField label="Image File" required>
                  <input
                    type="file"
                    accept="image/*"
                    @change="handleDraftFileUpload($event, 'image')"
                    class="block w-full text-sm text-slate-700 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer"
                  />
                </UFormField>
                <UFormField label="Alternative Text" hint="For accessibility">
                  <UInput v-model="draftBlock.alt" placeholder="Describe the image" class="w-full" />
                </UFormField>
                <div v-if="draftBlock.url" class="rounded-lg border border-slate-200 p-2 bg-slate-50">
                  <img :src="draftBlock.url" :alt="draftBlock.alt" class="rounded-md max-h-56 mx-auto object-contain" />
                </div>
              </template>

              <!-- Video -->
              <template v-else-if="draftBlock.type === 'video'">
                <UFormField label="Title">
                  <UInput v-model="draftBlock.title" placeholder="e.g. Lecture recording" class="w-full" />
                </UFormField>
                <UFormField label="Video File" required>
                  <input
                    type="file"
                    accept="video/*"
                    @change="handleDraftFileUpload($event, 'video')"
                    class="block w-full text-sm text-slate-700 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer"
                  />
                </UFormField>
                <video v-if="draftBlock.url" controls class="rounded-lg border border-slate-200 w-full max-h-60">
                  <source :src="draftBlock.url" type="video/mp4" />
                </video>
              </template>

              <!-- Multiple Choice -->
              <template v-else-if="draftBlock.type === 'multiple_choice'">
                <UFormField label="Question" required>
                  <UInput v-model="draftBlock.title" placeholder="e.g. What is the capital of France?" class="w-full" />
                </UFormField>
                <UFormField label="Options" hint="Tick the correct answer(s)" required>
                  <div class="space-y-2">
                    <div v-for="(opt, oidx) in draftBlock.options" :key="oidx" class="flex items-center gap-2">
                      <label class="flex items-center justify-center w-9 h-9 rounded-lg border border-slate-200 cursor-pointer shrink-0" :class="opt.is_correct ? 'bg-blue-50 border-blue-300' : 'bg-white'">
                        <input type="checkbox" v-model="opt.is_correct" class="accent-blue-600" />
                      </label>
                      <UInput v-model="opt.value" :placeholder="`Option ${Number(oidx) + 1}`" class="flex-1" />
                      <UButton size="sm" variant="ghost" color="error" icon="heroicons-trash" @click="removeDraftOption(Number(oidx))" />
                    </div>
                    <UButton color="neutral" variant="outline" size="sm" icon="heroicons-plus" @click="addDraftOption">
                      Add Option
                    </UButton>
                  </div>
                </UFormField>
                <UFormField label="Explanation" hint="Shown after answering">
                  <UTextarea v-model="draftBlock.explanation" placeholder="Why is this the correct answer?" :rows="2" class="w-full" />
                </UFormField>
              </template>

              <!-- Essay -->
              <template v-else-if="draftBlock.type === 'essay'">
                <UFormField label="Question" required>
                  <UInput v-model="draftBlock.title" placeholder="e.g. Explain the water cycle" class="w-full" />
                </UFormField>
                <UFormField label="Placeholder" hint="Hint text inside the input">
                  <UInput v-model="draftBlock.placeholder" placeholder="Write your answer here..." class="w-full" />
                </UFormField>
                <UFormField label="Maximum Length" hint="Number of characters">
                  <UInput type="number" v-model.number="draftBlock.max_length" placeholder="500" class="w-full" />
                </UFormField>
                <UFormField label="Explanation">
                  <UTextarea v-model="draftBlock.explanation" placeholder="Optional notes..." :rows="2" class="w-full" />
                </UFormField>
              </template>
            </div>
          </div>

          <!-- Footer -->
          <div class="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
            <UButton variant="ghost" color="neutral" size="lg" @click="closeBlockModal">
              Cancel
            </UButton>
            <UButton color="primary" size="lg" :icon="editingBlockIndex === null ? 'heroicons-plus' : 'heroicons-check'" @click="saveDraftBlock">
              {{ editingBlockIndex === null ? 'Add Block' : 'Save Changes' }}
            </UButton>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import * as v from "valibot";
import { useAuthStore } from "~/stores/auth";
import { useLessonStore } from "~/stores/lesson";
import { useLmsClassStore } from "~/stores/lmsclass";
import { useSubscriptionStore } from "~/stores/subscription";

const aiLoading = reactive({ summary: false, block: false });
const props = defineProps<{ classId: number }>();
const lessonStore = useLessonStore();
const lmsClassStore = useLmsClassStore();
const authStore = useAuthStore();
const toast = useToast();
const subscriptionStore = useSubscriptionStore();

// modal
const modalOpen = ref(false);
const aiPrompt = ref("");

type TabKey = "details" | "content";
const activeTab = ref<TabKey>("details");

const lessonTabs: { key: TabKey; label: string; icon: string }[] = [
  { key: "details", label: "Details", icon: "heroicons-document-text" },
  { key: "content", label: "Content Blocks", icon: "heroicons-rectangle-stack" },
];

const canAccessContent = computed(
  () => formState.title.trim().length > 0 && formState.summary.trim().length > 0
);

// lesson full state
const state = reactive({
  class_id: 0,
  title: "",
  summary: "",
  content: "",
  content_json: [],
  author_id: 0,
  is_published: true,
} as any);

// details form state
const formState = reactive({
  title: "",
  summary: "",
  content: "",
});

const schema = v.object({
  title: v.pipe(v.string(), v.minLength(1, "Title is required")),
  summary: v.pipe(v.string()),
  content: v.pipe(v.string()),
});

const openLessonModal = () => {
  activeTab.value = "details";
  formState.title = "";
  formState.summary = "";
  formState.content = "";
  state.title = "";
  state.summary = "";
  state.content = "";
  state.content_json = [];
  newBlockCounter.value = 0;
  modalOpen.value = true;
};

const closeLessonModal = (): void => {
  modalOpen.value = false;
};

const syncDetailsAndContinue = () => {
  if (!formState.title.trim() || !formState.summary.trim()) {
    toast.add({ title: "Please fill in title and description first", color: "warning" });
    return;
  }
  state.title = formState.title;
  state.summary = formState.summary;
  state.content = formState.content;
  activeTab.value = "content";
};

// ----- Block sub-modal state -----
const newBlockCounter = ref(0);
const blockModalOpen = ref(false);
const editingBlockIndex = ref<number | null>(null);

const blockTypes = [
  { value: "text", label: "Text", icon: "heroicons-bars-3-bottom-left", bg: "bg-sky-50", text: "text-sky-600" },
  { value: "image", label: "Image", icon: "heroicons-photo", bg: "bg-amber-50", text: "text-amber-600" },
  { value: "video", label: "Video", icon: "heroicons-video-camera", bg: "bg-rose-50", text: "text-rose-600" },
  { value: "multiple_choice", label: "Multiple Choice", icon: "heroicons-list-bullet", bg: "bg-violet-50", text: "text-violet-600" },
  { value: "essay", label: "Essay", icon: "heroicons-pencil-square", bg: "bg-blue-50", text: "text-blue-600" },
] as const;

function blockTypeStyle(type: string) {
  const found = blockTypes.find((b) => b.value === type);
  return found ?? { value: "text", label: type, icon: "heroicons-document", bg: "bg-slate-50", text: "text-slate-600" };
}

function blockPreview(block: any): string {
  if (!block) return "";
  switch (block.type) {
    case "text":
      return (block.content || "").slice(0, 80) + ((block.content || "").length > 80 ? "..." : "");
    case "image":
      return block.url ? "Image attached" : "No image yet";
    case "video":
      return block.url ? "Video attached" : "No video yet";
    case "multiple_choice":
      return `${block.options?.length || 0} options`;
    case "essay":
      return `Max ${block.max_length || 500} chars`;
    default:
      return "";
  }
}

const draftBlock = reactive<any>({
  type: "text",
  title: "",
  content: "",
});

function resetDraft() {
  Object.keys(draftBlock).forEach((k) => delete draftBlock[k]);
  draftBlock.type = "text";
  draftBlock.title = "";
  draftBlock.content = "";
}

function changeDraftType(type: string) {
  const preservedTitle = draftBlock.title || "";
  resetDraft();
  draftBlock.type = type;
  draftBlock.title = preservedTitle;
  if (type === "image") {
    draftBlock.url = "";
    draftBlock.alt = "";
  } else if (type === "video") {
    draftBlock.url = "";
  } else if (type === "multiple_choice") {
    draftBlock.options = [
      { value: "", is_correct: false },
      { value: "", is_correct: false },
    ];
    draftBlock.explanation = "";
  } else if (type === "essay") {
    draftBlock.placeholder = "";
    draftBlock.max_length = 500;
    draftBlock.explanation = "";
  }
}

const openBlockModalNew = () => {
  editingBlockIndex.value = null;
  resetDraft();
  blockModalOpen.value = true;
};

const openBlockModalEdit = (idx: number) => {
  const original = state.content_json[idx];
  if (!original) return;
  editingBlockIndex.value = idx;
  resetDraft();
  Object.assign(draftBlock, JSON.parse(JSON.stringify(original)));
  blockModalOpen.value = true;
};

const closeBlockModal = () => {
  blockModalOpen.value = false;
};

const saveDraftBlock = () => {
  // Basic validation per type
  if (draftBlock.type !== "image" && draftBlock.type !== "video") {
    if (!draftBlock.title?.trim() && draftBlock.type !== "text") {
      toast.add({ title: "Please add a title/question", color: "warning" });
      return;
    }
  }
  if (draftBlock.type === "text" && !draftBlock.content?.trim()) {
    toast.add({ title: "Content is required for text blocks", color: "warning" });
    return;
  }
  if ((draftBlock.type === "image" || draftBlock.type === "video") && !draftBlock.url) {
    toast.add({ title: `Please upload a ${draftBlock.type} file`, color: "warning" });
    return;
  }
  if (draftBlock.type === "multiple_choice") {
    const validOptions = (draftBlock.options || []).filter((o: any) => o.value?.trim());
    if (validOptions.length < 2) {
      toast.add({ title: "Add at least 2 options", color: "warning" });
      return;
    }
    if (!validOptions.some((o: any) => o.is_correct)) {
      toast.add({ title: "Mark at least one correct answer", color: "warning" });
      return;
    }
  }

  const blockToSave = JSON.parse(JSON.stringify(draftBlock));
  if (!blockToSave.__id) blockToSave.__id = "new_" + ++newBlockCounter.value;

  if (editingBlockIndex.value === null) {
    state.content_json.push(blockToSave);
  } else {
    state.content_json[editingBlockIndex.value] = blockToSave;
  }
  blockModalOpen.value = false;
};

const handleDraftFileUpload = (event: Event, _type: string) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    draftBlock.url = reader.result as string;
  };
  reader.readAsDataURL(file);
};

const addDraftOption = () => {
  if (!draftBlock.options) draftBlock.options = [];
  draftBlock.options.push({ value: "", is_correct: false });
};

const removeDraftOption = (idx: number) => {
  if (!draftBlock.options) return;
  draftBlock.options.splice(idx, 1);
};

// ----- Block list operations -----
const removeBlock = (index: number) => {
  if (index < 0 || index >= state.content_json.length) return;
  state.content_json.splice(index, 1);
};

const moveUp = (index: number) => {
  if (index <= 0) return;
  const prev = state.content_json[index - 1];
  const current = state.content_json[index];
  if (!prev || !current) return;
  state.content_json[index - 1] = current;
  state.content_json[index] = prev;
};

const moveDown = (index: number) => {
  if (index >= state.content_json.length - 1) return;
  const next = state.content_json[index + 1];
  const current = state.content_json[index];
  if (!next || !current) return;
  state.content_json[index + 1] = current;
  state.content_json[index] = next;
};

const submitFinal = async () => {
  if (!authStore.user) return;
  if (state.content_json.length === 0) {
    toast.add({ title: "Add at least one content block before saving", color: "warning" });
    return;
  }

  state.class_id = props.classId;
  state.author_id = authStore.user.id;

  await lessonStore.createLesson({ ...state });
  await lmsClassStore.getDetailsClass(props.classId);
  closeLessonModal();
};

const callAi = async (
  type: string,
  payload: {
    prompt?: string;
    messages?: Array<{ type: string; content: string }>;
  }
) => {
  try {
    const res: any = await $fetch(`/api/ai?type=${encodeURIComponent(type)}`, {
      method: "POST",
      body: payload,
    });
    
    if (!res || !res.success) {
      if (res?.limitReached) {
        toast.add({
          title: 'Limit Reached',
          description: res.error || 'You have reached your AI generation limit.',
          color: 'error',
          actions: [
            { label: 'Upgrade Plan', onClick: () => { navigateTo('/subscriptions') } }
          ]

        });
      } else {
        toast.add({
          title: 'AI Error',
          description: res?.error || 'Failed to generate content.',
          color: 'error'
        });
      }
      console.error("AI error", res);
      return "";
    }

    // Refresh subscription data to show updated usage
    subscriptionStore.fetchCurrentSubscription();

    let out = (res as any).output ?? "";
    if (out && typeof out === "object") {
      try {
        out = JSON.stringify(out);
      } catch (e) {
        out = String(out);
      }
    }
    return out;
  } catch (err: any) {
    console.error("Fetch AI error", err);
    toast.add({
      title: 'Request Failed',
      description: 'Could not connect to AI service.',
      color: 'error'
    });
    return "";
  }
};


const aiGenerateBlock = async () => {
  if (!aiPrompt.value.trim()) {
    alert("Please enter a prompt to generate blocks");
    return;
  }

  aiLoading.block = true;
  try {
    const systemPrompt = `You are an educational content generator. Generate lesson content blocks... (your original system prompt)
    
    IMPORTANT: Return ONLY a valid JSON object, no markdown formatting, no backticks, no explanation.

    Example expected output format (exact JSON array; this is an instructive example — return similar structure not the literal text):
    [
      {
        "type":"text",
        "title":"Space: A Glimpse into the Universe",
        "content":"Space is the space beyond the atmosphere... (short summary)"
      },
      {
        "type":"multiple_choice",
        "title":"What is meant by space??",
        "options":[
          {"value":"Space outside Earth's atmosphere","is_correct":true},
          {"value":"Planetary core","is_correct":false},
          {"value":"Layers of air in the atmosphere","is_correct":false},
          {"value":"Man-made satellite","is_correct":false},
          {"value":"Ozone layer","is_correct":false}
        ],
        "explanation":"The correct answer is because space is space outside the Earth's atmosphere.."
      },
      {
        "type":"essay",
        "title":"Explain the importance of space exploration",
        "placeholder":"Write your answer here...",
        "max_length":500
      },
      {
        "type":"essay",
        "title":"How space technology affects everyday life?",
        "placeholder":"Write your answer here...",
        "max_length":400
      }
    ]
    
    Return ONLY the JSON, nothing else.`;

    const text = await callAi("block", {
      messages: [
        { type: "system", content: systemPrompt },
        { type: "user", content: aiPrompt.value },
      ],
    });

    if (!text) {
      return;
    }

    function extractJsonObjects(raw: string): any[] {
      const results: any[] = [];

      if (!raw || typeof raw !== "string") return results;
      let s = raw.trim();

      try {
        const parsed = JSON.parse(s);
        return [parsed];
      } catch (e) {
        // TODO: ignore
      }

      try {
        const wrapper = JSON.parse(s.replace(/\r/g, ""));
        if (wrapper && typeof wrapper.output === "string") {
          s = wrapper.output;
        } else if (wrapper && typeof wrapper.output === "object") {
          results.push(wrapper.output);
          return results;
        }
      } catch (e) {
        // TODO: ignore
      }

      const codeFenceRegex = /```(?:json)?\s*([\s\S]*?)```/g;
      let m: any;
      while ((m = codeFenceRegex.exec(s)) !== null) {
        const candidate = m[1].trim();
        try {
          results.push(JSON.parse(candidate));
        } catch (e) {
          // TODO: ignore
        }
      }
      if (results.length) return results;

      const objRegex = /(\{[\s\S]*?\})(?=\s*\{|\s*$)/g;
      while ((m = objRegex.exec(s)) !== null) {
        const candidate = m[1];
        try {
          results.push(JSON.parse(candidate));
        } catch (e) {
          // TODO: ignore
        }
      }
      if (results.length) return results;

      const arrMatch: any = s.match(/(\[[\s\S]*\])/);
      if (arrMatch) {
        try {
          const parsedArr = JSON.parse(arrMatch[1]);
          return [parsedArr];
        } catch (e) {
          // TODO: ignore
        }
      }

      const firstBrace = s.indexOf("{");
      const lastBrace = s.lastIndexOf("}");
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        const candidate = s.slice(firstBrace, lastBrace + 1);
        try {
          results.push(JSON.parse(candidate));
        } catch (e) {
          // TODO: ignore
        }
      }

      return results;
    }

    const extracted = extractJsonObjects(text);
    if (!extracted.length) {
      console.error("❌ No JSON blocks were extracted from AI response:", text);
      return;
    }

    const blockObjects: any[] = [];

    function normalizeModuleFormat(obj: any): any[] {
      const outBlocks: any[] = [];

      if (
        obj.title ||
        obj.module_content ||
        obj.moduleDescription ||
        obj.content
      ) {
        const title = obj.title || obj.moduleTitle || "Generated Module";
        const content =
          obj.module_content || obj.content || obj.moduleDescription || "";
        outBlocks.push({
          type: "text",
          title,
          content,
        });
      }

      const assessment = obj.assessment || obj.assessments || obj.quiz || null;
      if (assessment) {
        const mcs =
          assessment.multiple_choice ||
          assessment.mcq ||
          assessment.multipleChoice;
        if (Array.isArray(mcs)) {
          for (const q of mcs) {
            const title = q.question || q.title || "Multiple Choice Questions";
            const optionsSrc = Array.isArray(q.options) ? q.options : [];
            const options = optionsSrc.map((opt: any) => {
              const value =
                typeof opt === "string" ? opt : opt.value ?? opt.text ?? "";
              const answerVal = q.answer ?? q.correct ?? q.key ?? null;
              const is_correct =
                answerVal != null &&
                String(value).trim() === String(answerVal).trim();
              return { value, is_correct };
            });

            if (
              !options.some((o: any) => o.is_correct) &&
              typeof q.answer === "string"
            ) {
              for (const o of options) {
                if (String(o.value).trim() === String(q.answer).trim()) {
                  o.is_correct = true;
                }
              }
            }

            outBlocks.push({
              type: "multiple_choice",
              title,
              options,
              explanation: q.explanation || q.explain || "",
            });
          }
        }

        const essays =
          assessment.essay || assessment.essays || assessment.open_ended;
        if (Array.isArray(essays)) {
          for (const e of essays) {
            const title = e.question || e.title || "Essay";
            const max_words =
              e.max_words ?? e.maxWords ?? e.max_words_allowed ?? e.max_length;
            const max_length =
              typeof max_words === "number"
                ? Math.max(100, Math.floor(max_words * 7))
                : e.max_length ?? 500;
            outBlocks.push({
              type: "essay",
              title,
              placeholder: e.placeholder ?? "Write your answer here...",
              max_length,
            });
          }
        }
      }

      return outBlocks;
    }

    for (const item of extracted) {
      if (Array.isArray(item)) {
        for (const el of item) blockObjects.push(el);
      } else if (item && typeof item === "object") {
        if (item.output && typeof item.output === "object") {
          const outObj = item.output;
          if (
            outObj.module_content ||
            (outObj.assessment &&
              (outObj.assessment.multiple_choice || outObj.assessment.essay))
          ) {
            const blocksFromModule = normalizeModuleFormat(outObj);
            for (const b of blocksFromModule) blockObjects.push(b);
          } else if (Array.isArray(outObj)) {
            for (const b of outObj) blockObjects.push(b);
          } else if (
            outObj.type &&
            (outObj.title ||
              outObj.content ||
              outObj.options ||
              outObj.placeholder)
          ) {
            blockObjects.push(outObj);
          } else {
            const maybe = normalizeModuleFormat(outObj);
            if (maybe.length) {
              for (const b of maybe) blockObjects.push(b);
            } else {
              blockObjects.push(outObj);
            }
          }
        } else if (
          item.module_content ||
          (item.assessment &&
            (item.assessment.multiple_choice || item.assessment.essay))
        ) {
          const blocksFromModule = normalizeModuleFormat(item);
          for (const b of blocksFromModule) blockObjects.push(b);
        } else if (
          item.type &&
          (item.title || item.content || item.options || item.placeholder)
        ) {
          blockObjects.push(item);
        } else {
          let found = false;
          for (const v of Object.values(item)) {
            if (Array.isArray(v)) {
              for (const el of v) {
                if (el && typeof el === "object" && el.type) {
                  blockObjects.push(el);
                  found = true;
                }
              }
            } else if (v && typeof v === "object" && (v as any).type) {
              blockObjects.push(v);
              found = true;
            }
          }
          if (!found) {
            blockObjects.push(item);
          }
        }
      }
    }

    if (!blockObjects.length) {
      console.error(
        "❌ No valid block objects found after normalization:",
        extracted
      );
      return;
    }

    const addedBlocks: any[] = [];
    for (const blockDataRaw of blockObjects) {
      const blockData = blockDataRaw || {};
      if (!blockData.type) blockData.type = "text";
      if (!blockData.title) {
        if (blockData.module_title) blockData.title = blockData.module_title;
        else blockData.title = "Generated Block";
      }

      const newBlock: any = {
        type: blockData.type,
        title: blockData.title,
        __id: "new_" + ++newBlockCounter.value,
      };

      switch (blockData.type) {
        case "text":
          newBlock.content =
            blockData.content ?? blockData.module_content ?? "";
          break;
        case "image":
          newBlock.url = blockData.url || blockData.src || "";
          newBlock.alt = blockData.alt || "";
          break;
        case "video":
          newBlock.url = blockData.url || "";
          break;
        case "multiple_choice":
          newBlock.options = Array.isArray(blockData.options)
            ? blockData.options.map((o: any) => ({
                value: o.value ?? o.text ?? o,
                is_correct: !!o.is_correct,
              }))
            : Array.isArray(blockData.optionsRaw)
            ? blockData.optionsRaw.map((opt: any) => ({
                value: opt,
                is_correct: false,
              }))
            : [];
          if (
            newBlock.options &&
            newBlock.options.length &&
            !newBlock.options.some((o: any) => o.is_correct) &&
            blockData.answer
          ) {
            for (const o of newBlock.options) {
              if (String(o.value).trim() === String(blockData.answer).trim()) {
                o.is_correct = true;
              }
            }
          }
          newBlock.explanation =
            blockData.explanation || blockData.explain || "";
          break;
        case "essay":
          newBlock.placeholder = blockData.placeholder || "";
          newBlock.max_length =
            blockData.max_length || blockData.maxWords || blockData.max_words
              ? blockData.max_length ??
                (blockData.max_words
                  ? Math.max(100, Math.floor(blockData.max_words * 7))
                  : 500)
              : 500;
          newBlock.explanation = blockData.explanation || "";
          break;
        default:
          newBlock.content = blockData.content ?? JSON.stringify(blockData);
      }

      state.content_json.push(newBlock);
      addedBlocks.push(newBlock);
    }

    aiPrompt.value = "";
  } catch (err) {
    console.error("❌ AI generate block error", err);
  } finally {
    aiLoading.block = false;
  }
};
</script>
