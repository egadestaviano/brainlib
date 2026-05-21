<template>
  <Teleport to="body">
    <div v-if="store.isActive && targetRect && currentStepConfig" class="walkthrough-overlay">
      <!-- Backdrop panels (cutout effect) -->
      <div class="fixed inset-0 z-9998 pointer-events-none">
        <!-- Top panel -->
        <div
          class="absolute bg-black/50 pointer-events-auto"
          :style="{
            top: 0,
            left: 0,
            right: 0,
            height: `${Math.max(0, targetRect.top - 4)}px`
          }"
          @click="skip"
        />
        <!-- Bottom panel -->
        <div
          class="absolute bg-black/50 pointer-events-auto"
          :style="{
            top: `${targetRect.bottom + 4}px`,
            left: 0,
            right: 0,
            bottom: 0
          }"
          @click="skip"
        />
        <!-- Left panel -->
        <div
          class="absolute bg-black/50 pointer-events-auto"
          :style="{
            top: `${Math.max(0, targetRect.top - 4)}px`,
            left: 0,
            width: `${Math.max(0, targetRect.left - 4)}px`,
            height: `${targetRect.height + 8}px`
          }"
          @click="skip"
        />
        <!-- Right panel -->
        <div
          class="absolute bg-black/50 pointer-events-auto"
          :style="{
            top: `${Math.max(0, targetRect.top - 4)}px`,
            left: `${targetRect.right + 4}px`,
            right: 0,
            height: `${targetRect.height + 8}px`
          }"
          @click="skip"
        />

        <!-- Target highlight ring -->
        <div
          class="absolute rounded-lg ring-2 ring-blue-400 ring-offset-2 pointer-events-none transition-all duration-300"
          :style="{
            top: `${targetRect.top - 4}px`,
            left: `${targetRect.left - 4}px`,
            width: `${targetRect.width + 8}px`,
            height: `${targetRect.height + 8}px`
          }"
        />
      </div>

      <!-- Tooltip -->
      <Transition name="tooltip-fade">
        <div
          ref="tooltipRef"
          role="dialog"
          aria-modal="true"
          :aria-label="`Tutorial step ${store.currentStep + 1} of ${totalSteps}: ${currentStepConfig.title}`"
          class="fixed z-10000 w-80 max-w-[calc(100vw-16px)] bg-white rounded-xl shadow-2xl border border-slate-200 p-5 transition-all duration-300"
          :style="{
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`
          }"
          @keydown="handleKeydown"
        >
          <!-- Step indicator -->
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-medium text-slate-400">
              {{ store.currentStep + 1 }} / {{ totalSteps }}
            </span>
            <button
              ref="skipBtnRef"
              type="button"
              aria-label="Skip tutorial"
              class="text-xs text-slate-400 hover:text-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 rounded px-1"
              @click="skip"
            >
              Skip
            </button>
          </div>

          <!-- Content -->
          <h3 :id="descriptionId" class="text-base font-semibold text-slate-900 mb-1.5">
            {{ currentStepConfig.title }}
          </h3>
          <p class="text-sm text-slate-600 leading-relaxed mb-4" :aria-describedby="descriptionId">
            {{ currentStepConfig.description }}
          </p>

          <!-- Navigation buttons -->
          <div class="flex items-center justify-between gap-2">
            <button
              v-if="!isFirstStep"
              ref="prevBtnRef"
              type="button"
              aria-label="Previous step"
              class="px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1"
              @click="prev"
            >
              Previous
            </button>
            <div v-else />

            <button
              ref="nextBtnRef"
              type="button"
              :aria-label="isLastStep ? 'Finish tutorial' : 'Next step'"
              class="px-4 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1"
              @click="isLastStep ? finish() : next()"
            >
              {{ isLastStep ? 'Finish' : 'Next' }}
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useTutorialStore } from '~/stores/tutorial'

const store = useTutorialStore()
const {
  targetRect,
  tooltipPosition,
  currentStepConfig,
  totalSteps,
  isFirstStep,
  isLastStep,
  next,
  prev,
  skip,
  finish,
} = useWalkthrough()

const tooltipRef = ref<HTMLElement | null>(null)
const nextBtnRef = ref<HTMLElement | null>(null)
const prevBtnRef = ref<HTMLElement | null>(null)
const skipBtnRef = ref<HTMLElement | null>(null)

const descriptionId = computed(() => `walkthrough-desc-${store.currentStep}`)

// Save and restore focus
let previouslyFocused: HTMLElement | null = null

watch(() => store.isActive, (active) => {
  if (active) {
    previouslyFocused = document.activeElement as HTMLElement | null
    nextTick(() => {
      nextBtnRef.value?.focus()
    })
  } else {
    if (previouslyFocused && previouslyFocused.focus) {
      previouslyFocused.focus()
      previouslyFocused = null
    }
  }
})

// Focus trap and keyboard handling
function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    e.preventDefault()
    skip()
    return
  }

  if (e.key === 'Tab') {
    e.preventDefault()
    const focusable = getFocusableElements()
    if (focusable.length === 0) return

    const currentIndex = focusable.indexOf(document.activeElement as HTMLElement)

    if (e.shiftKey) {
      const prevIndex = currentIndex <= 0 ? focusable.length - 1 : currentIndex - 1
      focusable[prevIndex]?.focus()
    } else {
      const nextIndex = currentIndex >= focusable.length - 1 ? 0 : currentIndex + 1
      focusable[nextIndex]?.focus()
    }
  }
}

function getFocusableElements(): HTMLElement[] {
  const elements: HTMLElement[] = []
  if (skipBtnRef.value) elements.push(skipBtnRef.value)
  if (prevBtnRef.value) elements.push(prevBtnRef.value)
  if (nextBtnRef.value) elements.push(nextBtnRef.value)
  return elements
}
</script>

<style scoped>
.tooltip-fade-enter-active,
.tooltip-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.tooltip-fade-enter-from,
.tooltip-fade-leave-to {
  opacity: 0;
  transform: translateY(4px);
}
</style>
