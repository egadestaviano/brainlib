<template>
  <div>
    <!-- Skeleton Loading -->
    <div v-if="LmsClassStore.loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <USkeleton v-for="n in 6" :key="n" class="h-48 rounded-xl" />
    </div>

    <!-- Empty State -->
    <div v-else-if="!LmsClassStore.clases || LmsClassStore.clases.length === 0" class="text-center py-10 text-gray-500">
      No classes found
    </div>

    <!-- Data State -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <NuxtLink v-for="(classList, index) in LmsClassStore.clases" :key="classList.id" :to="'/classes/' + classList.id"
        class="animate-in fade-up-in" :style="{ animationDelay: `${index * 0.1}s` }">
        <UCard class="hover-lift transition-all hover:shadow-lg">
          <template #header>
            <h1 class="text-2xl font-bold">{{ classList.title }}</h1>
            <h4 class="text-sm text-gray-500">{{ classList.description }}</h4>
          </template>

          <div class="flex items-center gap-3 py-3">
            <div
              class="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 text-white flex items-center justify-center font-medium shadow-sm transition-transform group-hover:scale-110">
              {{ classList.creator.profile?.display_name?.[0] || classList.title[0] }}
            </div>
            <div class="flex flex-col">
              <span class="text-sm font-medium text-slate-800">
                {{ classList.creator.profile?.display_name }}
              </span>
              <span class="text-xs text-slate-500">
                {{ classList.creator.email }}
              </span>
            </div>
          </div>

          <template #footer>
            <div class="flex items-center justify-between">
              <span class="text-sm text-slate-600">{{ classList.member_count }} Students</span>
              <UIcon name="i-heroicons-chevron-right" class="w-4 h-4 text-slate-300" />
            </div>
          </template>
        </UCard>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLmsClassStore } from "~/stores/lmsclass"
const LmsClassStore = useLmsClassStore()

onMounted(() => {
  LmsClassStore.getMyClass()
})
</script>

<style scoped>
@keyframes fade-up-in {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-in {
  animation-fill-mode: forwards;
}

.fade-up-in {
  animation: fade-up-in 0.6s ease-out;
}

.hover-lift {
  transition: transform 0.2s ease-out, shadow 0.2s ease-out;
}

.hover-lift:hover {
  transform: translateY(-4px);
}
</style>

