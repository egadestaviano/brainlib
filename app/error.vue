<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center text-center">
    <h1 class="text-4xl font-bold text-red-500">
      {{ props.error.statusCode }}
    </h1>
    <p class="mt-2 text-lg text-gray-600">
      {{ props.error.message }}
    </p>
    <NuxtLink
      to="/"
      class="mt-4 inline-block rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
    >
      Go back home
    </NuxtLink>
  </div>
</template>
