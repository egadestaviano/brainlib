import { getWalkthroughConfig } from '~/config/walkthroughConfigs'
import type { WalkthroughStep } from '~/config/walkthroughConfigs'
import { useTutorialStore } from '~/stores/tutorial'

export interface TooltipPosition {
  top: number
  left: number
  placement: 'top' | 'bottom' | 'left' | 'right'
}

export function useWalkthrough() {
  const store = useTutorialStore()
  const route = useRoute()

  const targetRect = ref<DOMRect | null>(null)
  const tooltipPosition = ref<TooltipPosition>({ top: 0, left: 0, placement: 'bottom' })
  const targetFound = ref(false)

  const currentConfig = computed(() => {
    if (!store.activeRoute) return null
    return getWalkthroughConfig(store.activeRoute)
  })

  const totalSteps = computed(() => currentConfig.value?.steps.length ?? 0)

  const currentStepConfig = computed<WalkthroughStep | null>(() => {
    if (!currentConfig.value) return null
    return currentConfig.value.steps[store.currentStep] ?? null
  })

  const isFirstStep = computed(() => store.currentStep === 0)
  const isLastStep = computed(() => store.currentStep >= totalSteps.value - 1)

  // Resolve target element with MutationObserver timeout
  function resolveTarget(target: string): Promise<HTMLElement | null> {
    return new Promise((resolve) => {
      const el = document.querySelector<HTMLElement>(`[data-walkthrough="${target}"]`)
      if (el) {
        resolve(el)
        return
      }

      // Wait up to 3 seconds for the element to appear
      const observer = new MutationObserver(() => {
        const found = document.querySelector<HTMLElement>(`[data-walkthrough="${target}"]`)
        if (found) {
          observer.disconnect()
          clearTimeout(timeout)
          resolve(found)
        }
      })

      const timeout = setTimeout(() => {
        observer.disconnect()
        resolve(null)
      }, 3000)

      observer.observe(document.body, { childList: true, subtree: true })
    })
  }

  // Scroll target into view if off-screen
  async function scrollToTarget(el: HTMLElement): Promise<void> {
    const rect = el.getBoundingClientRect()
    const inView = rect.top >= 0 && rect.bottom <= window.innerHeight

    if (!inView) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      // Wait for scroll to finish (max 500ms)
      await new Promise((resolve) => setTimeout(resolve, 500))
    }
  }

  // Calculate tooltip position with viewport boundary detection
  function calculatePosition(rect: DOMRect, preferredPlacement: WalkthroughStep['placement']): TooltipPosition {
    const gap = 12
    const viewportMargin = 8
    const tooltipWidth = 320
    const tooltipHeight = 160
    const isMobile = window.innerWidth < 768

    let placement = preferredPlacement

    // On mobile, restrict to top/bottom only
    if (isMobile && (placement === 'left' || placement === 'right')) {
      placement = 'bottom'
    }

    // Check if preferred placement fits, flip if not
    if (placement === 'bottom' && rect.bottom + gap + tooltipHeight > window.innerHeight - viewportMargin) {
      placement = 'top'
    } else if (placement === 'top' && rect.top - gap - tooltipHeight < viewportMargin) {
      placement = 'bottom'
    } else if (placement === 'right' && rect.right + gap + tooltipWidth > window.innerWidth - viewportMargin) {
      placement = 'left'
    } else if (placement === 'left' && rect.left - gap - tooltipWidth < viewportMargin) {
      placement = 'right'
    }

    let top = 0
    let left = 0

    switch (placement) {
      case 'bottom':
        top = rect.bottom + gap
        left = isMobile
          ? (window.innerWidth - Math.min(tooltipWidth, window.innerWidth - 16)) / 2
          : rect.left + rect.width / 2 - tooltipWidth / 2
        break
      case 'top':
        top = rect.top - gap - tooltipHeight
        left = isMobile
          ? (window.innerWidth - Math.min(tooltipWidth, window.innerWidth - 16)) / 2
          : rect.left + rect.width / 2 - tooltipWidth / 2
        break
      case 'right':
        top = rect.top + rect.height / 2 - tooltipHeight / 2
        left = rect.right + gap
        break
      case 'left':
        top = rect.top + rect.height / 2 - tooltipHeight / 2
        left = rect.left - gap - tooltipWidth
        break
    }

    // Clamp to viewport
    left = Math.max(viewportMargin, Math.min(left, window.innerWidth - tooltipWidth - viewportMargin))
    top = Math.max(viewportMargin, Math.min(top, window.innerHeight - tooltipHeight - viewportMargin))

    return { top, left, placement }
  }

  // Update target rect and tooltip position for current step
  async function updateStepPosition() {
    if (!currentStepConfig.value || !store.isActive) {
      targetRect.value = null
      targetFound.value = false
      return
    }

    const el = await resolveTarget(currentStepConfig.value.target)
    if (!el) {
      targetFound.value = false
      // Skip to next step if target not found
      if (!isLastStep.value) {
        store.nextStep()
      } else {
        store.finishWalkthrough()
      }
      return
    }

    targetFound.value = true
    await scrollToTarget(el)

    const rect = el.getBoundingClientRect()
    targetRect.value = rect
    tooltipPosition.value = calculatePosition(rect, currentStepConfig.value.placement)
  }

  // Recalculate on resize
  function handleResize() {
    if (store.isActive && currentStepConfig.value) {
      const el = document.querySelector<HTMLElement>(`[data-walkthrough="${currentStepConfig.value.target}"]`)
      if (el) {
        const rect = el.getBoundingClientRect()
        targetRect.value = rect
        tooltipPosition.value = calculatePosition(rect, currentStepConfig.value.placement)
      }
    }
  }

  // Actions
  function start(routePath?: string) {
    const targetRoute = routePath || route.path
    const config = getWalkthroughConfig(targetRoute)
    if (!config) return

    // Store the config route pattern as activeRoute (e.g. '/classes/:id')
    // so completion is tracked per pattern, not per specific URL
    store.startWalkthrough(config.route)
    nextTick(() => updateStepPosition())
  }

  function next() {
    if (isLastStep.value) {
      finish()
      return
    }
    store.nextStep()
    nextTick(() => updateStepPosition())
  }

  function prev() {
    if (isFirstStep.value) return
    store.prevStep()
    nextTick(() => updateStepPosition())
  }

  function skip() {
    store.skipWalkthrough()
    targetRect.value = null
    targetFound.value = false
  }

  function finish() {
    store.finishWalkthrough()
    targetRect.value = null
    targetFound.value = false
  }

  // Watch for step changes
  watch(() => store.currentStep, () => {
    if (store.isActive) {
      updateStepPosition()
    }
  })

  // Watch route changes - auto-start new route walkthrough
  watch(() => route.path, () => {
    // If walkthrough was finished (not active), start new one if needed
    if (!store.isActive) {
      autoStartIfNeeded()
    }
  })

  // First-time visitor auto-start
  function autoStartIfNeeded() {
    const config = getWalkthroughConfig(route.path)
    if (!config) return

    try {
      // Use the config route pattern as completion key (e.g. '/classes/:id')
      // so dynamic routes only show the walkthrough once regardless of params
      if (!store.isRouteCompleted(config.route)) {
        nextTick(() => {
          setTimeout(() => {
            if (!store.isActive) {
              start(route.path)
            }
          }, 1000)
        })
      }
    } catch {
      // localStorage unavailable - treat as returning visitor
    }
  }

  // Setup resize listener
  onMounted(() => {
    window.addEventListener('resize', handleResize)
    // Auto-start on initial mount
    autoStartIfNeeded()
  })

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
  })

  return {
    // State
    targetRect,
    tooltipPosition,
    targetFound,
    // Computed
    currentStepConfig,
    totalSteps,
    isFirstStep,
    isLastStep,
    currentConfig,
    // Actions
    start,
    next,
    prev,
    skip,
    finish,
    updateStepPosition,
  }
}
