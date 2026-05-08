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

    <!-- AI Usage info -->
    <div v-if="subscriptionStore.getSubscription" class="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
      <div class="flex items-center justify-between gap-4 mb-3">
        <div class="flex items-center gap-2.5">
          <div class="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center ring-1 ring-violet-100 shrink-0">
            <UIcon name="heroicons-sparkles" class="h-4 w-4 text-violet-600" />
          </div>
          <div>
            <p class="text-sm font-semibold text-slate-900">AI Generation Usage</p>
            <p class="text-xs text-slate-500">Resets monthly with your subscription</p>
          </div>
        </div>
        <p class="text-sm font-semibold tabular-nums text-slate-700 whitespace-nowrap">
          <span class="text-blue-600">{{ subscriptionStore.getSubscription.ai_usage }}</span>
          <span class="text-slate-400 mx-1">/</span>
          <span>{{ subscriptionStore.getSubscription.ai_limit === -1 ? '∞' : subscriptionStore.getSubscription.ai_limit }}</span>
        </p>
      </div>
      <div class="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          class="h-full rounded-full transition-all duration-500"
          :style="{
            width: subscriptionStore.getSubscription.ai_limit === -1 ? '100%' : Math.min((subscriptionStore.getSubscription.ai_usage / subscriptionStore.getSubscription.ai_limit) * 100, 100) + '%',
            backgroundColor: (subscriptionStore.getSubscription.ai_limit !== -1 && subscriptionStore.getSubscription.ai_usage >= subscriptionStore.getSubscription.ai_limit) ? '#ef4444' : '#3b82f6'
          }"
        />
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
          <div v-else id="paypal-button-medium" class="w-full min-h-[45px]">
            <button v-if="!paypalLoaded" disabled class="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-blue-500/20 text-blue-700 text-sm font-medium cursor-wait">
              <span class="w-4 h-4 border-2 border-blue-300 border-t-blue-700 rounded-full animate-spin" />
              Loading PayPal...
            </button>
          </div>
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
          <div v-else id="paypal-button-enterprise" class="w-full min-h-[45px]">
            <button v-if="!paypalLoaded" disabled class="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-violet-100 text-violet-700 text-sm font-medium cursor-wait">
              <span class="w-4 h-4 border-2 border-violet-200 border-t-violet-700 rounded-full animate-spin" />
              Loading PayPal...
            </button>
          </div>
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
const paypalLoaded = ref(false)
const toast = useToast()

const billingCycle = ref<'monthly' | 'yearly'>('monthly')
const pendingSubIds = ref<Record<string, number>>({})

const starterFeatures = [
  '1 Class creation',
  'Max 10 Students per class',
  'Max 5 Lessons per class',
  '5 AI Generate usages / month',
]
const mediumFeatures = [
  'Up to 10 Classes creation',
  'Max 50 Students per class',
  'Max 20 Lessons per class',
  '50 AI Generate usages / month',
]
const enterpriseFeatures = [
  'Unlimited Classes creation',
  'Unlimited Students',
  'Unlimited Lessons per class',
  'Unlimited AI Generate',
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

const loadPayPalScript = () => {
  return new Promise((resolve, reject) => {
    if ((window as any).paypal) {
      paypalLoaded.value = true
      resolve((window as any).paypal)
      return
    }

    const script = document.createElement('script')
    const clientId = config.public.paypalClientId || 'test'
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD&intent=capture`
    script.onload = () => {
      paypalLoaded.value = true
      resolve((window as any).paypal)
    }
    script.onerror = () => {
      toast.add({
        title: 'Error',
        description: 'Failed to load PayPal SDK',
        color: 'error',
      })
      reject(new Error('PayPal SDK failed to load'))
    }
    document.head.appendChild(script)
  })
}

const renderPayPalButton = (containerId: string, planSlug: string) => {
  const container = document.getElementById(containerId)
  if (!container || container.querySelector('.paypal-buttons')) return

  const planId = (planIdMap.value as any)[planSlug]
  if (!planId) return

  ;(window as any).paypal.Buttons({
    style: {
      layout: 'vertical',
      color: 'gold',
      shape: 'rect',
      label: 'pay',
      height: 45,
    },
    createOrder: async () => {
      try {
        const result = await api.post<any>('/subscriptions', {
          plan_id: planId,
          gateway: 'paypal',
        })

        if (result.checkout_url) {
          const url = new URL(result.checkout_url)
          const token = url.searchParams.get('token')

          const subIdMatch = result.redirect_path?.match(/sub_id=(\d+)/)
          if (subIdMatch) {
            pendingSubIds.value[planSlug] = parseInt(subIdMatch[1])
          }

          return token
        }

        throw new Error('Could not create order')
      } catch (e) {
        console.error('Create Order Error:', e)
        toast.add({
          title: 'Order Failed',
          description: 'Could not initialize payment. Please try again.',
          color: 'error',
        })
        throw e
      }
    },
    onApprove: async (data: any) => {
      try {
        const subId = pendingSubIds.value[planSlug]
        if (!subId) throw new Error('Missing subscription ID')

        await api.post('/subscriptions/paypal-capture', {
          order_id: data.orderID,
          sub_id: subId,
        })

        toast.add({
          title: 'Welcome Aboard!',
          description: 'Your subscription has been activated successfully.',
          color: 'success',
        })

        await subscriptionStore.fetchCurrentSubscription()
      } catch (e) {
        console.error('Capture Error:', e)
        toast.add({
          title: 'Payment Error',
          description: 'Payment was completed but activation failed. Contact support.',
          color: 'error',
        })
      }
    },
    onCancel: () => {
      toast.add({
        title: 'Cancelled',
        description: 'Payment process was cancelled.',
        color: 'neutral',
      })
    },
    onError: (err: any) => {
      console.error('PayPal Button Error:', err)
      toast.add({
        title: 'PayPal Error',
        description: 'Something went wrong with the PayPal button.',
        color: 'error',
      })
    },
  }).render(`#${containerId}`)
}

const isHigherThan = (planSlug: string) => {
  const targetId = (planIdMap.value as any)[planSlug]
  const currentId = subscriptionStore.getSubscription?.plan_id || 0

  const expiresAt = subscriptionStore.getSubscription?.expires_at
  const isExpired = expiresAt ? new Date(expiresAt) < new Date() : true

  if (isExpired) return false

  return currentId > (targetId || 0)
}

const initPayPalButtons = () => {
  if (!(window as any).paypal) {
    console.warn('PayPal SDK not loaded yet')
    return
  }

  if (!isActive('medium') && !isHigherThan('medium')) {
    renderPayPalButton('paypal-button-medium', 'medium')
  }
  if (!isActive('enterprise') && !isHigherThan('enterprise')) {
    renderPayPalButton('paypal-button-enterprise', 'enterprise')
  }
}

onMounted(async () => {
  try {
    await subscriptionStore.fetchPlans()
    await subscriptionStore.fetchCurrentSubscription()
  } catch (err) {
    console.error('Failed to fetch initial subscription data:', err)
  }

  try {
    await loadPayPalScript()
    setTimeout(() => {
      initPayPalButtons()
    }, 1000)
  } catch (e) {
    console.error('PayPal script load error:', e)
  }
})

watch(
  () => subscriptionStore.getSubscription?.id,
  async () => {
    if (paypalLoaded.value) {
      await nextTick()
      setTimeout(initPayPalButtons, 100)
    }
  }
)
</script>
