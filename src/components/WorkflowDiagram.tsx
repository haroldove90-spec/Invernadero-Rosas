import React from 'react';
import { ShoppingCart, CalendarCheck, Flower2, CreditCard, ShieldCheck, ArrowRight, CornerDownRight, CornerDownLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const WorkflowDiagram: React.FC = () => {
  const { setActiveModule, compras, actividades, cosechas, ventas, insumos, variedades } = useApp();

  const pendingTasks = actividades.filter((a) => a.estado !== 'completada').length;
  const totalRoses = variedades.reduce((acc, v) => acc + v.stockActualTallos, 0);
  const totalSalesAmount = ventas.reduce((acc, v) => acc + v.total, 0);

  const steps = [
    {
      num: 1,
      title: 'Compras e Insumos',
      subtitle: 'Entrada de fertilizantes, pesticidas y empaques',
      stat: `${insumos.length} insumos en almacén`,
      icon: ShoppingCart,
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:border-emerald-400',
      tagColor: 'bg-emerald-600',
      moduleId: 'compras',
    },
    {
      num: 2,
      title: 'Actividades y Producción',
      subtitle: 'Riego, fumigación y nutrición en campo',
      stat: `${pendingTasks} tareas pendientes`,
      icon: CalendarCheck,
      color: 'bg-teal-50 text-teal-800 border-teal-200 hover:border-teal-400',
      tagColor: 'bg-teal-600',
      moduleId: 'actividades',
    },
    {
      num: 3,
      title: 'Cosecha e Inventario',
      subtitle: 'Corte, clasificación y registro de mermas',
      stat: `${cosechas.length} cosechas / ${totalRoses.toLocaleString()} tallos`,
      icon: Flower2,
      color: 'bg-rose-50 text-rose-800 border-rose-200 hover:border-rose-400',
      tagColor: 'bg-rose-600',
      moduleId: 'inventarios',
    },
    {
      num: 4,
      title: 'Ventas y Salidas',
      subtitle: 'Punto de venta, florerías y facturación',
      stat: `$${totalSalesAmount.toLocaleString('es-MX', { minimumFractionDigits: 0 })} ingresados`,
      icon: CreditCard,
      color: 'bg-indigo-50 text-indigo-800 border-indigo-200 hover:border-indigo-400',
      tagColor: 'bg-indigo-600',
      moduleId: 'ventas',
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span>
            Flujo de Trabajo Operativo del Invernadero
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Cadena de valor: Los insumos adquiridos nutren el cultivo, la cosecha alimenta el stock de venta y el POS genera los ingresos supervisados.
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 self-start sm:self-auto">
          Proceso Automatizado
        </span>
      </div>

      {/* Steps 1 to 4 in flex/grid with directional flow */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={step.num}
              onClick={() => setActiveModule(step.moduleId)}
              className={`p-4 rounded-xl border transition-all cursor-pointer hover:shadow-md ${step.color} flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[11px] font-black text-white px-2 py-0.5 rounded-md ${step.tagColor}`}>
                    Paso {step.num}
                  </span>
                  <Icon className="w-5 h-5 opacity-80" />
                </div>
                <h4 className="text-sm font-bold leading-snug">{step.title}</h4>
                <p className="text-xs opacity-80 mt-1 line-clamp-2">{step.subtitle}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-current/15 flex items-center justify-between text-xs font-semibold">
                <span>{step.stat}</span>
                <ArrowRight className="w-4 h-4 opacity-70" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Step 5: Supervision and Reports (Admin) */}
      <div className="mt-4 p-4 sm:p-5 rounded-xl bg-slate-900 text-white border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-600 text-white shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wide bg-rose-500/20 text-rose-300 border border-rose-500/30">
                Paso 5 • Supervisión Central
              </span>
              <span className="text-xs text-slate-400 hidden sm:inline">Aaron Mena Morales</span>
            </div>
            <h4 className="text-sm sm:text-base font-bold text-white mt-0.5">
              Control, Análisis de Rentabilidad y Auditoría en Tiempo Real
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Monitoreo cruzado: Costos de insumos comprados vs. ingresos de ventas en mostrador y mayoreo, índice de mermas y cumplimiento de labores.
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveModule('reportes')}
          className="w-full sm:w-auto px-4 py-2 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs shrink-0 transition"
        >
          Ver Reportes & Balance
        </button>
      </div>
    </div>
  );
};
