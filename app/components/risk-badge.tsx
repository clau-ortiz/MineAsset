import { RiskLevel } from '@prisma/client';

const palette: Record<RiskLevel, string> = {
  GREEN: 'bg-hazard-green/20 text-hazard-green border-hazard-green/40',
  YELLOW: 'bg-hazard-yellow/20 text-hazard-yellow border-hazard-yellow/40',
  RED: 'bg-hazard-red/20 text-hazard-red border-hazard-red/40'
};

export function RiskBadge({ level }: { level: RiskLevel }) {
  const label = level.toLowerCase();
  return <span className={`rounded border px-2 py-1 text-xs font-semibold uppercase ${palette[level]}`}>{label}</span>;
}
