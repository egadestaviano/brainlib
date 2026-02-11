import { subscriptionService } from "~/services/subscriptionService";

interface State {
  subscription: SubscriptionCurrentResponse | null;
  plans: PlanResponse[];
  loading: boolean;
}

export const useSubscriptionStore = defineStore("subscription", {
  state: (): State => ({
    subscription: null,
    plans: [],
    loading: false,
  }),

  getters: {
    getSubscription: (state) => state.subscription,
    getPlans: (state) => state.plans,
    isSubscribed: (state) => !!state.subscription,
  },

  actions: {
    async fetchCurrentSubscription() {
      try {
        this.loading = true;
        const response = await subscriptionService.getCurrent();
        this.subscription = response;
      } catch (error) {
        this.subscription = null;
      } finally {
        this.loading = false;
      }
    },

    async fetchPlans() {
      try {
        this.loading = true;
        const response = await subscriptionService.listPlans();
        this.plans = response;
      } catch (error) {
        this.plans = [];
      } finally {
        this.loading = false;
      }
    },

    async subscribeTo(planId: number) {
      try {
        this.loading = true;
        const response = await subscriptionService.subscribeToPlan(planId);

        if (response.checkout_url) {
          window.location.href = response.checkout_url;
          return;
        }

        await this.fetchCurrentSubscription();
      } finally {
        this.loading = false;
      }
    },

    clearSubscription() {
      this.subscription = null;
      this.plans = [];
    },
  },

  persist: true,
});
