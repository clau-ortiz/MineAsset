import { Asset, Criticality, RiskLevel } from '@prisma/client';

export type RiskResult = {
  level: RiskLevel;
  reasons: string[];
};

export function computeRisk(asset: Asset): RiskResult {
  let score = 0;
  const reasons: string[] = [];

  if (asset.stockQty <= asset.minStock) {
    score += 2;
    reasons.push('low stock');
  }

  const lifeRatio = asset.remainingUsefulLifeHours / Math.max(asset.estimatedUsefulLifeHours, 1);
  if (lifeRatio <= 0.2) {
    score += 2;
    reasons.push('remaining useful life below threshold');
  }

  if (asset.leadTimeDays >= 30) {
    score += 1;
    reasons.push('long lead time');
  }

  if (asset.criticality === Criticality.HIGH) {
    score += 1;
    reasons.push('critical asset');
  }

  if (score >= 4) return { level: RiskLevel.RED, reasons };
  if (score >= 2) return { level: RiskLevel.YELLOW, reasons };
  return { level: RiskLevel.GREEN, reasons: reasons.length ? reasons : ['normal conditions'] };
}
