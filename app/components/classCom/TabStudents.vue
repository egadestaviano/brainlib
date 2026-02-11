<template>
    <div>
        <ul v-if="members && members.length > 0"
            class="grid grid-cols-3 gap-5 bg-white rounded-md border border-gray-200 p-4 mt-2">
            <li v-for="member in members" :key="member.id" class="flex flex-row items-center gap-3">
                <div
                    class="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 text-white flex items-center justify-center font-medium">
                    A</div>
                <div class="flex flex-col">
                    <b>{{ member.user.profile?.display_name }}</b>
                    <span class="text-xs">{{ member.user.email }}</span>
                </div>
            </li>
        </ul>
        <div v-else class="bg-white rounded-md border border-gray-200 p-4 mt-2 text-center text-gray-500">
            <UIcon name="heroicons-information-circle" class="text-2xl mx-auto mb-2 text-gray-400" />
            <p class="font-medium">No members have joined yet.</p>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{ classId?: number }>()
const lmsClassStore = useLmsClassStore()
const members = computed(() => lmsClassStore.classDetail?.memberships || [])
</script>