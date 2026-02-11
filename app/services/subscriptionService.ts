import { api } from '~/utils/api'

export const subscriptionService = {
  getCurrent: () => api.get<SubscriptionCurrentResponse>('/subscriptions/current'),
  listPlans: () => api.get<PlanResponse[]>('/subscriptions/plans'),
  subscribeToPlan: (planId: number) => api.post<any>('/subscriptions', { plan_id: planId })
}
