export interface PricingTier {
  name: string;
  costPerMinute: number;
  description: string;
}

export const pricingTiers: PricingTier[] = [
  {
    name: 'Text Only',
    costPerMinute: 0.02,
    description: 'Text-based chat with full whiteboard support — no voice',
  },
  {
    name: 'Standard Voice',
    costPerMinute: 0.06,
    description: 'Turn-by-turn voice tutoring with ~1.5s response time',
  },
  {
    name: 'Premium Voice',
    costPerMinute: 0.25,
    description: 'Ultra-low-latency voice with sub-400ms response and natural interruptions',
  },
];

export const volumeDiscounts = [
  { minMinutes: 0, maxMinutes: 9_999, discount: 0, label: 'Up to 10,000 minutes' },
  { minMinutes: 10_000, maxMinutes: 49_999, discount: 0.1, label: '10,000 - 50,000 minutes' },
  { minMinutes: 50_000, maxMinutes: 199_999, discount: 0.2, label: '50,000 - 200,000 minutes' },
  { minMinutes: 200_000, maxMinutes: Infinity, discount: null, label: '200,000+ minutes' },
];

export const platformFees = {
  setup: 2_500,
  monthly: 500,
};

export const launchPromo = {
  name: 'Launch Partner Program',
  setupDiscount: 0.5,       // 50% off setup
  monthlyDiscount: 0.5,     // 50% off monthly platform fee
  monthlyDiscountMonths: 12, // for 12 months
  setupPrice: 1_250,        // $2,500 * 0.5
  monthlyPrice: 250,        // $500 * 0.5
};

export const sandboxLimits = {
  engine: 'standard' as const,
  maxSessionsPerMonth: 100,
  maxSessionDurationMinutes: 30,
  maxConcurrentSessions: 10,
  maxModuleUploads: 5,
  homeworkUploadEnabled: false,
  webhookTestingEnabled: true,
  estimatedMonthlyCostUsd: 45,
};

export function calculateMonthlyCost(
  studentsPerMonth: number,
  sessionsPerStudent: number,
  avgSessionMinutes: number,
  tier: PricingTier,
  usePromo = false
): { totalMinutes: number; grossCost: number; discount: number; netCost: number; platformFee: number } {
  const totalMinutes = studentsPerMonth * sessionsPerStudent * avgSessionMinutes;
  const grossCost = totalMinutes * tier.costPerMinute;

  const bracket = volumeDiscounts.find(
    (d) => totalMinutes >= d.minMinutes && totalMinutes <= d.maxMinutes
  );
  const discountRate = bracket?.discount ?? 0;
  const discount = grossCost * discountRate;
  const netCost = grossCost - discount;
  const platformFee = usePromo ? launchPromo.monthlyPrice : platformFees.monthly;

  return { totalMinutes, grossCost, discount, netCost, platformFee };
}
