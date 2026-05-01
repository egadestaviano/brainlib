<template>
  <div class="subscription-section">
    <div class="subscription-container">
      <!-- Header -->
      <div class="subscription-header">
        <span class="subscription-label">SUBSCRIPTION</span>
        <h2 class="subscription-title">Choose Your Plan</h2>
        <p class="subscription-subtitle">
          Select the plan that fits your needs and start building your learning platform today.
        </p>
        
        <!-- Billing Toggle -->
        <div class="billing-toggle">
          <span :class="{ 'active': billingCycle === 'monthly' }">Monthly</span>
          <div class="toggle-container" @click="billingCycle = billingCycle === 'monthly' ? 'yearly' : 'monthly'">
            <div class="toggle-knob" :class="{ 'yearly': billingCycle === 'yearly' }"></div>
          </div>
          <span :class="{ 'active': billingCycle === 'yearly' }">
            Yearly
            <span class="discount-badge">Save 10%</span>
          </span>
        </div>
        <div v-if="subscriptionStore.getSubscription" class="ai-usage-info mt-4">
          <p class="text-sm font-medium text-slate-600">
            Current AI Usage: 
            <span class="text-blue-600 font-bold">
              {{ subscriptionStore.getSubscription.ai_usage ?? 0 }}
            </span>
            / 
            <span class="text-slate-900 font-bold">
              {{ subscriptionStore.getSubscription.ai_limit === -1 ? 'Unlimited' : (subscriptionStore.getSubscription.ai_limit ?? 0) }}
            </span>
          </p>
          <div class="usage-bar-container mt-2">
            <div 
              class="usage-bar-fill" 
              :style="{ 
                width: subscriptionStore.getSubscription.ai_limit === -1 ? '100%' : Math.min(((subscriptionStore.getSubscription.ai_usage ?? 0) / (subscriptionStore.getSubscription.ai_limit || 1)) * 100, 100) + '%',
                backgroundColor: (subscriptionStore.getSubscription.ai_limit !== -1 && (subscriptionStore.getSubscription.ai_usage ?? 0) >= (subscriptionStore.getSubscription.ai_limit ?? 0)) ? '#ef4444' : '#2563eb'
              }"
            ></div>
          </div>
        </div>
      </div>


      <!-- Cards Grid -->
      <div class="plans-grid" :key="`${subscriptionStore.getSubscription?.id || 'none'}-${subscriptionStore.getSubscription?.plan_id || '0'}`">
        <!-- Starter -->
        <div class="plan-card" :class="{ 'plan-card--active': isActive('starter') }">
          <div v-if="isActive('starter')" class="plan-badge plan-badge--active">Current Plan</div>
          <div class="plan-card__header">
            <div class="plan-icon plan-icon--starter">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            </div>
            <h3 class="plan-name">Starter</h3>
            <p class="plan-description">Perfect for individual educators getting started</p>
          </div>

          <div class="plan-price">
            <span class="plan-price__currency">$</span>
            <span class="plan-price__amount">{{ getPlanPrice('starter') }}</span>
            <span class="plan-price__period">/{{ billingCycle === 'monthly' ? 'month' : 'year' }}</span>
          </div>

          <ul class="plan-features">
            <li class="plan-feature">
              <span class="plan-feature__icon plan-feature__icon--starter">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </span>
              <span>1 Class creation</span>
            </li>
            <li class="plan-feature">
              <span class="plan-feature__icon plan-feature__icon--starter">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </span>
              <span>Max 10 Students per class</span>
            </li>
            <li class="plan-feature">
              <span class="plan-feature__icon plan-feature__icon--starter">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </span>
              <span>Max 5 Lessons per class</span>
            </li>
            <li class="plan-feature">
              <span class="plan-feature__icon plan-feature__icon--starter">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </span>
              <span>5 AI Generate usages / month</span>
            </li>
          </ul>

          <!-- Action -->
          <div class="plan-action">
            <div v-if="isActive('starter')" class="plan-action__active">
              <button disabled class="btn btn--disabled">Current Plan Active</button>
            </div>
            <div v-else-if="isHigherThan('starter')" class="plan-action__disabled">
              <button disabled class="btn btn--disabled">Lower Plan Locked</button>
            </div>
            <div v-else class="plan-action__free">
              <button class="btn btn--starter" @click="selectFree('starter')">Get Started</button>
            </div>
          </div>
        </div>

        <!-- Medium -->
        <div class="plan-card plan-card--featured" :class="{ 'plan-card--active': isActive('medium') }">
          <div class="plan-badge plan-badge--popular">Most Popular</div>
          <div v-if="isActive('medium')" class="plan-badge plan-badge--active">Current Plan</div>
          <div class="plan-card__header">
            <div class="plan-icon plan-icon--medium">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4.5c1.45-1.47 5-2 5-2"/><path d="M12 15v5s3.03-.55 4.5-2c1.47-1.45 2-5 2-5"/></svg>
            </div>
            <h3 class="plan-name">Medium</h3>
            <p class="plan-description">For growing teams and institutions</p>
          </div>

          <div class="plan-price">
            <span class="plan-price__currency">$</span>
            <span class="plan-price__amount">{{ getPlanPrice('medium') }}</span>
            <span class="plan-price__period">/{{ billingCycle === 'monthly' ? 'month' : 'year' }}</span>
          </div>

          <ul class="plan-features">
            <li class="plan-feature">
              <span class="plan-feature__icon plan-feature__icon--medium">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </span>
              <span>Up to 10 Classes creation</span>
            </li>
            <li class="plan-feature">
              <span class="plan-feature__icon plan-feature__icon--medium">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </span>
              <span>Max 50 Students per class</span>
            </li>
            <li class="plan-feature">
              <span class="plan-feature__icon plan-feature__icon--medium">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </span>
              <span>Max 20 Lessons per class</span>
            </li>
            <li class="plan-feature">
              <span class="plan-feature__icon plan-feature__icon--medium">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </span>
              <span>50 AI Generate usages / month</span>
            </li>
          </ul>

          <!-- PayPal Button -->
          <div class="plan-action">
            <div v-if="isActive('medium')" class="plan-action__active">
              <button disabled class="btn btn--disabled">Current Plan Active</button>
            </div>
            <div v-else-if="isHigherThan('medium')" class="plan-action__disabled">
              <button disabled class="btn btn--disabled">Lower Plan Locked</button>
            </div>
            <div v-else id="paypal-button-medium" class="paypal-container">
              <button v-if="!paypalLoaded" class="btn btn--loading" disabled>
                <span class="btn-spinner"></span>
                Loading PayPal...
              </button>
            </div>
          </div>
        </div>

        <!-- Enterprise -->
        <div class="plan-card" :class="{ 'plan-card--active': isActive('enterprise') }">
          <div v-if="isActive('enterprise')" class="plan-badge plan-badge--active">Current Plan</div>
          <div class="plan-card__header">
            <div class="plan-icon plan-icon--enterprise">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
            </div>
            <h3 class="plan-name">Enterprise</h3>
            <p class="plan-description">Unlimited power for large organizations</p>
          </div>

          <div class="plan-price">
            <span class="plan-price__currency">$</span>
            <span class="plan-price__amount">{{ getPlanPrice('enterprise') }}</span>
            <span class="plan-price__period">/{{ billingCycle === 'monthly' ? 'month' : 'year' }}</span>
          </div>

          <ul class="plan-features">
            <li class="plan-feature">
              <span class="plan-feature__icon plan-feature__icon--enterprise">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </span>
              <span>Unlimited Classes creation</span>
            </li>
            <li class="plan-feature">
              <span class="plan-feature__icon plan-feature__icon--enterprise">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </span>
              <span>Unlimited Students</span>
            </li>
            <li class="plan-feature">
              <span class="plan-feature__icon plan-feature__icon--enterprise">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </span>
              <span>Unlimited Lessons per class</span>
            </li>
            <li class="plan-feature">
              <span class="plan-feature__icon plan-feature__icon--enterprise">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </span>
              <span>Unlimited AI Generate</span>
            </li>
          </ul>

          <!-- PayPal Button -->
          <div class="plan-action">
            <div v-if="isActive('enterprise')" class="plan-action__active">
              <button disabled class="btn btn--disabled">Current Plan Active</button>
            </div>
            <div v-else id="paypal-button-enterprise" class="paypal-container">
              <button v-if="!paypalLoaded" class="btn btn--loading" disabled>
                <span class="btn-spinner"></span>
                Loading PayPal...
              </button>
            </div>
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

// Map plan slug to plan_id from backend
const planIdMap = computed(() => {
  if (billingCycle.value === 'monthly') {
    return {
      starter: 1,
      medium: 2,
      enterprise: 3,
    }
  }
  return {
    starter: 4,
    medium: 5,
    enterprise: 6,
  }
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
  
  // Check if current plan is active and not expired
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

  console.log('Initializing PayPal buttons...')
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
    // Give time for DOM elements to be fully ready
    setTimeout(() => {
      initPayPalButtons()
    }, 1000)
  } catch (e) {
    console.error('PayPal script load error:', e)
  }
})

watch(
  () => [subscriptionStore.getSubscription?.id, subscriptionStore.getSubscription?.plan_id],
  async () => {
    if (paypalLoaded.value) {
      await nextTick()
      setTimeout(initPayPalButtons, 100)
    }
  }
)
</script>

<style scoped>
.subscription-section {
  padding: 3rem 1rem;
}

.subscription-container {
  max-width: 1200px;
  margin: 0 auto;
}

/* Header */
.subscription-header {
  text-align: center;
  margin-bottom: 3.5rem;
}

.subscription-label {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #2563eb;
  background: rgba(37, 99, 235, 0.08);
  padding: 0.35rem 1rem;
  margin-bottom: 1rem;
}

.subscription-title {
  font-size: 2rem;
  font-weight: 600;
  color: #1a1a2e;
  margin: 0.5rem 0;
  line-height: 1.2;
}

.subscription-subtitle {
  font-size: 1.05rem;
  color: #6b7280;
  max-width: 520px;
  margin: 0.75rem auto 1.5rem;
  line-height: 1.6;
}

/* Billing Toggle */
.billing-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.95rem;
  font-weight: 500;
  color: #64748b;
}

.billing-toggle span.active {
  color: #1a1a2e;
}

.toggle-container {
  width: 48px;
  height: 24px;
  background: #e2e8f0;
  border-radius: 12px;
  position: relative;
  cursor: pointer;
  transition: background 0.3s ease;
}

.toggle-knob {
  width: 20px;
  height: 20px;
  background: #ffffff;
  border-radius: 50%;
  position: absolute;
  top: 2px;
  left: 2px;
  transition: transform 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.toggle-knob.yearly {
  transform: translateX(24px);
  background: #2563eb;
}

.discount-badge {
  font-size: 0.7rem;
  background: #eff6ff;
  color: #2563eb;
  padding: 0.15rem 0.5rem;
  border-radius: 99px;
  margin-left: 0.5rem;
  font-weight: 600;
}

/* Grid */
.plans-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  align-items: stretch;
}

@media (max-width: 900px) {
  .plans-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}

/* Card Base */
.plan-card {
  position: relative;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  padding: 2.5rem 2rem 2rem;
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.3s ease, border-color 0.3s ease, transform 0.3s ease;
  border-radius: 0;
}

.plan-card:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  border-color: #cbd5e1;
}

.plan-card--featured {
  border: 2px solid #3b82f6;
  background: linear-gradient(180deg, #eff6ff 0%, #ffffff 100%);
  z-index: 1;
  transform: scale(1.03);
  box-shadow: 0 12px 40px rgba(59, 130, 246, 0.12);
}

.plan-card--featured:hover {
  box-shadow: 0 16px 50px rgba(59, 130, 246, 0.18);
  transform: scale(1.04);
}

.plan-card--active {
  border-color: #2563eb;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.15);
}

/* Badge */
.plan-badge {
  position: absolute;
  top: -1px;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  padding: 0.3rem 1.2rem;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  white-space: nowrap;
}

.plan-badge--popular {
  background: #3b82f6;
  color: #ffffff;
}

.plan-badge--active {
  background: #2563eb;
  color: #ffffff;
}

/* Icon */
.plan-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.plan-icon--starter {
  background: #f8fafc;
  color: #64748b;
}

.plan-icon--medium {
  background: #eff6ff;
  color: #3b82f6;
}

.plan-icon--enterprise {
  background: #dbeafe;
  color: #2563eb;
}

/* Header */
.plan-card__header {
  margin-bottom: 1.5rem;
}

.plan-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a2e;
  margin: 0 0 0.35rem;
}

.plan-description {
  font-size: 0.875rem;
  color: #94a3b8;
  line-height: 1.5;
  margin: 0;
}

/* Price */
.plan-price {
  display: flex;
  align-items: baseline;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #f1f5f9;
}

.plan-price__currency {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a1a2e;
  margin-right: 2px;
}

.plan-price__amount {
  font-size: 2.5rem;
  font-weight: 600;
  color: #1a1a2e;
  line-height: 1;
}

.plan-price__period {
  font-size: 0.95rem;
  color: #94a3b8;
  margin-left: 4px;
  font-weight: 500;
}

/* Features */
.plan-features {
  list-style: none;
  padding: 0;
  margin: 0 0 2rem;
  flex: 1;
}

.plan-feature {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.6rem 0;
  font-size: 0.9rem;
  color: #475569;
}

.plan-feature__icon {
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.plan-feature__icon--starter {
  background: #f8fafc;
  color: #64748b;
}

.plan-feature__icon--medium {
  background: #eff6ff;
  color: #3b82f6;
}

.plan-feature__icon--enterprise {
  background: #dbeafe;
  color: #2563eb;
}

/* Action */
.plan-action {
  margin-top: auto;
  padding-top: 1.5rem;
  border-top: 1px solid #f1f5f9;
}

/* Buttons */
.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0.85rem 1.5rem;
  font-size: 0.9rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 0;
}

.btn--starter {
  background: #f1f5f9;
  color: #1a1a2e;
  border: 1px solid #e2e8f0;
}

.btn--starter:hover {
  background: #e2e8f0;
  border-color: #cbd5e1;
}

.btn--disabled {
  background: #f8fafc;
  color: #94a3b8;
  border: 1px solid #e2e8f0;
  cursor: not-allowed;
}

.btn--loading {
  background: #f1f5f9;
  color: #64748b;
  border: 1px solid #e2e8f0;
  cursor: wait;
  gap: 0.5rem;
}

.btn-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #cbd5e1;
  border-top-color: #2563eb;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* PayPal container */
.paypal-container {
  width: 100%;
  min-height: 45px;
}

.ai-usage-info {
  max-width: 300px;
  margin: 1.5rem auto 0;
}

.usage-bar-container {
  width: 100%;
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}

.usage-bar-fill {
  height: 100%;
  transition: width 0.5s ease, background-color 0.3s ease;
}

.mt-4 {
  margin-top: 1rem;
}

.text-blue-600 {
  color: #2563eb;
}

.text-slate-600 {
  color: #475569;
}

.text-slate-900 {
  color: #0f172a;
}

.font-bold {
  font-weight: 700;
}
</style>

