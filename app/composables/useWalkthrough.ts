import { getWalkthroughConfig } from '~/config/walkthroughConfigs'
import type { WalkthroughStep } from '~/config/walkthroughConfigs'
import { useTutorialStore } from '~/stores/tutorial'
import { useSidebarStore } from '~/stores/sidebar'

export interface TooltipPosition {
  top: number
  left: number
  placement: 'top' | 'bottom' | 'left' | 'right'
}

export function useWalkthrough() {
  const store = useTutorialStore()
  const sidebarStore = useSidebarStore()
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
    const gap = window.innerWidth < 480 ? 8 : 12
    const viewportMargin = window.innerWidth < 480 ? 8 : window.innerWidth < 640 ? 12 : 16
    const tooltipWidth = window.innerWidth < 400
      ? window.innerWidth - 16
      : window.innerWidth < 640
        ? Math.min(300, window.innerWidth - 24)
        : Math.min(320, window.innerWidth - 32)
    const tooltipHeight = 160
    const isMobile = window.innerWidth < 768
    const isSmallMobile = window.innerWidth < 480

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

    // Final fallback: if still doesn't fit vertically, use whichever side has more space
    if (placement === 'bottom' && rect.bottom + gap + tooltipHeight > window.innerHeight - viewportMargin) {
      if (rect.top > window.innerHeight - rect.bottom) {
        placement = 'top'
      }
    } else if (placement === 'top' && rect.top - gap - tooltipHeight < viewportMargin) {
      if (window.innerHeight - rect.bottom > rect.top) {
        placement = 'bottom'
      }
    }

    let top = 0
    let left = 0

    switch (placement) {
      case 'bottom':
        top = rect.bottom + gap
        left = isSmallMobile
          ? (window.innerWidth - tooltipWidth) / 2
          : isMobile
            ? (window.innerWidth - tooltipWidth) / 2
            : rect.left + rect.width / 2 - tooltipWidth / 2
        break
      case 'top':
        top = rect.top - gap - tooltipHeight
        left = isSmallMobile
          ? (window.innerWidth - tooltipWidth) / 2
          : isMobile
            ? (window.innerWidth - tooltipWidth) / 2
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

  // Check if a target is inside the sidebar
  function isSidebarTarget(target: string): boolean {
    return target.startsWith('sidebar-')
  }

  // Track whether we opened the sidebar for the walkthrough
  let sidebarOpenedByWalkthrough = false
  let sidebarWasCollapsed = false

  // Update target rect and tooltip position for current step
  async function updateStepPosition() {
    if (!currentStepConfig.value || !store.isActive) {
      targetRect.value = null
      targetFound.value = false
      // Restore sidebar state if we changed it
      if (sidebarOpenedByWalkthrough) {
        sidebarStore.closeMobile()
        sidebarOpenedByWalkthrough = false
      }
      if (sidebarWasCollapsed) {
        sidebarStore.collapsed = true
        sidebarWasCollapsed = false
      }
      return
    }

    const isMobile = window.innerWidth < 1024
    const targetIsSidebar = isSidebarTarget(currentStepConfig.value.target)

    if (targetIsSidebar) {
      if (isMobile) {
        // On mobile: open sidebar drawer
        if (!sidebarStore.mobileOpen) {
          sidebarStore.mobileOpen = true
          sidebarOpenedByWalkthrough = true
          // Wait for sidebar animation to complete
          await new Promise((resolve) => setTimeout(resolve, 350))
        }
      } else {
        // On desktop: expand sidebar if collapsed
        if (sidebarStore.collapsed) {
          sidebarWasCollapsed = true
          sidebarStore.collapsed = false
          // Wait for expand animation
          await new Promise((resolve) => setTimeout(resolve, 350))
        }
      }

      // Ensure class list is open if targeting class list items
      if ((currentStepConfig.value.target === 'sidebar-class-list' || currentStepConfig.value.target === 'sidebar-class-card') && !sidebarStore.classListOpen) {
        sidebarStore.classListOpen = true
        await new Promise((resolve) => setTimeout(resolve, 200))
      }
    } else {
      // Moving away from sidebar — restore state
      if (isMobile && sidebarOpenedByWalkthrough) {
        sidebarStore.closeMobile()
        sidebarOpenedByWalkthrough = false
        await new Promise((resolve) => setTimeout(resolve, 350))
      }
      if (!isMobile && sidebarWasCollapsed) {
        sidebarStore.collapsed = true
        sidebarWasCollapsed = false
        await new Promise((resolve) => setTimeout(resolve, 350))
      }
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

  // Recalculate on resize/scroll/orientation change
  let resizeRafId: number | null = null
  function recalculatePosition() {
    if (store.isActive && currentStepConfig.value) {
      const el = document.querySelector<HTMLElement>(`[data-walkthrough="${currentStepConfig.value.target}"]`)
      if (el) {
        const rect = el.getBoundingClientRect()
        targetRect.value = rect
        tooltipPosition.value = calculatePosition(rect, currentStepConfig.value.placement)
      }
    }
  }

  function handleResize() {
    if (resizeRafId) return
    resizeRafId = requestAnimationFrame(() => {
      recalculatePosition()
      resizeRafId = null
    })
  }

  // Debounced version for scroll events
  let scrollRafId: number | null = null
  function handleScroll() {
    if (scrollRafId) return
    scrollRafId = requestAnimationFrame(() => {
      recalculatePosition()
      scrollRafId = null
    })
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
    // Restore sidebar state
    if (sidebarOpenedByWalkthrough) {
      sidebarStore.closeMobile()
      sidebarOpenedByWalkthrough = false
    }
    if (sidebarWasCollapsed) {
      sidebarStore.collapsed = true
      sidebarWasCollapsed = false
    }
  }

  function finish() {
    store.finishWalkthrough()
    targetRect.value = null
    targetFound.value = false
    // Restore sidebar state
    if (sidebarOpenedByWalkthrough) {
      sidebarStore.closeMobile()
      sidebarOpenedByWalkthrough = false
    }
    if (sidebarWasCollapsed) {
      sidebarStore.collapsed = true
      sidebarWasCollapsed = false
    }
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

  // Setup resize/scroll/orientation listeners
  onMounted(() => {
    window.addEventListener('resize', handleResize)
    window.addEventListener('scroll', handleScroll, true) // capture phase for nested scrollables
    window.addEventListener('orientationchange', () => {
      // Orientation change needs a slight delay for viewport to settle
      setTimeout(recalculatePosition, 100)
    })
    // Auto-start on initial mount
    autoStartIfNeeded()
  })

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    window.removeEventListener('scroll', handleScroll, true)
    window.removeEventListener('orientationchange', recalculatePosition)
    if (scrollRafId) {
      cancelAnimationFrame(scrollRafId)
    }
    if (resizeRafId) {
      cancelAnimationFrame(resizeRafId)
    }
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
