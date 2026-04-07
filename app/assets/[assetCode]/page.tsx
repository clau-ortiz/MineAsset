import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { computeRisk } from '@/lib/risk';
import { RiskBadge } from '@/app/components/risk-badge';

export default async function AssetDetail({ params }: { params: { assetCode: string } }) {
  const asset = await prisma.asset.findUnique({
    where: { assetCode: params.assetCode },
    include: {
      maintenanceRecords: { orderBy: { startDate: 'desc' } },
      changeLogs: { orderBy: { changedAt: 'desc' } },
      supplierOffers: {
        include: { supplier: true },
        orderBy: { unitPrice: 'asc' }
      }
    }
  });

  if (!asset) return notFound();

  const risk = computeRisk(asset);

  return (
    <div className="space-y-6">
      <Link href="/" className="text-sm text-amber-300 hover:text-amber-200">← Volver al dashboard</Link>
      <header className="card flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-mono text-slate-400">{asset.assetCode}</p>
          <h1 className="text-2xl font-semibold">{asset.name}</h1>
          <p className="text-sm text-slate-400">{asset.category} · {asset.location}</p>
        </div>
        <RiskBadge level={risk.level} />
      </header>

      <section className="card space-y-2">
        <h2 className="text-lg font-semibold">General Information</h2>
        <p className="text-sm text-slate-300">Estado: {asset.status}</p>
        <p className="text-sm text-slate-300">Criticidad: {asset.criticality}</p>
        <p className="text-sm text-slate-300">Origen: {asset.origin ?? 'N/A'}</p>
      </section>

      <section className="card space-y-2">
        <h2 className="text-lg font-semibold">Technical Data</h2>
        <p className="text-sm">Fabricante/Modelo: {asset.manufacturer ?? 'N/A'} / {asset.model ?? 'N/A'}</p>
        <p className="text-sm">Serie: {asset.serialNumber ?? 'N/A'}</p>
        <p className="text-sm">Vida útil estimada: {asset.estimatedUsefulLifeHours}h ({asset.estimatedUsefulLifeYears} años)</p>
        <p className="text-sm">Vida útil remanente: {asset.remainingUsefulLifeHours}h ({asset.remainingUsefulLifeYears} años)</p>
        <p className="text-sm">Consumo vida útil: {asset.usefulLifeConsumedPercent}%</p>
      </section>

      <section className="card space-y-3">
        <h2 className="text-lg font-semibold">Maintenance</h2>
        {asset.maintenanceRecords.map((record) => (
          <article key={record.id} className="rounded-lg border border-mine-700 p-3 text-sm">
            <p><strong>{record.maintenanceType}</strong> · {record.maintenanceStatus}</p>
            <p>Detalle/subtype: {record.maintenanceDetail}</p>
            <p>Inicio: {record.startDate.toISOString().slice(0, 10)} · Fin estimado: {record.estimatedEndDate?.toISOString().slice(0, 10) ?? 'N/A'}</p>
            <p>Horas acumuladas: {record.accumulatedMaintenanceHours}h · Costo: USD {record.maintenanceCost}</p>
            <p>Responsable: {record.responsibleParty}</p>
            <p>Razón: {record.maintenanceReason}</p>
          </article>
        ))}
      </section>

      <section className="card space-y-2">
        <h2 className="text-lg font-semibold">Supply / Logistics</h2>
        <p className="text-sm">Proveedor (selección): {asset.supplierOffers.find((s) => s.isPreferred)?.supplier.name ?? 'N/A'}</p>
        <p className="text-sm">Request date: {asset.requestDate?.toISOString().slice(0, 10) ?? 'N/A'}</p>
        <p className="text-sm">Dispatch date: {asset.dispatchDate?.toISOString().slice(0, 10) ?? 'N/A'}</p>
        <p className="text-sm">Estimated arrival: {asset.estimatedArrivalDate?.toISOString().slice(0, 10) ?? 'N/A'}</p>
        <p className="text-sm">Lead time total/restante: {asset.totalLeadTimeDays ?? asset.leadTimeDays} / {asset.remainingDays ?? 0} días</p>
        <p className="text-sm">Condición logística: {asset.logisticsCondition ?? 'N/A'}</p>
        <p className="text-sm">Notas logísticas: {asset.logisticsNotes ?? 'N/A'}</p>
      </section>

      <section className="card space-y-2">
        <h2 className="text-lg font-semibold">Risk Assessment</h2>
        <div className="flex items-center gap-2"><RiskBadge level={risk.level} /><span className="text-sm text-slate-300">Semáforo calculado por stock, vida útil remanente, lead time y criticidad.</span></div>
        <ul className="list-disc pl-5 text-sm text-slate-300">
          {risk.reasons.map((reason) => (
            <li key={reason}>{reason}</li>
          ))}
        </ul>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="card space-y-2">
          <h2 className="text-lg font-semibold">History</h2>
          {asset.changeLogs.map((log) => (
            <div key={log.id} className="rounded border border-mine-700 p-2 text-sm">
              <p>{log.changedAt.toISOString().slice(0, 10)} · {log.changedBy}</p>
              <p>{log.field}: {log.oldValue} → {log.newValue}</p>
              <p className="text-slate-400">{log.reason}</p>
            </div>
          ))}
        </article>
        <article className="card space-y-2">
          <h2 className="text-lg font-semibold">Comparación de proveedores</h2>
          {asset.supplierOffers.map((offer) => (
            <div key={offer.id} className="rounded border border-mine-700 p-2 text-sm">
              <p>{offer.supplier.name} {offer.isPreferred ? '· preferido' : ''}</p>
              <p>{offer.currency} {offer.unitPrice} · {offer.deliveryDays} días · garantía {offer.warrantyMonths} meses</p>
              <p>Rating: {offer.supplier.rating} / 5</p>
            </div>
          ))}
        </article>
      </section>
    </div>
  );
}
