<template>
  <Teleport to="body">
    <div v-if="store.isActive && targetRect && currentStepConfig" class="walkthrough-overlay">
      <!-- Backdrop panels (cutout effect) -->
      <div class="fixed inset-0 pointer-events-none" style="z-index: 9998;">
        <!-- Top panel -->
        <div
          class="absolute bg-black/50 pointer-events-auto"
          :style="{
            top: 0,
            left: 0,
            right: 0,
            height: `${Math.max(0, targetRect.top - 4)}px`
          }"
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
        />

        <!-- Target highlight ring -->
        <div
          class="absolute rounded-lg ring-2 ring-blue-400 ring-offset-2 pointer-events-none transition-all duration-300"
          :class="{ 'animate-pulse': currentStepConfig.requireClick }"
          :style="{
            top: `${targetRect.top - 4}px`,
            left: `${targetRect.left - 4}px`,
            width: `${targetRect.width + 8}px`,
            height: `${targetRect.height + 8}px`
          }"
        />

        <!-- Clickable target area (when requireClick is true) -->
        <div
          v-if="currentStepConfig.requireClick"
          class="absolute cursor-pointer pointer-events-auto"
          :style="{
            top: `${targetRect.top - 4}px`,
            left: `${targetRect.left - 4}px`,
            width: `${targetRect.width + 8}px`,
            height: `${targetRect.height + 8}px`
          }"
          @click="handleTargetClick"
        />
      </div>

      <!-- Tooltip -->
      <Transition name="tooltip-fade">
        <div
          ref="tooltipRef"
          role="dialog"
          aria-modal="true"
          :aria-label="`Tutorial step ${store.currentStep + 1} of ${totalSteps}: ${currentStepConfig.title}`"
          class="fixed w-80 max-w-[calc(100vw-16px)] bg-white rounded-xl shadow-2xl border border-slate-200 p-5 pointer-events-auto transition-all duration-300"
          style="z-index: 10000;"
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
              type="button"
              aria-label="Skip tutorial"
              class="text-xs text-slate-400 hover:text-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 rounded px-1 cursor-pointer"
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
              v-if="!isFirstStep && !currentStepConfig.requireClick"
              ref="prevBtnRef"
              type="button"
              aria-label="Previous step"
              class="px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 cursor-pointer"
              @click="prev"
            >
              Previous
            </button>
            <div v-else />

            <span v-if="currentStepConfig.requireClick" class="text-xs text-blue-600 font-medium animate-pulse">
              👆 Click to continue
            </span>
            <button
              v-else
              ref="nextBtnRef"
              type="button"
              :aria-label="isLastStep ? 'Finish tutorial' : 'Next step'"
              class="px-4 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 cursor-pointer"
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

const descriptionId = computed(() => `walkthrough-desc-${store.currentStep}`)

// Handle click on target element when requireClick is true
function handleTargetClick() {
  if (!currentStepConfig.value?.requireClick) return

  // Find the actual target element
  const el = document.querySelector<HTMLElement>(`[data-walkthrough="${currentStepConfig.value.target}"]`)

  // Finish/advance the walkthrough
  if (isLastStep.value) {
    finish()
  } else {
    next()
  }

  // Click the actual element - use nextTick to let the overlay unmount first
  nextTick(() => {
    if (el) {
      // For anchor/NuxtLink elements, find the <a> tag and navigate
      const anchor = el.tagName === 'A' ? el as HTMLAnchorElement : el.querySelector('a')
      if (anchor && anchor.href) {
        const url = new URL(anchor.href)
        useRouter().push(url.pathname)
      } else {
        el.click()
      }
    }
  })
}

// Save and restore focus
let previouslyFocused: HTMLElement | null = null

// Block scroll when walkthrough is active
watch(() => store.isActive, (active) => {
  if (import.meta.server) return
  if (active) {
    document.body.style.overflow = 'hidden'
    previouslyFocused = document.activeElement as HTMLElement | null
    nextTick(() => {
      nextBtnRef.value?.focus()
    })
  } else {
    document.body.style.overflow = ''
    if (previouslyFocused && previouslyFocused.focus) {
      previouslyFocused.focus()
      previouslyFocused = null
    }
  }
}, { immediate: true })

// Keyboard handling
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
  if (prevBtnRef.value) elements.push(prevBtnRef.value)
  if (nextBtnRef.value) elements.push(nextBtnRef.value)
  return elements
}

// Cleanup on unmount
onUnmounted(() => {
  if (import.meta.server) return
  document.body.style.overflow = ''
})
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
