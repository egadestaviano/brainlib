<!-- components/ScrollArea.vue -->
<template>
  <div
    ref="root"
    :class="[
      'scroll-area relative w-full',
      className
    ]"
    tabindex="0"
    @keydown.page-down.prevent="pageDown"
    @keydown.page-up.prevent="pageUp"
    @keydown.home.prevent="toTop"
    @keydown.end.prevent="toBottom"
    role="region"
    :aria-label="ariaLabel"
  >
    <div class="content">
      <slot />
    </div>

    <!-- optional subtle top/bottom shadows to indicate scroll -->
    <div v-show="showTopFade" class="fade-top pointer-events-none" />
    <div v-show="showBottomFade" class="fade-bottom pointer-events-none" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue'

const props = defineProps({
  className: { type: String, default: '' },
  ariaLabel: { type: String, default: 'Scrollable area' },
  fadeHeight: { type: Number, default: 18 }, // px
})

const root = ref<HTMLElement | null>(null)
const showTopFade = ref(false)
const showBottomFade = ref(false)

function updateFades() {
  if (!root.value) return
  const el = root.value
  showTopFade.value = el.scrollTop > 2
  showBottomFade.value =
    el.scrollHeight - el.scrollTop - el.clientHeight > 2
}

function onScroll() {
  updateFades()
}

function pageDown() {
  if (!root.value) return
  root.value.scrollBy({ top: root.value.clientHeight * 0.9, behavior: 'smooth' })
}
function pageUp() {
  if (!root.value) return
  root.value.scrollBy({ top: -root.value.clientHeight * 0.9, behavior: 'smooth' })
}
function toTop() {
  root.value?.scrollTo({ top: 0, behavior: 'smooth' })
}
function toBottom() {
  if (!root.value) return
  root.value.scrollTo({ top: root.value.scrollHeight, behavior: 'smooth' })
}

onMounted(() => {
  if (!root.value) return
  updateFades()
  root.value.addEventListener('scroll', onScroll, { passive: true })
  // handle resize in case content height changes
  const ro = new ResizeObserver(updateFades)
  ro.observe(root.value)
  onBeforeUnmount(() => {
    ro.disconnect()
  })
})

onBeforeUnmount(() => {
  if (root.value) root.value.removeEventListener('scroll', onScroll)
})
</script>

<style scoped>
/* container sizing & basic overflow */
.scroll-area {
  overflow-y: auto;
  -webkit-overflow-scrolling: touch; /* smooth on iOS */
  position: relative;
  height: 100%;
}

/* inner content padding is controlled by consumer */
.scroll-area .content {
  padding-right: 8px; /* avoid hidden content behind scrollbar */
}

/* subtle top/bottom fade to indicate more content */
.fade-top,
.fade-bottom {
  position: absolute;
  left: 0;
  right: 0;
  height: 18px;
  pointer-events: none;
}
.fade-top {
  top: 0;
  background: linear-gradient(to bottom, rgba(255,255,255,0.9), rgba(255,255,255,0));
}
.fade-bottom {
  bottom: 0;
  background: linear-gradient(to top, rgba(255,255,255,0.9), rgba(255,255,255,0));
}

/* custom thin scrollbar - WebKit */
.scroll-area::-webkit-scrollbar {
  width: 10px;
}
.scroll-area::-webkit-scrollbar-track {
  background: transparent;
}
.scroll-area::-webkit-scrollbar-thumb {
  background-color: rgba(15,23,42,0.08);
  border-radius: 999px;
  border: 2px solid transparent; /* space around thumb */
  background-clip: padding-box;
}
.scroll-area::-webkit-scrollbar-thumb:hover {
  background-color: rgba(15,23,42,0.14);
}

/* custom for Firefox */
.scroll-area {
  scrollbar-width: thin;
  scrollbar-color: rgba(15,23,42,0.08) transparent;
}

/* focus ring for accessibility */
.scroll-area:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(99,102,241,0.08);
  border-radius: 6px;
}
</style>
