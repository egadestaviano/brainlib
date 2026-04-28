<template>
  <div>
    <!-- Skeleton -->
    <div v-if="subscriptionStore.loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <div v-for="n in 3" :key="n" class="bg-white rounded-xl border border-slate-200 p-6 space-y-4 animate-pulse">
        <div class="space-y-2">
          <USkeleton class="h-6 w-1/2 rounded" />
          <USkeleton class="h-4 w-3/4 rounded" />
        </div>
        <USkeleton class="h-10 w-2/3 rounded" />
        <USkeleton class="h-10 w-full rounded-lg" />
      </div>
    </div>

    <!-- Empty -->
    <div v-else-if="!subscriptionStore.getPlans || subscriptionStore.getPlans.length === 0"
      class="flex flex-col items-center justify-center py-16">
      <div class="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
        <UIcon name="heroicons-credit-card" class="h-6 w-6 text-slate-400" />
      </div>
      <p class="text-slate-500">No plans available</p>
    </div>

    <!-- Plans -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <div
        v-for="plan in subscriptionStore.getPlans"
        :key="plan.id"
        :class="[
          'bg-white rounded-xl border p-6 transition-all duration-200',
          isActive(plan.id)
            ? 'border-emerald-300 bg-emerald-50'
            : 'border-slate-200 hover:shadow-md hover:border-slate-300'
        ]"
      >
        <div class="mb-4">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-bold text-slate-900">{{ plan.name }}</h2>
            <span
              v-if="isActive(plan.id)"
              class="bg-emerald-100 text-emerald-700 text-xs font-medium px-2.5 py-1 rounded-full"
            >
              Active
            </span>
          </div>
          <p class="text-sm text-slate-500 mt-1">{{ plan.description }}</p>
        </div>

        <div class="mb-6">
          <span class="text-3xl font-bold text-slate-900">Rp {{ plan.price.toLocaleString() }}</span>
        </div>

        <UButton
          :disabled="isActive(plan.id) || subscriptionStore.loading"
          :loading="subscriptionStore.loading"
          @click="subscribe(plan.id)"
          block
          :color="isActive(plan.id) ? 'neutral' : 'primary'"
          :variant="isActive(plan.id) ? 'outline' : 'solid'"
          class="rounded-lg"
        >
          {{ isActive(plan.id) ? 'Current Plan' : 'Subscribe' }}
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSubscriptionStore } from '~/stores/subscription'

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
  } catch {
    useToast().add({
      title: 'Failed',
      description: 'Failed to subscribe plan',
      color: 'error'
    })
  }
}
</script>
