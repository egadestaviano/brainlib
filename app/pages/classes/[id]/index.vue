<template>
  <div
    class="flex items-center gap-2 mb-4 bg-white px-4 py-2 rounded-lg border border-gray-200"
  >
    <h1 v-if="lmsClassStore.classDetail" class="text-base font-bold">
      {{ lmsClassStore.classDetail.title }} &gt;
      {{ lmsClassStore.classDetail.creator.profile?.display_name }}
    </h1>
  </div>

  <div class="w-full bg-white rounded-md border border-gray-200 py-2 px-4 mb-4">
    <ul class="grid grid-cols-2">
      <li>
        <span
          >Teacher:
          <b>{{
            lmsClassStore.classDetail?.creator.profile?.display_name
          }}</b></span
        >
      </li>
      <li>
        <span
          >Student Total:
          <b>{{ lmsClassStore.classDetail?.memberships?.length || 0 }}</b></span
        >
      </li>
      <li>
        <span
          >Code Class: <b>{{ lmsClassStore.classDetail?.code }}</b></span
        >
      </li>
      <li>
        <span
          >Lesson Total:
          <b>{{ lmsClassStore.classDetail?.lessons.length || 0 }}</b></span
        >
      </li>
    </ul>
  </div>

  <UTabs :items="tabs">
    <template #lessons>
      <ClassComTabLessons :class-id="classId" />
    </template>

    <template #students>
      <ClassComTabStudents :class-id="classId" />
    </template>
  </UTabs>
</template>

<script setup lang="ts">
const route = useRoute();
const lmsClassStore = useLmsClassStore();
const classId = Number(route.params.id) || 1;

const tabs = [
  { label: "Lessons", slot: "lessons" },
  { label: "Students", slot: "students" },
];

onMounted(async () => {
  await lmsClassStore.getDetailsClass(classId);
});
</script>
