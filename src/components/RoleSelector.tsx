import React from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

interface RoleOption {
  id: UserRole;
  name: string;
}

const ROLES_LIST: RoleOption[] = [
  {
    id: 'admin',
    name: 'Administrador / Dueño\n(Aaron Mena Morales)',
  },
  {
    id: 'production',
    name: 'Encargado de Producción / Invernadero',
  },
  {
    id: 'sales',
    name: 'Vendedor / Cajero',
  },
  {
    id: 'supervisor',
    name: 'Supervisión y Control de Calidad',
  },
];

export const RoleSelector: React.FC = () => {
  const { setActiveRole } = useApp();

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 via-rose-50/20 to-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-5xl mx-auto">
        {/* Cuadrícula 2 Columnas Móvil / 4 Columnas Escritorio: Tarjetas independientes por rol, sin header, sin descripciones, solo nombre del rol y el logo del sistema sin encapsular */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {ROLES_LIST.map((role) => (
            <button
              key={role.id}
              onClick={() => setActiveRole(role.id)}
              className="group flex flex-col items-center justify-center text-center p-6 sm:p-8 bg-white/90 hover:bg-white rounded-2xl border border-slate-200/80 hover:border-rose-400 hover:shadow-xl hover:shadow-rose-500/10 transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer active:scale-95"
            >
              {/* Logo del sistema sin encapsular (sin marco o burbuja contenedor, directo y limpio) */}
              <img
                src="/icon.svg"
                alt="Logo Invernadero Rosas"
                className="w-20 h-20 sm:w-24 sm:h-24 object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-sm"
              />

              {/* Solo nombre del rol */}
              <span className="mt-5 text-sm sm:text-base font-bold text-slate-800 group-hover:text-rose-700 leading-snug whitespace-pre-line transition-colors">
                {role.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
