<template>
  <TooltipProvider>
    <div class="min-h-screen flex bg-slate-50 text-slate-900">
      <PartialSidebar />
      <div class="flex-1 flex flex-col">
        <PartialHeader />
        <main class="p-6 overflow-y-auto" style="height: calc(100vh - 64px);">
          <slot />
        </main>
      </div>
    </div>
  </TooltipProvider>
</template>

<script setup lang="ts">
import {  TooltipProvider } from 'reka-ui'
</script>
