<template>
    <div class="container mx-auto py-8">
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold">Subscription Plans</h1>
            <UButton @click="refresh" :loading="subscriptionStore.loading">
                Refresh
            </UButton>
        </div>

        <div v-if="successMessage" class="mb-4 p-4 bg-green-100 text-green-800 rounded">
            {{ successMessage }}
        </div>

        <SubscriptionPlans />
    </div>
</template>

<script setup lang="ts">
const subscriptionStore = useSubscriptionStore()
const route = useRoute()
const router = useRouter()
const successMessage = ref('')

const refresh = async () => {
    await subscriptionStore.fetchPlans()
    await subscriptionStore.fetchCurrentSubscription()
}

onMounted(async () => {
    await refresh()

    const status = route.query.status
    const subId = route.query.sub_id

    if (status === 'success' && subId) {
        successMessage.value = `Subscription #${subId} activated successfully!`

        router.replace({ path: route.path, query: {} })
    }
})
</script>
