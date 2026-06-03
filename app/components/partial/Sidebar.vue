<template>
  <aside :class="[
    'flex flex-col bg-white transition-all duration-300 ease-in-out h-screen shadow-sm',
    sidebar.collapsed ? 'w-24' : 'w-72'
  ]">
    <div :class="[
      'px-4 transition-all',
      sidebar.collapsed ? 'flex h-18 items-center justify-center' : 'block py-3'
    ]">
      <NuxtLink
        to="/classes"
        :class="[
          'relative flex items-center overflow-hidden rounded-xl transition-all duration-300',
          sidebar.collapsed ? 'h-10 w-10 justify-center' : 'h-10 w-full gap-3 px-3'
        ]"
        :aria-label="sidebar.collapsed ? 'Brainlib home' : undefined"
      >
        <img
          src="/favicon.svg"
          alt="Brainlib Logo"
          :class="[
            'object-contain transition-all duration-300',
            sidebar.collapsed ? 'h-10 w-10 shrink-0' : 'h-11 w-11 shrink-0'
          ]"
        />
      
      </NuxtLink>
    </div>

    <div class="px-4 pt-2 flex-1 flex flex-col overflow-hidden">
      <div data-walkthrough="sidebar-classes" :class="[
        'flex items-center gap-1 rounded-lg transition',
        sidebar.collapsed ? 'justify-center' : '',
        isNavActive('/classes') ? 'bg-blue-600' : 'hover:bg-slate-50'
      ]">
        <NuxtLink to="/classes" :class="[
          'group flex items-center gap-3 p-2 flex-1 rounded-lg transition',
          sidebar.collapsed ? 'justify-center px-0' : 'justify-start px-3'
        ]">
          <div :class="['flex items-center justify-center w-9 h-9 rounded-full transition-colors', isNavActive('/classes') ? 'bg-blue-50' : 'bg-slate-50']">
            <UIcon name="heroicons-academic-cap" :class="['h-5 w-5', isNavActive('/classes') ? 'text-blue-600' : 'text-slate-600']" />
          </div>
          <span v-if="!sidebar.collapsed"
            :class="['text-sm font-medium', isNavActive('/classes') ? 'text-white' : 'text-slate-700']">
            My Classes
          </span>
        </NuxtLink>

        <button v-if="!sidebar.collapsed"
          @click="sidebar.toggleClassList"
          :class="[
            'p-2 mr-1 rounded-md transition',
            isNavActive('/classes') ? 'hover:bg-blue-700' : 'hover:bg-slate-100'
          ]"
          :aria-label="sidebar.classListOpen ? 'Collapse class list' : 'Expand class list'">
          <UIcon
            :name="sidebar.classListOpen ? 'heroicons-chevron-up' : 'heroicons-chevron-down'"
            :class="['h-4 w-4', isNavActive('/classes') ? 'text-white' : 'text-slate-400']" />
        </button>
      </div>

      <transition name="slide-fade">
        <div v-if="sidebar.collapsed || sidebar.classListOpen"
          class="flex-1 overflow-hidden mt-2" data-walkthrough="sidebar-class-list">
          <div :class="[
            'h-full overflow-y-auto',
            sidebar.collapsed ? 'sidebar-scroll-collapsed pr-1' : 'sidebar-scroll-expanded pr-2'
          ]">
            <div class="space-y-1 py-1">
              <NuxtLink v-for="(cls, index) in classesWithColor" :key="cls.id" :to="`/classes/${cls.id}`"
                :data-walkthrough="index === 0 ? 'sidebar-class-card' : undefined"
                :class="[
                'group rounded-xl transition-all duration-200',
                sidebar.collapsed ? 'flex justify-center p-2' : 'flex items-center gap-3 p-3',
                isClassActive(cls.id)
                  ? 'bg-slate-100 border border-slate-200'
                  : 'hover:bg-slate-50 border border-transparent'
              ]"
                :title="cls.title">
                <div :class="[
                  'w-10 h-10 rounded-xl flex items-center justify-center text-white font-semibold shrink-0 transition-transform',
                  cls.color,
                  isClassActive(cls.id) ? 'scale-105' : 'group-hover:scale-105'
                ]">
                  {{ cls.title[0] }}
                </div>
                <div v-if="!sidebar.collapsed" class="flex flex-col min-w-0">
                  <span :class="[
                    'text-sm leading-5 truncate',
                    isClassActive(cls.id) ? 'font-semibold text-slate-900' : 'font-medium text-slate-700'
                  ]">
                    {{ cls.title }}
                  </span>
                  <span class="text-xs text-slate-500 truncate">{{ cls.creator.profile?.display_name }}</span>
                </div>
                <div v-if="isClassActive(cls.id) && !sidebar.collapsed" class="ml-auto shrink-0">
                  <div class="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                </div>
              </NuxtLink>
            </div>
          </div>
        </div>
      </transition>
    </div>

    <!-- Footer nav -->
    <div data-walkthrough="sidebar-footer-nav" class="px-4 pb-4">
      <ul class="space-y-1">
        <li v-for="item in footerNav" :key="item.label">
          <NuxtLink :to="item.to" :class="[
            'group flex items-center gap-3 p-2 rounded-lg transition-all duration-150 w-full',
            sidebar.collapsed ? 'justify-center px-0' : 'justify-start px-3',
            isNavActive(item.to)
              ? 'bg-blue-600 text-white'
              : 'hover:bg-slate-50'
          ]"
            :title="item.label">
            <div :class="['flex items-center justify-center w-9 h-9 rounded-full transition-colors', isNavActive(item.to) ? 'bg-blue-50' : 'bg-slate-50']">
              <UIcon :name="item.icon" :class="['h-5 w-5', isNavActive(item.to) ? 'text-blue-600' : 'text-slate-600']" />
            </div>
            <span v-if="!sidebar.collapsed"
              :class="['text-sm font-medium', isNavActive(item.to) ? 'text-white' : 'text-slate-700']">
              {{ item.label }}
            </span>
          </NuxtLink>
        </li>
      </ul>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useLmsClassStore } from '~/stores/lmsclass'
import { useSidebarStore } from '~/stores/sidebar'
import { useAuthStore } from '~/stores/auth'

const sidebar = useSidebarStore()
const LmsClassStore = useLmsClassStore()
const authStore = useAuthStore()
const route = useRoute()

const isStudent = computed(() => {
  const roles = authStore.user?.roles?.map(r => r.toLowerCase()) || []
  return roles.includes('student')
})

const isAdmin = computed(() => {
  const roles = authStore.user?.roles?.map(r => r.toLowerCase()) || []
  return roles.includes('admin')
})

const footerNav = computed(() => {
  const base = []
  
  if (!isStudent.value && !isAdmin.value) {
    base.push({ label: 'Subscription', icon: 'heroicons-credit-card', to: '/subscription' })
  }
  
  if (isAdmin.value) {
    base.push({ label: 'System Analytics', icon: 'heroicons-chart-bar', to: '/dashboard' })
  }
  
  return base
})

const avatarColors = [
  'bg-blue-500',
  'bg-violet-500',
  'bg-amber-500',
  'bg-rose-500',
  'bg-sky-500',
]

function colorFor(id: number) {
  return avatarColors[id % avatarColors.length]
}

const classesWithColor = computed(() => {
  const source = (LmsClassStore.clases && LmsClassStore.clases.length > 0)
    ? LmsClassStore.clases
    : []
  return source.map(c => ({
    ...c,
    color: colorFor(c.id),
  }))
})

function isNavActive(to: string) {
  if (to === '/classes') {
    return route.path === '/classes'
  }
  return route.path === to || route.path.startsWith(to + '/')
}

function isClassActive(classId: number) {
  return route.path.startsWith(`/classes/${classId}`)
}
</script>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 180ms ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

.sidebar-scroll-expanded {
  scrollbar-color: rgba(15, 23, 42, 0.14) transparent;
  scrollbar-width: thin;
}

.sidebar-scroll-expanded::-webkit-scrollbar {
  width: 8px;
}

.sidebar-scroll-expanded::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-scroll-expanded::-webkit-scrollbar-thumb {
  background-color: rgba(15, 23, 42, 0.14);
  border-radius: 999px;
}

.sidebar-scroll-collapsed {
  scrollbar-color: rgba(15, 23, 42, 0.1) transparent;
  scrollbar-width: thin;
}

.sidebar-scroll-collapsed::-webkit-scrollbar {
  width: 4px;
}

.sidebar-scroll-collapsed::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-scroll-collapsed::-webkit-scrollbar-thumb {
  background-color: rgba(15, 23, 42, 0.1);
  border-radius: 999px;
}
</style>
