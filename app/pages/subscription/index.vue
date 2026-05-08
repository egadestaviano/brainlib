<template>
  <div class="space-y-6">
    <UAlert
      v-if="successMessage"
      color="primary"
      variant="soft"
      :title="successMessage"
      icon="heroicons-check-circle"
      :close-button="{ onClick: () => successMessage = '' }"
    />

    <SubscriptionPlans />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const successMessage = ref('')

onMounted(async () => {
  const status = route.query.status
  const subId = route.query.sub_id

  if (status === 'success' && subId) {
    successMessage.value = `Great news! Your subscription has been activated successfully.`
    router.replace({ path: route.path, query: {} })
  }
})
</script>
