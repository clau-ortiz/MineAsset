'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { demoRoles } from '@/lib/roles';

export function RoleSelector() {
  const params = useSearchParams();
  const router = useRouter();
  const role = params.get('role') ?? 'Administrador';

  return (
    <div className="card flex items-center justify-between gap-2">
      <p className="text-sm text-slate-300">Modo Demo · Rol actual</p>
      <select
        className="rounded-md border border-mine-700 bg-mine-800 px-3 py-2 text-sm"
        value={role}
        onChange={(event) => {
          const next = new URLSearchParams(params.toString());
          next.set('role', event.target.value);
          router.push(`/?${next.toString()}`);
        }}
      >
        {demoRoles.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  );
}
