export const demoRoles = [
  'Operador/Bodega',
  'Mantenimiento',
  'Compras/Abastecimiento',
  'Gerencia',
  'Administrador'
] as const;

export type DemoRole = (typeof demoRoles)[number];
