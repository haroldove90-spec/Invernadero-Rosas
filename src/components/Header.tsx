import React, { useState } from 'react';
import { LogOut, Database, UserCheck, Trash2, RefreshCw, Layers } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  onOpenSupabaseModal: () => void;
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSupabaseModal, onToggleSidebar }) => {
  const { activeRole, setActiveRole, clearAllSampleData, restoreSampleData, isSampleDataSuppressed } = useApp();
  const [showDataMenu, setShowDataMenu] = useState(false);

  const getRoleDisplayName = () => {
    switch (activeRole) {
      case 'admin':
        return {
          title: 'Aaron Mena Morales',
          role: 'Administrador / Dueño',
          badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
        };
      case 'production':
        return {
          title: 'Encargado de Invernadero',
          role: 'Producción & Cultivo',
          badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        };
      case 'sales':
        return {
          title: 'Cajero / Punto de Venta',
          role: 'Ventas & Mostrador',
          badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
        };
      case 'supervisor':
        return {
          title: 'Supervisión Técnica',
          role: 'Control de Calidad',
          badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
        };
      default:
        return {
          title: 'Usuario Activo',
          role: 'Operador',
          badgeColor: 'bg-slate-100 text-slate-800 border-slate-300',
        };
    }
  };

  const roleInfo = getRoleDisplayName();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logotipo del sistema */}
          <div className="flex items-center gap-3">
            {onToggleSidebar && (
              <button
                onClick={onToggleSidebar}
                className="hidden lg:flex p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
                title="Alternar Menú Lateral"
              >
                <Layers className="w-5 h-5 text-emerald-700" />
              </button>
            )}

            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              {/* Logo sin encapsular */}
              <img
                src="/icon.svg"
                alt="Invernadero Rosas"
                className="w-9 h-9 sm:w-11 sm:h-11 object-contain drop-shadow-xs"
              />
              <div className="flex flex-col">
                <span className="text-base sm:text-lg font-black tracking-tight text-slate-900 leading-none">
                  Invernadero <span className="text-rose-700 font-extrabold">Rosas</span>
                </span>
                <span className="text-[10px] sm:text-xs font-semibold text-emerald-700 tracking-wider uppercase mt-0.5">
                  Sistema de Gestión Integral
                </span>
              </div>
            </div>
          </div>

          {/* Acciones principales: Identificación de Rol, PWA Install, Botón de Datos, Cerrar Sesión */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Identificación del Rol Activo */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <div className="text-left">
                <p className="text-xs font-bold text-slate-800 leading-tight">{roleInfo.title}</p>
                <p className="text-[10px] font-medium text-slate-500 leading-none">{roleInfo.role}</p>
              </div>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md border ${roleInfo.badgeColor}`}>
                Activo
              </span>
            </div>

            {/* Rol condensado en pantallas móviles */}
            <div className="sm:hidden flex items-center px-2 py-1 rounded-lg bg-slate-100 text-[10px] font-bold text-slate-700">
              {activeRole === 'admin' ? 'Admin' : activeRole === 'production' ? 'Producción' : activeRole === 'sales' ? 'Ventas' : 'Supervisor'}
            </div>

            {/* Botón de Instalación Rápida PWA ("Instalar") */}
            <PWAInstallButton variant="header" />

            {/* Menú de Gestión de Datos de Muestra & Supabase */}
            <div className="relative">
              <button
                onClick={() => setShowDataMenu(!showDataMenu)}
                title="Gestión de Datos y Supabase"
                className="p-2 sm:px-2.5 sm:py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 text-xs font-medium flex items-center gap-1.5 transition active:scale-95"
              >
                <Database className="w-4 h-4 text-rose-600" />
                <span className="hidden md:inline">Datos</span>
              </button>

              {showDataMenu && (
                <div
                  className="absolute right-0 mt-2 w-64 rounded-xl bg-white p-2 shadow-xl border border-slate-200 z-50 animate-fadeIn"
                  onMouseLeave={() => setShowDataMenu(false)}
                >
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-800">Control de Almacenamiento</p>
                    <p className="text-[11px] text-slate-500">
                      {isSampleDataSuppressed
                        ? 'Datos de muestra suprimidos (Modo limpio)'
                        : 'Datos de muestra activos'}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      clearAllSampleData();
                      setShowDataMenu(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 rounded-lg transition text-left"
                  >
                    <Trash2 className="w-4 h-4 text-rose-600 shrink-0" />
                    <div>
                      <p>Borrar datos de muestra</p>
                      <p className="text-[10px] text-rose-500 font-normal">No mostrar más registros de prueba</p>
                    </div>
                  </button>

                  {isSampleDataSuppressed && (
                    <button
                      onClick={() => {
                        restoreSampleData();
                        setShowDataMenu(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 rounded-lg transition text-left"
                    >
                      <RefreshCw className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <p>Restaurar demostración</p>
                        <p className="text-[10px] text-emerald-600 font-normal">Cargar catálogo y datos iniciales</p>
                      </div>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      onOpenSupabaseModal();
                      setShowDataMenu(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition text-left border-t border-slate-100 mt-1"
                  >
                    <Database className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <p>Configurar / Borrar Supabase</p>
                      <p className="text-[10px] text-slate-500 font-normal">Base de datos en la nube</p>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Botón de Cierre de Sesión (Regresa a Selector de Roles) */}
            <button
              onClick={() => setActiveRole(null)}
              title="Cerrar sesión y cambiar de rol"
              className="p-2 sm:px-3 sm:py-1.5 rounded-lg border border-slate-200/80 bg-slate-50 text-slate-700 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 text-xs font-semibold flex items-center gap-1.5 transition active:scale-95"
            >
              <LogOut className="w-4 h-4 text-slate-500 group-hover:text-rose-600" />
              <span className="hidden sm:inline">Cerrar sesión</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
