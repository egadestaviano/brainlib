<template>
  <Teleport to="body">
    <Transition name="overlay-fade" @after-enter="onOverlayEntered">
      <div v-if="store.isActive && targetRect && currentStepConfig" class="walkthrough-overlay">
        <!-- SVG-based backdrop with cutout -->
        <svg
          class="fixed inset-0 w-full h-full pointer-events-auto"
          style="z-index: 9998;"
          :viewBox="`0 0 ${windowWidth} ${windowHeight}`"
          preserveAspectRatio="none"
          @click.self="skip"
        >
          <defs>
            <mask id="walkthrough-mask">
              <rect width="100%" height="100%" fill="white" />
              <rect
                :x="highlightX"
                :y="highlightY"
                :width="highlightW"
                :height="highlightH"
                :rx="highlightRadius"
                :ry="highlightRadius"
                fill="black"
                class="highlight-cutout"
              />
            </mask>
          </defs>
          <!-- Dark overlay with cutout -->
          <rect
            width="100%"
            height="100%"
            fill="rgba(0,0,0,0.5)"
            mask="url(#walkthrough-mask)"
          />
          <!-- Highlight border ring -->
          <rect
            :x="highlightX"
            :y="highlightY"
            :width="highlightW"
            :height="highlightH"
            :rx="highlightRadius"
            :ry="highlightRadius"
            fill="none"
            stroke="#60a5fa"
            stroke-width="2"
            class="highlight-ring"
            :class="{ 'animate-pulse-ring': currentStepConfig.requireClick }"
          />
        </svg>

        <!-- Clickable target area (when requireClick is true) -->
        <div
          v-if="currentStepConfig.requireClick"
          class="fixed cursor-pointer"
          style="z-index: 9999;"
          :style="{
            top: `${highlightY}px`,
            left: `${highlightX}px`,
            width: `${highlightW}px`,
            height: `${highlightH}px`,
            borderRadius: `${highlightRadius}px`
          }"
          @click="handleTargetClick"
        />

        <!-- Tooltip -->
        <div
          v-if="tooltipVisible"
          ref="tooltipRef"
          role="dialog"
          aria-modal="true"
          :aria-label="`Tutorial step ${store.currentStep + 1} of ${totalSteps}: ${currentStepConfig.title}`"
          class="fixed bg-white rounded-xl shadow-2xl border border-slate-200 pointer-events-auto walkthrough-tooltip tooltip-enter"
          style="z-index: 10000;"
          :style="{
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`,
            width: windowWidth < 400 ? 'calc(100vw - 16px)' : windowWidth < 640 ? 'min(300px, calc(100vw - 24px))' : 'min(320px, calc(100vw - 32px))',
            padding: windowWidth < 480 ? '12px' : '16px 20px'
          }"
          @keydown="handleKeydown"
        >
          <!-- Header with skip -->
          <div class="flex items-center justify-end mb-2 sm:mb-3">
            <button
              type="button"
              aria-label="Skip tutorial"
              class="text-xs text-slate-400 hover:text-slate-600 transition-colors focus:outline-none rounded px-1 cursor-pointer"
              @click="skip"
            >
              Skip
            </button>
          </div>

          <!-- Content -->
          <h3 :id="descriptionId" class="text-sm sm:text-base font-semibold text-slate-900 mb-1 sm:mb-1.5">
            {{ currentStepConfig.title }}
          </h3>
          <p class="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3 sm:mb-4" :aria-describedby="descriptionId">
            {{ currentStepConfig.description }}
          </p>

          <!-- Step dots -->
          <div class="flex items-center gap-1 mb-3">
            <span
              v-for="step in totalSteps"
              :key="step"
              :class="[
                'rounded-full transition-all duration-300',
                step - 1 <= store.currentStep
                  ? 'w-2 h-2 bg-blue-500'
                  : 'w-2 h-2 bg-slate-300'
              ]"
            />
          </div>

          <!-- Navigation buttons -->
          <div class="flex items-center justify-between gap-2">
            <button
              v-if="!isFirstStep && !currentStepConfig.requireClick"
              ref="prevBtnRef"
              type="button"
              aria-label="Previous step"
              class="px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 cursor-pointer"
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
              class="px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 cursor-pointer"
              @click="isLastStep ? finish() : next()"
            >
              {{ isLastStep ? 'Finish' : 'Next' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { useTutorialStore } from '~/stores/tutorial'
import { useWalkthrough } from '~/composables/useWalkthrough'

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
const tooltipVisible = ref(false)

// Reactive window dimensions
const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1024)
const windowHeight = ref(typeof window !== 'undefined' ? window.innerHeight : 768)

function updateWindowWidth() {
  windowWidth.value = window.innerWidth
  windowHeight.value = window.innerHeight
}

onMounted(() => {
  window.addEventListener('resize', updateWindowWidth)
  window.addEventListener('orientationchange', updateWindowWidth)
})

// Show tooltip after overlay fade-in completes
function onOverlayEntered() {
  tooltipVisible.value = true
  nextTick(() => {
    nextBtnRef.value?.focus()
  })
}

// When step changes, briefly hide tooltip for re-entrance animation
watch(() => store.currentStep, () => {
  if (store.isActive) {
    tooltipVisible.value = false
    nextTick(() => {
      setTimeout(() => {
        tooltipVisible.value = true
        nextTick(() => {
          nextBtnRef.value?.focus()
        })
      }, 250)
    })
  }
})

// When walkthrough becomes inactive, reset tooltip
watch(() => store.isActive, (active) => {
  if (!active) {
    tooltipVisible.value = false
  }
})

// Responsive highlight padding and radius
const highlightPadding = computed(() => {
  return windowWidth.value < 480 ? 4 : windowWidth.value < 768 ? 6 : 8
})
const highlightRadius = computed(() => {
  return windowWidth.value < 480 ? 6 : 8
})

// Computed highlight rect values
const highlightX = computed(() => {
  if (!targetRect.value) return 0
  return targetRect.value.left - highlightPadding.value
})
const highlightY = computed(() => {
  if (!targetRect.value) return 0
  return targetRect.value.top - highlightPadding.value
})
const highlightW = computed(() => {
  if (!targetRect.value) return 0
  return targetRect.value.width + highlightPadding.value * 2
})
const highlightH = computed(() => {
  if (!targetRect.value) return 0
  return targetRect.value.height + highlightPadding.value * 2
})

const descriptionId = computed(() => `walkthrough-desc-${store.currentStep}`)

// Handle click on target element when requireClick is true
function handleTargetClick() {
  if (!currentStepConfig.value?.requireClick) return

  const el = document.querySelector<HTMLElement>(`[data-walkthrough="${currentStepConfig.value.target}"]`)

  if (isLastStep.value) {
    finish()
  } else {
    next()
  }

  nextTick(() => {
    if (el) {
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
  window.removeEventListener('resize', updateWindowWidth)
  window.removeEventListener('orientationchange', updateWindowWidth)
})
</script>

<style scoped>
/* Overlay fades in smoothly with backdrop + cutout already in position */
.overlay-fade-enter-active {
  animation: overlay-in 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
.overlay-fade-leave-active {
  animation: overlay-out 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes overlay-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes overlay-out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

/* Tooltip entrance animation */
.tooltip-enter {
  animation: tooltip-slide-in 0.35s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes tooltip-slide-in {
  from {
    opacity: 0;
    transform: translateY(10px) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Smooth highlight transitions between steps */
.highlight-cutout,
.highlight-ring {
  transition: x 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              y 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              width 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              height 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              rx 0.3s ease,
              ry 0.3s ease;
}

.walkthrough-tooltip {
  transition: top 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              left 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              width 0.25s ease,
              padding 0.25s ease;
}

.animate-pulse-ring {
  animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse-ring {
  0%, 100% {
    stroke-opacity: 1;
    stroke-width: 2;
  }
  50% {
    stroke-opacity: 0.5;
    stroke-width: 3;
  }
}
</style>
