import { PrismaClient, Criticality, AssetStatus, LogisticsCondition, MaintenanceType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.supplierOffer.deleteMany();
  await prisma.changeLog.deleteMany();
  await prisma.maintenanceRecord.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.asset.deleteMany();

  const [andesParts, titanLogistics, globalMining, hydroFlow] = await Promise.all([
    prisma.supplier.create({
      data: { name: 'Andes Parts Co.', country: 'Chile', contact: 'contacto@andesparts.demo', rating: 4.7, avgDeliveryDays: 9, qualityScore: 93 }
    }),
    prisma.supplier.create({
      data: { name: 'Titan Logistics Mining', country: 'Perú', contact: 'sales@titanlog.demo', rating: 4.2, avgDeliveryDays: 22, qualityScore: 87 }
    }),
    prisma.supplier.create({
      data: { name: 'Global Mining Components', country: 'USA', contact: 'hello@globalmining.demo', rating: 4.9, avgDeliveryDays: 28, qualityScore: 96 }
    }),
    prisma.supplier.create({
      data: { name: 'HydroFlow Industrial', country: 'Brasil', contact: 'support@hydroflow.demo', rating: 4.5, avgDeliveryDays: 14, qualityScore: 90 }
    })
  ]);

  const tire = await prisma.asset.create({
    data: {
      assetCode: 'MIN-TIRE-001',
      name: 'Neumático de camión minero',
      category: 'Rodado crítico',
      manufacturer: 'EarthMover',
      model: 'EM-59R63',
      serialNumber: 'EM59-88921',
      location: 'Mina Norte - Patio de Flota',
      status: AssetStatus.IN_TRANSIT,
      criticality: Criticality.HIGH,
      stockQty: 1,
      minStock: 4,
      leadTimeDays: 45,
      estimatedUsefulLifeHours: 12000,
      estimatedUsefulLifeYears: 3,
      remainingUsefulLifeHours: 1800,
      remainingUsefulLifeYears: 0,
      usefulLifeConsumedPercent: 85,
      isInTransit: true,
      requestDate: new Date('2026-03-02'),
      dispatchDate: new Date('2026-03-18'),
      estimatedArrivalDate: new Date('2026-04-20'),
      totalLeadTimeDays: 49,
      remainingDays: 13,
      origin: 'Houston, USA',
      logisticsCondition: LogisticsCondition.SPECIAL_TRANSPORT,
      logisticsNotes: 'Requiere cama baja, escolta y ventana de descarga nocturna por dimensiones del neumático.'
    }
  });

  const pump = await prisma.asset.create({
    data: {
      assetCode: 'MIN-PUMP-014',
      name: 'Bomba hidráulica',
      category: 'Hidráulica',
      manufacturer: 'HydraTech',
      model: 'HT-450',
      serialNumber: 'HT450-3321',
      location: 'Planta Chancado',
      status: AssetStatus.OPERATIONAL,
      criticality: Criticality.HIGH,
      stockQty: 3,
      minStock: 2,
      leadTimeDays: 18,
      estimatedUsefulLifeHours: 10000,
      estimatedUsefulLifeYears: 4,
      remainingUsefulLifeHours: 5200,
      remainingUsefulLifeYears: 2,
      usefulLifeConsumedPercent: 48
    }
  });

  const motor = await prisma.asset.create({
    data: {
      assetCode: 'MIN-MOTOR-033',
      name: 'Motor eléctrico industrial',
      category: 'Electromecánico',
      manufacturer: 'VoltWorks',
      model: 'VW-900',
      serialNumber: 'VW900-7781',
      location: 'Molino SAG',
      status: AssetStatus.MAINTENANCE,
      criticality: Criticality.HIGH,
      stockQty: 1,
      minStock: 1,
      leadTimeDays: 32,
      estimatedUsefulLifeHours: 20000,
      estimatedUsefulLifeYears: 6,
      remainingUsefulLifeHours: 6000,
      remainingUsefulLifeYears: 2,
      usefulLifeConsumedPercent: 70
    }
  });

  const belt = await prisma.asset.create({
    data: {
      assetCode: 'MIN-BELT-021',
      name: 'Correa transportadora',
      category: 'Transporte material',
      location: 'Correa primaria',
      status: AssetStatus.OPERATIONAL,
      criticality: Criticality.MEDIUM,
      stockQty: 5,
      minStock: 3,
      leadTimeDays: 20,
      estimatedUsefulLifeHours: 15000,
      estimatedUsefulLifeYears: 5,
      remainingUsefulLifeHours: 9000,
      remainingUsefulLifeYears: 3,
      usefulLifeConsumedPercent: 40
    }
  });

  const filter = await prisma.asset.create({
    data: {
      assetCode: 'MIN-FILT-090',
      name: 'Filtro industrial',
      category: 'Filtración',
      location: 'Planta de agua',
      status: AssetStatus.OPERATIONAL,
      criticality: Criticality.LOW,
      stockQty: 15,
      minStock: 8,
      leadTimeDays: 7,
      estimatedUsefulLifeHours: 4000,
      estimatedUsefulLifeYears: 1,
      remainingUsefulLifeHours: 2600,
      remainingUsefulLifeYears: 0,
      usefulLifeConsumedPercent: 35
    }
  });

  const brake = await prisma.asset.create({
    data: {
      assetCode: 'MIN-BRAKE-011',
      name: 'Componente de freno',
      category: 'Seguridad',
      location: 'Taller camiones',
      status: AssetStatus.OUT_OF_SERVICE,
      criticality: Criticality.HIGH,
      stockQty: 0,
      minStock: 3,
      leadTimeDays: 26,
      estimatedUsefulLifeHours: 8000,
      estimatedUsefulLifeYears: 2,
      remainingUsefulLifeHours: 400,
      remainingUsefulLifeYears: 0,
      usefulLifeConsumedPercent: 95
    }
  });

  await prisma.maintenanceRecord.createMany({
    data: [
      {
        assetId: tire.id,
        maintenanceStatus: 'scheduled',
        maintenanceType: MaintenanceType.PREDICTIVE,
        maintenanceDetail: 'Inspección de carcasa por ultrasonido',
        startDate: new Date('2026-04-25'),
        estimatedEndDate: new Date('2026-04-26'),
        accumulatedMaintenanceHours: 6,
        maintenanceCost: 1200,
        responsibleParty: 'Equipo externo TireScan',
        maintenanceReason: 'Tendencia de desgaste irregular detectada'
      },
      {
        assetId: motor.id,
        maintenanceStatus: 'in_progress',
        maintenanceType: MaintenanceType.CORRECTIVE,
        maintenanceDetail: 'Cambio de rodamientos y alineación',
        startDate: new Date('2026-04-03'),
        estimatedEndDate: new Date('2026-04-08'),
        accumulatedMaintenanceHours: 22,
        maintenanceCost: 4850,
        responsibleParty: 'Equipo eléctrico interno',
        maintenanceReason: 'Vibración fuera de banda permitida'
      },
      {
        assetId: pump.id,
        maintenanceStatus: 'completed',
        maintenanceType: MaintenanceType.PREVENTIVE,
        maintenanceDetail: 'Cambio de sellos y calibración',
        startDate: new Date('2026-03-20'),
        estimatedEndDate: new Date('2026-03-21'),
        accumulatedMaintenanceHours: 8,
        maintenanceCost: 900,
        responsibleParty: 'Mantenimiento Planta',
        maintenanceReason: 'Programa trimestral preventivo'
      }
    ]
  });

  await prisma.changeLog.createMany({
    data: [
      {
        assetId: tire.id,
        changedAt: new Date('2026-03-01'),
        changedBy: 'Compras/Abastecimiento',
        field: 'supplier',
        oldValue: 'Andes Parts Co.',
        newValue: 'Global Mining Components',
        reason: 'Mejor disponibilidad de transporte especial'
      },
      {
        assetId: tire.id,
        changedAt: new Date('2026-03-18'),
        changedBy: 'Operador/Bodega',
        field: 'dispatchDate',
        oldValue: '2026-03-25',
        newValue: '2026-03-18',
        reason: 'Adelanto de consolidación de carga'
      },
      {
        assetId: tire.id,
        changedAt: new Date('2026-03-28'),
        changedBy: 'Mantenimiento',
        field: 'remainingUsefulLifeHours',
        oldValue: '2300',
        newValue: '1800',
        reason: 'Actualización por inspección de desgaste'
      },
      {
        assetId: brake.id,
        changedAt: new Date('2026-04-05'),
        changedBy: 'Gerencia',
        field: 'status',
        oldValue: 'OPERATIONAL',
        newValue: 'OUT_OF_SERVICE',
        reason: 'Riesgo de seguridad por fatiga del material'
      }
    ]
  });

  await prisma.supplierOffer.createMany({
    data: [
      {
        assetId: tire.id,
        supplierId: andesParts.id,
        unitPrice: 52000,
        currency: 'USD',
        deliveryDays: 30,
        warrantyMonths: 12,
        isPreferred: false
      },
      {
        assetId: tire.id,
        supplierId: titanLogistics.id,
        unitPrice: 54800,
        currency: 'USD',
        deliveryDays: 25,
        warrantyMonths: 10,
        isPreferred: false
      },
      {
        assetId: tire.id,
        supplierId: globalMining.id,
        unitPrice: 53500,
        currency: 'USD',
        deliveryDays: 45,
        warrantyMonths: 18,
        isPreferred: true
      },
      {
        assetId: pump.id,
        supplierId: hydroFlow.id,
        unitPrice: 8200,
        currency: 'USD',
        deliveryDays: 14,
        warrantyMonths: 12,
        isPreferred: true
      }
    ]
  });

  await prisma.changeLog.create({
    data: {
      assetId: tire.id,
      changedBy: 'Compras/Abastecimiento',
      field: 'logisticsNotes',
      oldValue: 'Sin detalle',
      newValue: 'Ruta multimodal con ventana restringida de descarga',
      reason: 'Se confirma condición de transporte especial'
    }
  });

  await prisma.asset.update({
    where: { id: brake.id },
    data: {
      isInTransit: true,
      requestDate: new Date('2026-04-01'),
      dispatchDate: new Date('2026-04-06'),
      estimatedArrivalDate: new Date('2026-04-24'),
      totalLeadTimeDays: 23,
      remainingDays: 17,
      origin: 'Lima, Perú',
      logisticsCondition: LogisticsCondition.IMPORTED,
      logisticsNotes: 'Demora aduanera potencial por inspección documental.'
    }
  });

  const assets = [tire, pump, motor, belt, filter, brake];
  console.log(`Seed completado con ${assets.length} activos demo.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
