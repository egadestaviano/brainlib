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
      <NuxtLink v-for="classList in LmsClassStore.clases" :key="classList.id" :to="'/classes/' + classList.id">
        <UCard>
          <template #header>
            <h1 class="text-2xl font-bold">{{ classList.title }}</h1>
            <h4 class="text-sm text-gray-500">{{ classList.description }}</h4>
          </template>

          <div class="flex items-center gap-3 py-3">
            <div
              class="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 text-white flex items-center justify-center font-medium">
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
            <span>{{ classList.member_count }} Student</span>
          </template>
        </UCard>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const LmsClassStore = useLmsClassStore()
</script>
