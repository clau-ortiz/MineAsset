import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { computeRisk } from '@/lib/risk';
import { RiskBadge } from './components/risk-badge';
import { RoleSelector } from './components/role-selector';

type HomeProps = {
  searchParams?: {
    q?: string;
    role?: string;
  };
};

export default async function Home({ searchParams }: HomeProps) {
  const q = searchParams?.q?.trim() ?? '';

  const assets = await prisma.asset.findMany({
    where: q
      ? {
          OR: [{ assetCode: { contains: q } }, { name: { contains: q } }]
        }
      : undefined,
    orderBy: { assetCode: 'asc' }
  });

  const enriched = assets.map((asset) => ({
    ...asset,
    risk: computeRisk(asset)
  }));

  const kpis = {
    total: enriched.length,
    red: enriched.filter((a) => a.risk.level === 'RED').length,
    lowStock: enriched.filter((a) => a.stockQty <= a.minStock).length,
    transit: enriched.filter((a) => a.isInTransit).length
  };

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">MineAsset Tracker</h1>
        <p className="text-sm text-slate-400">Inventario técnico, mantenimiento, trazabilidad y riesgo para activos críticos mineros.</p>
      </header>

      <RoleSelector />

      <section className="grid gap-3 md:grid-cols-4">
        <article className="card"><p className="text-sm text-slate-400">Activos</p><p className="text-2xl font-semibold">{kpis.total}</p></article>
        <article className="card"><p className="text-sm text-slate-400">Riesgo crítico</p><p className="text-2xl font-semibold text-hazard-red">{kpis.red}</p></article>
        <article className="card"><p className="text-sm text-slate-400">Stock bajo</p><p className="text-2xl font-semibold text-hazard-yellow">{kpis.lowStock}</p></article>
        <article className="card"><p className="text-sm text-slate-400">En camino</p><p className="text-2xl font-semibold text-sky-400">{kpis.transit}</p></article>
      </section>

      <section className="card space-y-4">
        <form className="flex gap-2" method="GET">
          <input name="q" defaultValue={q} className="w-full rounded-md border border-mine-700 bg-mine-800 px-3 py-2 text-sm" placeholder="Buscar por ID de activo o nombre" />
          <button className="rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-mine-950" type="submit">Buscar</button>
        </form>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-slate-400">
              <tr>
                <th className="pb-2">Asset ID</th>
                <th className="pb-2">Activo</th>
                <th className="pb-2">Stock</th>
                <th className="pb-2">Vida útil</th>
                <th className="pb-2">Lead time</th>
                <th className="pb-2">Riesgo</th>
              </tr>
            </thead>
            <tbody>
              {enriched.map((asset) => (
                <tr key={asset.id} className="border-t border-mine-700/60">
                  <td className="py-3 font-mono text-xs text-slate-300">{asset.assetCode}</td>
                  <td className="py-3"><Link className="text-amber-300 hover:text-amber-200" href={`/assets/${asset.assetCode}`}>{asset.name}</Link></td>
                  <td className="py-3">{asset.stockQty}/{asset.minStock}</td>
                  <td className="py-3">{asset.remainingUsefulLifeHours}h ({asset.remainingUsefulLifeYears}a)</td>
                  <td className="py-3">{asset.leadTimeDays} días</td>
                  <td className="py-3"><RiskBadge level={asset.risk.level} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
