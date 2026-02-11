<template>
    <div>
        <div v-if="subscriptionStore.loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <USkeleton v-for="n in 3" :key="n" class="h-48 rounded-xl" />
        </div>

        <div v-else-if="!subscriptionStore.getPlans || subscriptionStore.getPlans.length === 0"
            class="text-center py-10 text-gray-500">
            No plans available
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <UCard v-for="plan in subscriptionStore.getPlans" :key="plan.id"
                class="transition-all duration-200 hover:shadow-lg" 
                :class="{
                    'border-2 border-indigo-500': isActive(plan.id)
                }">
                <template #header>
                    <div class="flex justify-between items-center">
                        <h2 class="text-xl font-bold">{{ plan.name }}</h2>
                        <span v-if="isActive(plan.id)"
                            class="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full">
                            Active
                        </span>
                    </div>
                    <p class="text-sm text-gray-500 mt-1">{{ plan.description }}</p>
                </template>

                <div class="py-4">
                    <p class="text-2xl font-bold text-indigo-600">
                        Rp {{ plan.price.toLocaleString() }}
                    </p>
                </div>

                <template #footer>
                    <UButton :disabled="isActive(plan.id) || subscriptionStore.loading"
                        :loading="subscriptionStore.loading" @click="subscribe(plan.id)" block>
                        {{ isActive(plan.id) ? "Subscribed" : "Subscribe" }}
                    </UButton>
                </template>
            </UCard>
        </div>
    </div>
</template>

<script setup lang="ts">
const subscriptionStore = useSubscriptionStore()

onMounted(async () => {
    await subscriptionStore.fetchPlans()
    await subscriptionStore.fetchCurrentSubscription()
})

const isActive = (planId: number) => {
    return subscriptionStore.getSubscription?.plan_id === planId
}

const subscribe = async (planId: number) => {
    try {
        await subscriptionStore.subscribeTo(planId)
        useToast().add({
            title: 'Success',
            description: 'Plan successfully activated!',
            color: 'success'
        })
    } catch (error) {
        useToast().add({
            title: 'Failed',
            description: 'Failed to subscribe plan',
            color: 'error'
        })
    }
}
</script>
