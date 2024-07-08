export type PlanItem = {
  id: number;
  name: string;
  price: string;
  duration: string;
  features: Array<string>;
  isRecommended: boolean;
  isPopular?: boolean;
};

export type PricingCard = {
  [title: string]: {
    duration: number;
    price: string;
    features: string[];
  };
};
