declare global {
  interface SubscriptionCurrentResponse {
    id: number;
    plan_id: number;
    plan_name: string;
    plan_price: string;
    status: string;
    started_at: string;
    expires_at: string;
  }

  interface PlanResponse {
    id: number;
    name: string;
    description: string;
    price: string;
  }
}

export {};
