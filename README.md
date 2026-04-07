# MineAsset Tracker

Prototipo V1 de gestión de activos críticos para minería con inventario técnico, mantenimiento, trazabilidad de cambios, comparación de proveedores y evaluación de riesgo por semáforo.

## Stack
- Next.js + TypeScript
- Tailwind CSS
- Prisma ORM
- SQLite

## Roles demo
- Operador/Bodega
- Mantenimiento
- Compras/Abastecimiento
- Gerencia
- Administrador

## Módulos V1
- Dashboard con KPIs.
- Búsqueda por ID de activo.
- Ficha de activo con secciones:
  - General Information
  - Technical Data
  - Maintenance
  - Supply / Logistics
  - Risk Assessment
  - History
- Comparación de proveedores por activo.
- Semáforo de riesgo con razones (stock, vida útil remanente, lead time y criticidad).

## Requisitos
- Node.js 20+
- npm 10+

## Ejecución local
1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Configurar entorno:
   ```bash
   cp .env.example .env
   ```
3. Generar cliente Prisma y crear DB:
   ```bash
   npm run prisma:generate
   npx prisma db push
   ```
4. Poblar datos demo:
   ```bash
   npm run prisma:seed
   ```
5. Ejecutar app:
   ```bash
   npm run dev
   ```

Abrir `http://localhost:3000`.

## Datos demo incluidos
- Neumático de camión minero (más completo, multi-proveedor, lead time largo, transporte especial, historial extenso).
- Bomba hidráulica.
- Motor eléctrico industrial.
- Correa transportadora.
- Filtro industrial.
- Componente de freno.
