<template>
  <div>
    <!-- Page Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-slate-900">My Classes</h1>
      <p class="text-sm text-slate-500 mt-1">View and manage your enrolled classes</p>
    </div>

    <!-- Skeleton Loading -->
    <div v-if="LmsClassStore.loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <div v-for="n in 6" :key="n" class="bg-white rounded-xl border border-slate-200 p-5 space-y-4 animate-pulse">
        <div class="space-y-2">
          <USkeleton class="h-5 w-2/3 rounded" />
          <USkeleton class="h-4 w-full rounded" />
        </div>
        <div class="flex items-center gap-3 pt-2">
          <USkeleton class="h-9 w-9 rounded-full" />
          <div class="space-y-1.5 flex-1">
            <USkeleton class="h-3.5 w-24 rounded" />
            <USkeleton class="h-3 w-32 rounded" />
          </div>
        </div>
        <div class="pt-2 border-t border-slate-100">
          <USkeleton class="h-3.5 w-20 rounded" />
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!LmsClassStore.clases || LmsClassStore.clases.length === 0"
      class="flex flex-col items-center justify-center py-20">
      <div class="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
        <UIcon name="heroicons-academic-cap" class="h-8 w-8 text-slate-400" />
      </div>
      <h3 class="text-lg font-semibold text-slate-700">No classes yet</h3>
      <p class="text-sm text-slate-500 mt-1 mb-6">Create or join a class to get started</p>
    </div>

    <!-- Data State -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <NuxtLink
        v-for="classList in LmsClassStore.clases"
        :key="classList.id"
        :to="'/classes/' + classList.id"
        class="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md hover:border-slate-300 transition-all duration-200 group"
      >
        <div class="mb-4">
          <h2 class="text-lg font-semibold text-slate-900 line-clamp-1 group-hover:text-slate-700">
            {{ classList.title }}
          </h2>
          <p class="text-sm text-slate-500 line-clamp-2 mt-1">{{ classList.description }}</p>
        </div>

        <div class="flex items-center gap-3">
          <div
            :class="avatarColor(classList.id)"
            class="w-9 h-9 rounded-full text-white flex items-center justify-center font-semibold text-sm shrink-0"
          >
            {{ classList.creator.profile?.display_name?.[0] || classList.title[0] }}
          </div>
          <div class="min-w-0 flex-1">
            <p class="text-sm font-medium text-slate-800 truncate">
              {{ classList.creator.profile?.display_name }}
            </p>
            <p class="text-xs text-slate-500 truncate">{{ classList.creator.email }}</p>
          </div>
        </div>

        <div class="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs text-slate-500">
          <UIcon name="heroicons-users" class="h-3.5 w-3.5" />
          <span>{{ classList.member_count }} students</span>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLmsClassStore } from '~/stores/lmsclass'

const LmsClassStore = useLmsClassStore()

const colors = ['bg-emerald-500', 'bg-violet-500', 'bg-amber-500', 'bg-rose-500', 'bg-sky-500']

function avatarColor(id: number) {
  return colors[id % colors.length]
}
</script>
