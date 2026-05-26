<template>
  <TooltipProvider>
    <div class="min-h-screen flex bg-slate-50 text-slate-900">
      <!-- Mobile sidebar backdrop -->
      <Transition name="fade">
        <div
          v-if="sidebar.mobileOpen"
          class="fixed inset-0 bg-black/40 z-40 lg:hidden"
          @click="handleBackdropClick"
        />
      </Transition>

      <!-- Sidebar: hidden on mobile, shown as overlay when mobileOpen -->
      <div :class="[
        'fixed inset-y-0 left-0 z-50 lg:relative lg:z-auto',
        'transform transition-transform duration-300 ease-in-out lg:transform-none',
        sidebar.mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      ]">
        <PartialSidebar />
      </div>

      <div class="flex-1 flex flex-col min-w-0">
        <PartialHeader />
        <main class="px-3 py-4 sm:px-4 sm:py-5 md:px-6 md:py-6 overflow-y-auto" style="height: calc(100vh - 64px);">
          <slot />
        </main>
      </div>
    </div>
    <TutorialWalkthroughOverlay />
  </TooltipProvider>
</template>

<script setup lang="ts">
import { TooltipProvider } from 'reka-ui'
import { useSidebarStore } from '~/stores/sidebar'
import { useTutorialStore } from '~/stores/tutorial'

const sidebar = useSidebarStore()
const tutorialStore = useTutorialStore()
const route = useRoute()

// Close mobile sidebar on route change
watch(() => route.path, () => {
  sidebar.closeMobile()
})

// Don't close sidebar via backdrop when walkthrough is active (it controls the sidebar)
function handleBackdropClick() {
  if (!tutorialStore.isActive) {
    sidebar.closeMobile()
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
