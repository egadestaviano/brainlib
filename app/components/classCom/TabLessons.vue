<template>
    <div>
        <div class="flex flex-row mt-4">
            <!-- Dialog (internal) -->
            <ClassComLessonDialog :class-id="classId" />
        </div>

        <!-- lessons list -->
        <ul v-if="lessons && lessons.length > 0"
            class="bg-white rounded-md border border-gray-200 p-4 mt-2 flex flex-col gap-3">
            <li v-for="i in lessons" :key="i.id" class="flex flex-col border border-gray-300 p-5 rounded-md">
                <NuxtLink :to="'/classes/' + classId + '/lessons/' + i.id">
                    <div class="flex flex-row items-center">
                        <UIcon name="heroicons-book-open" class="text-lg font-bold mr-3" />
                        <h2 class="text-lg font-black">{{ i.title }}</h2>
                    </div>
                    <div class="flex flex-row">
                        <span class="text-sm">Summary: {{ i.summary }}</span>
                    </div>
                </NuxtLink>
            </li>
        </ul>

        <div v-else class="bg-white rounded-md border border-gray-200 p-4 mt-2 text-center text-gray-500">
            <UIcon name="heroicons-information-circle" class="text-2xl mx-auto mb-2 text-gray-400" />
            <p class="font-medium">No lessons are available yet.</p>
            <p class="text-sm">Click the “Add Lesson” button to start creating a lesson.</p>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{ classId: number }>()
const lmsClassStore = useLmsClassStore()

const lessons = computed(() => lmsClassStore.classDetail?.lessons || [])
</script>