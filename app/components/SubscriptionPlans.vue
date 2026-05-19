<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div class="flex items-center gap-4">
        <div class="hidden sm:flex w-12 h-12 rounded-2xl bg-blue-50 items-center justify-center ring-1 ring-blue-100">
          <UIcon name="heroicons-credit-card" class="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <span class="inline-block text-[11px] font-semibold tracking-widest uppercase text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full mb-1">
            Subscription
          </span>
          <h1 class="text-3xl font-bold tracking-tight text-slate-900">Choose Your Plan</h1>
          <p class="text-sm text-slate-500 mt-1 max-w-xl">
            Select the plan that fits your needs and start building your learning platform today.
          </p>
        </div>
      </div>

      <!-- Billing Toggle -->
      <div class="inline-flex items-center gap-1 p-1 rounded-xl bg-white border border-slate-200 shadow-sm self-start sm:self-auto">
        <button
          type="button"
          @click="billingCycle = 'monthly'"
          :class="[
            'px-4 py-1.5 rounded-lg text-sm font-medium transition',
            billingCycle === 'monthly' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
          ]"
        >
          Monthly
        </button>
        <button
          type="button"
          @click="billingCycle = 'yearly'"
          :class="[
            'inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium transition',
            billingCycle === 'yearly' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
          ]"
        >
          Yearly
          <span :class="[
            'text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider',
            billingCycle === 'yearly' ? 'bg-blue-400 text-blue-950' : 'bg-blue-100 text-blue-700'
          ]">
            -10%
          </span>
        </button>
      </div>
    </div>


    <!-- Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-5" :key="subscriptionStore.getSubscription?.id || 'none'">
      <!-- Starter -->
      <div :class="[
        'relative bg-white rounded-2xl border p-6 flex flex-col transition shadow-sm hover:shadow-md',
        isActive('starter') ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-200 hover:border-slate-300'
      ]">
        <div v-if="isActive('starter')" class="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-blue-500 text-white text-[10px] font-bold uppercase tracking-widest shadow-sm">
          Current Plan
        </div>

        <div class="mb-5">
          <div class="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center ring-1 ring-slate-200 mb-4">
            <UIcon name="heroicons-star" class="h-6 w-6 text-slate-600" />
          </div>
          <h3 class="text-lg font-bold text-slate-900">Starter</h3>
          <p class="text-sm text-slate-500 mt-0.5">Perfect for individual educators getting started</p>
        </div>

        <div class="flex items-baseline gap-1 pb-5 border-b border-slate-100">
          <span class="text-base font-semibold text-slate-700">$</span>
          <span class="text-4xl font-bold tracking-tight text-slate-900">{{ getPlanPrice('starter') }}</span>
          <span class="text-sm text-slate-400 ml-0.5">/{{ billingCycle === 'monthly' ? 'mo' : 'yr' }}</span>
        </div>

        <ul class="space-y-3 mt-5 mb-6 flex-1">
          <li v-for="f in starterFeatures" :key="f" class="flex items-start gap-2.5 text-sm text-slate-600">
            <span class="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
              <UIcon name="heroicons-check" class="h-3 w-3 text-slate-600" />
            </span>
            {{ f }}
          </li>
        </ul>

        <div class="mt-auto">
          <button v-if="isActive('starter')" disabled class="w-full px-4 py-2.5 rounded-lg bg-slate-100 text-slate-400 text-sm font-medium cursor-not-allowed">
            Current Plan Active
          </button>
          <button v-else-if="isHigherThan('starter')" disabled class="w-full px-4 py-2.5 rounded-lg bg-slate-100 text-slate-400 text-sm font-medium cursor-not-allowed">
            Lower Plan Locked
          </button>
          <button v-else @click="selectFree('starter')" class="w-full px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium transition cursor-pointer">
            Get Started
          </button>
        </div>
      </div>

      <!-- Medium (Featured) -->
      <div :class="[
        'relative bg-gradient-to-b from-blue-50/60 to-white rounded-2xl border-2 p-6 flex flex-col transition shadow-md hover:shadow-lg',
        isActive('medium') ? 'border-blue-500 ring-2 ring-blue-500/30' : 'border-blue-400'
      ]">
        <div class="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-blue-500 text-white text-[10px] font-bold uppercase tracking-widest shadow-sm">
          {{ isActive('medium') ? 'Current Plan' : 'Most Popular' }}
        </div>

        <div class="mb-5">
          <div class="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center ring-1 ring-blue-200 mb-4">
            <UIcon name="heroicons-rocket-launch" class="h-6 w-6 text-blue-700" />
          </div>
          <h3 class="text-lg font-bold text-slate-900">Medium</h3>
          <p class="text-sm text-slate-500 mt-0.5">For growing teams and institutions</p>
        </div>

        <div class="flex items-baseline gap-1 pb-5 border-b border-blue-200/60">
          <span class="text-base font-semibold text-slate-700">$</span>
          <span class="text-4xl font-bold tracking-tight text-slate-900">{{ getPlanPrice('medium') }}</span>
          <span class="text-sm text-slate-400 ml-0.5">/{{ billingCycle === 'monthly' ? 'mo' : 'yr' }}</span>
        </div>

        <ul class="space-y-3 mt-5 mb-6 flex-1">
          <li v-for="f in mediumFeatures" :key="f" class="flex items-start gap-2.5 text-sm text-slate-700">
            <span class="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
              <UIcon name="heroicons-check" class="h-3 w-3 text-blue-700" />
            </span>
            {{ f }}
          </li>
        </ul>

        <div class="mt-auto">
          <button v-if="isActive('medium')" disabled class="w-full px-4 py-2.5 rounded-lg bg-blue-100 text-blue-700 text-sm font-semibold cursor-not-allowed">
            Current Plan Active
          </button>
          <button v-else-if="isHigherThan('medium')" disabled class="w-full px-4 py-2.5 rounded-lg bg-slate-100 text-slate-400 text-sm font-medium cursor-not-allowed">
            Lower Plan Locked
          </button>
          <button
            v-else
            @click="handleStripeCheckout('medium')"
            :disabled="stripeLoading === 'medium'"
            class="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium transition cursor-pointer disabled:opacity-60 disabled:cursor-wait"
          >
            <span v-if="stripeLoading === 'medium'" class="w-4 h-4 border-2 border-blue-300 border-t-white rounded-full animate-spin" />
            {{ stripeLoading === 'medium' ? 'Redirecting...' : 'Subscribe Now' }}
          </button>
        </div>
      </div>

      <!-- Enterprise -->
      <div :class="[
        'relative bg-white rounded-2xl border p-6 flex flex-col transition shadow-sm hover:shadow-md',
        isActive('enterprise') ? 'border-violet-500 ring-2 ring-violet-500/20' : 'border-slate-200 hover:border-slate-300'
      ]">
        <div v-if="isActive('enterprise')" class="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-violet-500 text-white text-[10px] font-bold uppercase tracking-widest shadow-sm">
          Current Plan
        </div>

        <div class="mb-5">
          <div class="w-12 h-12 rounded-xl bg-violet-50 flex items-center justify-center ring-1 ring-violet-100 mb-4">
            <UIcon name="heroicons-cube-transparent" class="h-6 w-6 text-violet-600" />
          </div>
          <h3 class="text-lg font-bold text-slate-900">Enterprise</h3>
          <p class="text-sm text-slate-500 mt-0.5">Unlimited power for large organizations</p>
        </div>

        <div class="flex items-baseline gap-1 pb-5 border-b border-slate-100">
          <span class="text-base font-semibold text-slate-700">$</span>
          <span class="text-4xl font-bold tracking-tight text-slate-900">{{ getPlanPrice('enterprise') }}</span>
          <span class="text-sm text-slate-400 ml-0.5">/{{ billingCycle === 'monthly' ? 'mo' : 'yr' }}</span>
        </div>

        <ul class="space-y-3 mt-5 mb-6 flex-1">
          <li v-for="f in enterpriseFeatures" :key="f" class="flex items-start gap-2.5 text-sm text-slate-700">
            <span class="w-5 h-5 rounded-full bg-violet-50 flex items-center justify-center shrink-0 mt-0.5">
              <UIcon name="heroicons-check" class="h-3 w-3 text-violet-600" />
            </span>
            {{ f }}
          </li>
        </ul>

        <div class="mt-auto">
          <button v-if="isActive('enterprise')" disabled class="w-full px-4 py-2.5 rounded-lg bg-violet-100 text-violet-700 text-sm font-semibold cursor-not-allowed">
            Current Plan Active
          </button>
          <button v-else-if="isHigherThan('enterprise')" disabled class="w-full px-4 py-2.5 rounded-lg bg-slate-100 text-slate-400 text-sm font-medium cursor-not-allowed">
            Lower Plan Locked
          </button>
          <button
            v-else
            @click="handleStripeCheckout('enterprise')"
            :disabled="stripeLoading === 'enterprise'"
            class="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-violet-500 hover:bg-violet-600 text-white text-sm font-medium transition cursor-pointer disabled:opacity-60 disabled:cursor-wait"
          >
            <span v-if="stripeLoading === 'enterprise'" class="w-4 h-4 border-2 border-violet-300 border-t-white rounded-full animate-spin" />
            {{ stripeLoading === 'enterprise' ? 'Redirecting...' : 'Subscribe Now' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSubscriptionStore } from '~/stores/subscription'
import { api } from '~/utils/api'

const subscriptionStore = useSubscriptionStore()
const config = useRuntimeConfig()
const toast = useToast()

const billingCycle = ref<'monthly' | 'yearly'>('monthly')
const stripeLoading = ref<string | null>(null)

const starterFeatures = [
  '1 Class creation',
  'Max 10 Students per class',
  'Max 5 Lessons per class',
]
const mediumFeatures = [
  'Up to 10 Classes creation',
  'Max 50 Students per class',
  'Max 20 Lessons per class',
]
const enterpriseFeatures = [
  'Unlimited Classes creation',
  'Unlimited Students',
  'Unlimited Lessons per class',
]

const planIdMap = computed(() => {
  if (billingCycle.value === 'monthly') {
    return { starter: 1, medium: 2, enterprise: 3 }
  }
  return { starter: 4, medium: 5, enterprise: 6 }
})

const isActive = (planSlug: string) => {
  const planId = (planIdMap.value as any)[planSlug]
  const currentPlanId = subscriptionStore.getSubscription?.plan_id
  return currentPlanId === planId
}

const getPlanPrice = (planSlug: string) => {
  const planId = (planIdMap.value as any)[planSlug]
  if (!planId) return '0'
  const plan = subscriptionStore.getPlans.find((p) => p.id === planId)
  if (!plan) return '0'
  return Number(plan.price).toLocaleString()
}

const selectFree = async (planSlug: string) => {
  try {
    const planId = (planIdMap.value as any)[planSlug]
    if (!planId) return
    await subscriptionStore.subscribeTo(planId)
    toast.add({
      title: 'Success',
      description: 'Starter plan activated!',
      color: 'success',
    })
  } catch (e) {
    toast.add({
      title: 'Error',
      description: 'Failed to activate plan.',
      color: 'error',
    })
  }
}

const handleStripeCheckout = async (planSlug: string) => {
  const planId = (planIdMap.value as any)[planSlug]
  if (!planId) return

  stripeLoading.value = planSlug

  try {
    const result = await api.post<any>('/subscriptions', {
      plan_id: planId,
      gateway: 'stripe',
    })

    // Backend returns a Stripe Checkout session URL
    if (result.checkout_url) {
      window.location.href = result.checkout_url
      return
    }

    // Fallback: if backend returns session_id, use Stripe.js to redirect
    if (result.session_id) {
      const stripeKey = config.public.stripePublishableKey
      if (!stripeKey) throw new Error('Stripe key not configured')

      const stripe = (window as any).Stripe?.(stripeKey)
      if (!stripe) {
        // Load Stripe.js on-the-fly if not already loaded
        await loadStripeScript()
        const stripeInstance = (window as any).Stripe(stripeKey)
        await stripeInstance.redirectToCheckout({ sessionId: result.session_id })
      } else {
        await stripe.redirectToCheckout({ sessionId: result.session_id })
      }
      return
    }

    throw new Error('Could not create checkout session')
  } catch (e: any) {
    console.error('Stripe Checkout Error:', e)
    toast.add({
      title: 'Payment Error',
      description: e?.data?.message || 'Could not initialize payment. Please try again.',
      color: 'error',
    })
  } finally {
    stripeLoading.value = null
  }
}

const loadStripeScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if ((window as any).Stripe) {
      resolve()
      return
    }
    const script = document.createElement('script')
    script.src = 'https://js.stripe.com/v3/'
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Stripe.js'))
    document.head.appendChild(script)
  })
}

const isHigherThan = (planSlug: string) => {
  const currentId = subscriptionStore.getSubscription?.plan_id || 0

  const expiresAt = subscriptionStore.getSubscription?.expires_at
  const isExpired = expiresAt ? new Date(expiresAt) < new Date() : true

  if (isExpired) return false

  const isCurrentYearly = YEARLY_PLAN_IDS.includes(currentId)

  // Jika user punya yearly, semua plan monthly di-lock (tidak bisa downgrade)
  if (isCurrentYearly && billingCycle.value === 'monthly') {
    return true
  }

  // Jika user punya monthly, semua plan yearly bisa diakses (upgrade)
  // Bandingkan berdasarkan tier, bukan ID mentah
  const currentTier = PLAN_TIER_MAP[currentId] || 0
  const targetTier = SLUG_TIER_MAP[planSlug] || 0

  return currentTier > targetTier
}

// Yearly plan IDs: 4 (starter), 5 (medium), 6 (enterprise)
const YEARLY_PLAN_IDS = [4, 5, 6]

// Mapping plan ID → tier level (1=starter, 2=medium, 3=enterprise)
const PLAN_TIER_MAP: Record<number, number> = {
  1: 1, 2: 2, 3: 3,  // monthly
  4: 1, 5: 2, 6: 3,  // yearly
}

// Tier mapping by slug
const SLUG_TIER_MAP: Record<string, number> = {
  starter: 1, medium: 2, enterprise: 3,
}

onMounted(async () => {
  try {
    await subscriptionStore.fetchPlans()
    await subscriptionStore.fetchCurrentSubscription()

    // Auto-detect billing cycle from current active subscription
    const currentPlanId = subscriptionStore.getSubscription?.plan_id
    if (currentPlanId && YEARLY_PLAN_IDS.includes(currentPlanId)) {
      billingCycle.value = 'yearly'
    }
  } catch (err) {
    console.error('Failed to fetch initial subscription data:', err)
  }
})
</script>
