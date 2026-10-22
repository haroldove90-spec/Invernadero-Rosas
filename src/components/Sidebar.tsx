import React from 'react';
import {
  LayoutDashboard,
  Boxes,
  ShoppingCart,
  CalendarCheck2,
  Flower2,
  CreditCard,
  BarChart3,
  GitBranch,
  ChevronLeft,
  ChevronRight,
  LogOut,
  AlertTriangle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggleCollapse }) => {
  const { activeRole, activeModule, setActiveModule, setActiveRole, incidencias, insumos, variedades } = useApp();

  // Low stock alerts count
  const lowStockSupplies = insumos.filter((i) => i.cantidad <= i.stockMinimo).length;
  const lowStockRoses = variedades.filter((v) => v.stockActualTallos <= v.stockMinimo).length;
  const openIncidents = incidencias.filter((i) => i.estado !== 'resuelta').length;
  const totalAlerts = lowStockSupplies + lowStockRoses + openIncidents;

  // Determine available modules based on role
  const getModulesForRole = () => {
    switch (activeRole) {
      case 'production':
        return [
          { id: 'produccion', label: 'Labores y Campo', icon: CalendarCheck2 },
          { id: 'cosecha', label: 'Cosecha & Corte', icon: Flower2 },
          { id: 'inventarios', label: 'Stock & Insumos', icon: Boxes, badge: lowStockSupplies > 0 ? lowStockSupplies : null },
        ];
      case 'sales':
        return [
          { id: 'pos', label: 'Punto de Venta (POS)', icon: CreditCard },
          { id: 'stock-ventas', label: 'Stock Disponible', icon: Flower2, badge: lowStockRoses > 0 ? lowStockRoses : null },
          { id: 'ventas-historial', label: 'Historial Tickets', icon: ShoppingCart },
        ];
      case 'supervisor':
        return [
          { id: 'dashboard', label: 'Supervisión General', icon: LayoutDashboard },
          { id: 'workflow', label: 'Flujo del Invernadero', icon: GitBranch },
          { id: 'inventarios', label: 'Control Inventarios', icon: Boxes, badge: lowStockRoses + lowStockSupplies > 0 ? lowStockRoses + lowStockSupplies : null },
          { id: 'reportes', label: 'Calidad & Mermas', icon: BarChart3 },
        ];
      case 'admin':
      default:
        return [
          { id: 'dashboard', label: 'Dashboard General', icon: LayoutDashboard },
          { id: 'inventarios', label: 'Módulo Inventarios', icon: Boxes, badge: lowStockRoses + lowStockSupplies > 0 ? lowStockRoses + lowStockSupplies : null },
          { id: 'compras', label: 'Módulo Compras', icon: ShoppingCart },
          { id: 'ventas', label: 'Ventas y Facturación', icon: CreditCard },
          { id: 'actividades', label: 'Actividades & Tareas', icon: CalendarCheck2 },
          { id: 'produccion', label: 'Campo & Cosechas', icon: Flower2 },
          { id: 'reportes', label: 'Supervisión & Reportes', icon: BarChart3 },
          { id: 'workflow', label: 'Flujo del Invernadero', icon: GitBranch },
        ];
    }
  };

  const navItems = getModulesForRole();

  return (
    <aside
      className={`hidden lg:flex flex-col bg-[#084A39] text-emerald-50 border-r border-[#06382b] transition-all duration-300 z-30 shrink-0 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Top Sidebar identity */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-[#06382b]">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">
              {activeRole === 'admin'
                ? 'Panel Dueño'
                : activeRole === 'production'
                ? 'Operaciones Campo'
                : activeRole === 'sales'
                ? 'Terminal POS'
                : 'Supervisión'}
            </span>
          </div>
        )}
        <button
          onClick={onToggleCollapse}
          className={`p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-[#0c5c47] transition ${
            collapsed ? 'mx-auto' : ''
          }`}
          title={collapsed ? 'Expandir panel lateral' : 'Contraer panel'}
        >
          {collapsed ? <ChevronRight className="w-5 h-5 text-rose-300" /> : <ChevronLeft className="w-5 h-5 text-emerald-200" />}
        </button>
      </div>

      {/* Nav List */}
      <nav className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeModule === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveModule(item.id)}
              title={item.label}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all duration-200 text-left ${
                isActive
                  ? 'bg-rose-600 text-white shadow-md shadow-emerald-950/40 font-semibold'
                  : 'text-emerald-100/90 hover:text-white hover:bg-[#0c5c47]'
              } ${collapsed ? 'justify-center px-2' : ''}`}
            >
              <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-emerald-200 group-hover:text-white'}`} />
              {!collapsed && <span className="truncate">{item.label}</span>}
              {!collapsed && item.badge && (
                <span className="ml-auto px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-rose-500/25 text-rose-200 border border-rose-400/40">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Alerts notification if present */}
      {!collapsed && totalAlerts > 0 && (
        <div className="mx-3 mb-3 p-3 rounded-xl bg-emerald-950/50 border border-emerald-700/50">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{totalAlerts} Alertas de Stock/Campo</span>
          </div>
          <p className="mt-1 text-[11px] text-emerald-200/90">
            {lowStockRoses} rosas y {lowStockSupplies} insumos bajo el mínimo.
          </p>
        </div>
      )}

      {/* Bottom session trigger in sidebar */}
      <div className="p-3 border-t border-[#06382b]">
        <button
          onClick={() => setActiveRole(null)}
          className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-emerald-200 hover:text-rose-300 hover:bg-[#0c5c47] rounded-xl transition ${
            collapsed ? 'justify-center px-2' : ''
          }`}
          title="Cambiar de Rol / Cerrar Sesión"
        >
          <LogOut className="w-4 h-4" />
          {!collapsed && <span>Cambiar de Rol</span>}
        </button>
      </div>
    </aside>
  );
};
