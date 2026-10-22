import React from 'react';
import {
  LayoutDashboard,
  Boxes,
  ShoppingCart,
  CalendarCheck2,
  Flower2,
  CreditCard,
  BarChart3,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const BottomBar: React.FC = () => {
  const { activeRole, activeModule, setActiveModule } = useApp();

  // Bottom bar modules tailored to current role
  const getBottomNavItems = () => {
    switch (activeRole) {
      case 'production':
        return [
          { id: 'produccion', label: 'Campo', icon: CalendarCheck2 },
          { id: 'cosecha', label: 'Cosecha', icon: Flower2 },
          { id: 'inventarios', label: 'Insumos', icon: Boxes },
        ];
      case 'sales':
        return [
          { id: 'pos', label: 'POS / Venta', icon: CreditCard },
          { id: 'stock-ventas', label: 'Rosas', icon: Flower2 },
          { id: 'ventas-historial', label: 'Tickets', icon: ShoppingCart },
        ];
      case 'supervisor':
        return [
          { id: 'dashboard', label: 'General', icon: LayoutDashboard },
          { id: 'workflow', label: 'Flujo', icon: Flower2 },
          { id: 'inventarios', label: 'Stock', icon: Boxes },
          { id: 'reportes', label: 'Mermas', icon: BarChart3 },
        ];
      case 'admin':
      default:
        return [
          { id: 'dashboard', label: 'Inicio', icon: LayoutDashboard },
          { id: 'inventarios', label: 'Stock', icon: Boxes },
          { id: 'compras', label: 'Compras', icon: ShoppingCart },
          { id: 'actividades', label: 'Labores', icon: CalendarCheck2 },
          { id: 'ventas', label: 'Ventas', icon: CreditCard },
        ];
    }
  };

  const navItems = getBottomNavItems();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-lg safe-bottom">
      <div className="flex items-center justify-around h-16 px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeModule === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveModule(item.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1 px-1 transition-all duration-150 active:scale-95 ${
                isActive
                  ? 'text-rose-600 font-bold'
                  : 'text-slate-500 hover:text-slate-800 font-medium'
              }`}
            >
              <div
                className={`p-1 rounded-xl transition-all ${
                  isActive ? 'bg-rose-50 text-rose-600 scale-110' : ''
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] tracking-tight mt-0.5 truncate max-w-[68px]">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
