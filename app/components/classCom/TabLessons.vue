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
            <p v-if="isAllowed" class="text-sm">Click the “Add Lesson” button to start creating a lesson.</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useLmsClassStore } from "~/stores/lmsclass"
import { useAuthStore } from "~/stores/auth"

const props = defineProps<{ classId: number }>()
const lmsClassStore = useLmsClassStore()
const authStore = useAuthStore()

const lessons = computed(() => lmsClassStore.classDetail?.lessons || [])

const isAllowed = computed(() => {
  if (!authStore.user) return false;
  
  // 1. Global Admin always allowed
  if (authStore.user.roles?.includes("admin")) return true;

  // 2. Global Student always restricted (even if they are class creator)
  if (authStore.user.roles?.includes("student")) return false;

  if (!lmsClassStore.classDetail) return false;

  // 3. Class creator allowed (if not a student)
  if (lmsClassStore.classDetail.creator.id === authStore.user.id) return true;

  // 4. Check membership role in this class
  const myMembership = lmsClassStore.classDetail.memberships?.find(
    (m: any) => m.user.id === authStore.user?.id
  );
  return myMembership?.role === "teacher" || myMembership?.role === "admin";
});
</script>