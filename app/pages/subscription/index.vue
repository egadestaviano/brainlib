<template>
  <div class="max-w-4xl mx-auto py-8">
    <UAlert
      v-if="successMessage"
      color="success"
      :title="successMessage"
      class="mb-6"
      :close-button="{ onClick: () => successMessage = '' }"
    />

    <SubscriptionPlans />
  </div>
</template>

<script setup lang="ts">
import { useSubscriptionStore } from '~/stores/subscription'

const subscriptionStore = useSubscriptionStore()
const route = useRoute()
const router = useRouter()
const successMessage = ref('')

onMounted(async () => {
  await subscriptionStore.fetchPlans()
  await subscriptionStore.fetchCurrentSubscription()

  const status = route.query.status
  const subId = route.query.sub_id

  if (status === 'success' && subId) {
    successMessage.value = `Subscription #${subId} activated successfully!`
    router.replace({ path: route.path, query: {} })
  }
})
</script>
