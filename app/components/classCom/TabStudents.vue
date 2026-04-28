<template>
  <div>
    <div v-if="members && members.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
      <div
        v-for="member in members"
        :key="member.id"
        class="flex items-center gap-3 bg-white rounded-xl border border-slate-200 p-4"
      >
        <div class="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-semibold shrink-0">
          {{ member.user.profile?.display_name?.[0]?.toUpperCase() || 'U' }}
        </div>
        <div class="min-w-0">
          <p class="font-medium text-slate-900 truncate">{{ member.user.profile?.display_name }}</p>
          <p class="text-xs text-slate-500 truncate">{{ member.user.email }}</p>
        </div>
      </div>
    </div>

    <div v-else class="bg-white rounded-xl border border-slate-200 p-8 mt-3 text-center">
      <div class="flex justify-center mb-3">
        <div class="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
          <UIcon name="heroicons-users" class="h-6 w-6 text-slate-400" />
        </div>
      </div>
      <p class="font-medium text-slate-700">No members have joined yet</p>
      <p class="text-sm text-slate-500 mt-1">Share the class code to invite students.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLmsClassStore } from "~/stores/lmsclass"
const props = defineProps<{ classId?: number }>()
const lmsClassStore = useLmsClassStore()
const members = computed(() => lmsClassStore.classDetail?.memberships || [])
</script>
