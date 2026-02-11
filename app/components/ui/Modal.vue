<template>
    <UModal v-model="isOpen" title="Modal with description" description="Lorem ipsum dolor sit amet, consectetur adipiscing elit.">
        <template #body>
            <div class="h-48 flex items-center justify-center bg-gray-50 rounded-lg">
                <p class="text-gray-500">Modal content goes here</p>
            </div>
        </template>
    </UModal>
</template>

<script setup lang="ts">
const isOpen = ref(false)

// Expose methods to parent components
defineExpose({
  open: () => {
    isOpen.value = true
  },
  close: () => {
    isOpen.value = false
  }
})
</script>
