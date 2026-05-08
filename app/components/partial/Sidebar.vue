<template>
  <aside @mouseenter="sidebar.hovered = true" @mouseleave="sidebar.hovered = false" :class="[
    'flex flex-col bg-white transition-all duration-300 ease-in-out h-screen shadow-sm',
    (sidebar.collapsed && !sidebar.hovered) ? 'w-24' : 'w-72'
  ]">
    <div :class="[
      'flex items-center px-4 py-3 transition-all',
      (sidebar.collapsed && !sidebar.hovered) ? 'justify-center' : 'justify-between'
    ]">
      <NuxtLink to="/classes" v-if="!sidebar.collapsed || sidebar.hovered" class="block">
        <img src="/favicon.svg" alt="Mentora Logo" class="h-10 w-auto object-contain" />
      </NuxtLink>

      <NuxtLink to="/classes" v-else class="flex items-center justify-center">
        <img src="/favicon.svg" alt="Mentora Icon" class="h-10 w-10 object-contain" />
      </NuxtLink>
    </div>

    <div class="px-4 pt-2 flex-1 flex flex-col overflow-hidden">
      <div :class="[
        'flex items-center gap-1 rounded-lg transition',
        (sidebar.collapsed && !sidebar.hovered) ? 'justify-center' : '',
        isNavActive('/classes') ? 'bg-blue-600' : 'hover:bg-slate-50'
      ]">
        <NuxtLink to="/classes" :class="[
          'group flex items-center gap-3 p-2 flex-1 rounded-lg transition',
          (sidebar.collapsed && !sidebar.hovered) ? 'justify-center px-0' : 'justify-start px-3'
        ]">
          <div :class="['flex items-center justify-center w-9 h-9 rounded-full transition-colors', isNavActive('/classes') ? 'bg-blue-50' : 'bg-slate-50']">
            <UIcon name="heroicons-academic-cap" :class="['h-5 w-5', isNavActive('/classes') ? 'text-blue-600' : 'text-slate-600']" />
          </div>
          <span v-if="!sidebar.collapsed || sidebar.hovered"
            :class="['text-sm font-medium', isNavActive('/classes') ? 'text-white' : 'text-slate-700']">
            My Classes
          </span>
        </NuxtLink>

        <button v-if="!sidebar.collapsed || sidebar.hovered"
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
        <div v-if="sidebar.classListOpen && (!sidebar.collapsed || sidebar.hovered)"
          class="flex-1 overflow-hidden mt-2">
          <div class="h-full overflow-y-auto">
            <div class="space-y-1 py-1">
              <NuxtLink v-for="cls in classesWithColor" :key="cls.id" :to="`/classes/${cls.id}`" :class="[
                'group flex items-center gap-3 p-3 rounded-xl transition-all duration-200',
                isClassActive(cls.id)
                  ? 'bg-slate-100 border border-slate-200'
                  : 'hover:bg-slate-50 border border-transparent'
              ]">
                <div :class="[
                  'w-10 h-10 rounded-xl flex items-center justify-center text-white font-semibold shrink-0 transition-transform',
                  cls.color,
                  isClassActive(cls.id) ? 'scale-105' : 'group-hover:scale-105'
                ]">
                  {{ cls.title[0] }}
                </div>
                <div class="flex flex-col min-w-0">
                  <span :class="[
                    'text-sm leading-5 truncate',
                    isClassActive(cls.id) ? 'font-semibold text-slate-900' : 'font-medium text-slate-700'
                  ]">
                    {{ cls.title }}
                  </span>
                  <span class="text-xs text-slate-500 truncate">{{ cls.creator.profile?.display_name }}</span>
                </div>
                <div v-if="isClassActive(cls.id)" class="ml-auto shrink-0">
                  <div class="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                </div>
              </NuxtLink>
            </div>
          </div>
        </div>
      </transition>
    </div>

    <!-- Footer nav -->
    <div class="px-4 pb-4">
      <ul class="space-y-1">
        <li v-for="item in footerNav" :key="item.label">
          <NuxtLink :to="item.to" :class="[
            'group flex items-center gap-3 p-2 rounded-lg transition-all duration-150 w-full',
            (sidebar.collapsed && !sidebar.hovered) ? 'justify-center px-0' : 'justify-start px-3',
            isNavActive(item.to)
              ? 'bg-blue-600 text-white'
              : 'hover:bg-slate-50'
          ]">
            <div :class="['flex items-center justify-center w-9 h-9 rounded-full transition-colors', isNavActive(item.to) ? 'bg-blue-50' : 'bg-slate-50']">
              <UIcon :name="item.icon" :class="['h-5 w-5', isNavActive(item.to) ? 'text-blue-600' : 'text-slate-600']" />
            </div>
            <span v-if="!sidebar.collapsed || sidebar.hovered"
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

const isAdmin = computed(() => {
  const roles = authStore.user?.roles?.map(r => r.toLowerCase()) || []
  return roles.includes('admin')
})

const footerNav = computed(() => {
  const base = [
    { label: 'Subscription', icon: 'heroicons-credit-card', to: '/subscription' },
  ]
  
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

watch(() => route.fullPath, () => {
  sidebar.setHovered(false)
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
</style>
