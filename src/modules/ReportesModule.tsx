import React from 'react';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  Flower2,
  CalendarCheck2,
  PieChart,
  Download,
  Printer,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ReportesModule: React.FC = () => {
  const {
    ventas,
    compras,
    mermas,
    variedades,
    insumos,
    actividades,
    cosechas,
  } = useApp();

  // Financial calculations
  const totalIncome = ventas.reduce((acc, v) => acc + v.total, 0);
  const totalExpenses = compras.reduce((acc, c) => acc + c.total, 0);
  const netProfit = totalIncome - totalExpenses;
  const marginPercentage = totalIncome > 0 ? ((netProfit / totalIncome) * 100).toFixed(1) : '0';

  // Total stems harvested vs discarded
  const totalHarvestStems = cosechas.reduce((acc, c) => acc + c.tallosCortados, 0);
  const totalLossStems = mermas.reduce((acc, m) => acc + m.cantidadTallos, 0);
  const lossRate = totalHarvestStems > 0 ? ((totalLossStems / totalHarvestStems) * 100).toFixed(1) : '0';

  // Activities compliance
  const totalTasks = actividades.length;
  const completedTasks = actividades.filter((a) => a.estado === 'completada').length;
  const complianceRate = totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(0) : '100';

  // Group losses by reason
  const lossesByReason = mermas.reduce((acc, m) => {
    acc[m.causa] = (acc[m.causa] || 0) + m.cantidadTallos;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 text-[10px] font-black uppercase tracking-wider">
            Paso 5 del Flujo • Supervisión Directiva
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
            Reportes de Gestión & Rentabilidad
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Supervisión ejecutiva para Aaron Mena Morales: análisis de costos de insumos vs ingresos, índice de mermas y balance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs shadow-xs transition"
          >
            <Printer className="w-4 h-4" />
            Imprimir Informe
          </button>
        </div>
      </div>

      {/* KPI Cards de Supervisión */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Ingresos Totales */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase">Ingresos por Ventas</span>
          <p className="text-2xl font-black text-slate-900 mt-2">
            ${totalIncome.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-emerald-700 font-semibold mt-1">
            {ventas.length} transacciones registradas
          </p>
        </div>

        {/* KPI 2: Costos Operativos */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase">Costos de Insumos</span>
          <p className="text-2xl font-black text-slate-900 mt-2">
            ${totalExpenses.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Fertilizantes, pesticidas y empaques
          </p>
        </div>

        {/* KPI 3: Utilidad Operativa */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase">Utilidad Operativa</span>
          <p className={`text-2xl font-black mt-2 ${netProfit >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
            ${netProfit.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs font-bold text-emerald-700 mt-1">
            Margen Bruto: {marginPercentage}%
          </p>
        </div>

        {/* KPI 4: Tasa de Mermas */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase">Pérdidas y Mermas</span>
          <p className="text-2xl font-black text-rose-600 mt-2">
            {totalLossStems} <span className="text-sm font-semibold text-slate-500">tallos</span>
          </p>
          <p className="text-xs text-rose-700 font-semibold mt-1">
            {lossRate}% del total cosechado
          </p>
        </div>
      </div>

      {/* Grid de 2 Columnas: Rentabilidad Detallada vs Reporte de Mermas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Desglose Financiero */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              Comparativa: Costos de Insumos vs. Ingresos
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800">
              Rentable
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-800">Ventas Directas (POS y Mayoristas)</p>
                <p className="text-[11px] text-slate-500">Cobros recibidos por docenas y tallos</p>
              </div>
              <span className="text-sm font-black text-emerald-700">
                +${totalIncome.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-800">Compras de Fertilizantes y Fitosanitarios</p>
                <p className="text-[11px] text-slate-500">Inversión directa para nutrición y sanidad vegetal</p>
              </div>
              <span className="text-sm font-black text-slate-800">
                -${totalExpenses.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </span>
            </div>

            {/* Barra visual de proporción */}
            <div className="pt-2">
              <div className="flex justify-between text-xs text-slate-600 mb-1 font-semibold">
                <span>Relación Costo / Ingreso:</span>
                <span>{totalIncome > 0 ? ((totalExpenses / totalIncome) * 100).toFixed(0) : 0}% de los ingresos</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden flex">
                <div
                  className="bg-emerald-600 h-full"
                  style={{ width: `${Math.min(100, Math.max(10, 100 - Number(marginPercentage)))}%` }}
                  title="Costos"
                />
                <div
                  className="bg-teal-400 h-full"
                  style={{ width: `${Math.max(0, Number(marginPercentage))}%` }}
                  title="Margen neto"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50 text-emerald-950 border border-emerald-200">
              <p className="text-xs font-bold">Resumen de Rentabilidad:</p>
              <p className="text-xs mt-1 text-emerald-900 leading-relaxed">
                Por cada $1.00 invertido en insumos de invernadero, el negocio genera{' '}
                <strong>${totalExpenses > 0 ? (totalIncome / totalExpenses).toFixed(2) : '0.00'}</strong> en ventas de rosas.
              </p>
            </div>
          </div>
        </div>

        {/* Desglose de Mermas y Pérdidas */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              Reporte de Pérdidas y Mermas por Causa
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-rose-50 text-rose-800">
              {totalLossStems} tallos
            </span>
          </div>

          <div className="space-y-3">
            {Object.keys(lossesByReason).length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs">
                No hay mermas registradas hasta el momento.
              </div>
            ) : (
              Object.entries(lossesByReason).map(([causa, qty]) => (
                <div
                  key={causa}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                >
                  <div className="capitalize font-semibold text-slate-800">
                    {causa.replace('_', ' ')}
                  </div>
                  <span className="font-bold text-rose-700 bg-rose-100/60 px-2.5 py-0.5 rounded-full">
                    {qty} tallos
                  </span>
                </div>
              ))
            )}

            {/* Historial de Mermas recientes */}
            <div className="pt-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Últimas Mermas Notificadas en Campo
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {mermas.map((m) => (
                  <div key={m.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs flex justify-between">
                    <div>
                      <p className="font-bold text-slate-900">{m.variedad} ({m.cantidadTallos} tallos)</p>
                      <p className="text-[10px] text-slate-500">{m.loteZona} • {m.fecha}</p>
                      {m.notas && <p className="text-[10px] text-slate-600 italic">"{m.notas}"</p>}
                    </div>
                    <span className="text-rose-600 font-bold uppercase text-[10px] self-start">
                      {m.causa}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cumplimiento de Labores Agronómicas */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <CalendarCheck2 className="w-4 h-4 text-teal-600" />
            Estado de Cumplimiento de Labores del Invernadero
          </h3>
          <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
            {complianceRate}% Cumplido
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-50">
            <p className="text-slate-500">Total Programadas:</p>
            <p className="text-lg font-black text-slate-900 mt-0.5">{totalTasks}</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50">
            <p className="text-slate-500">Ejecutadas con éxito:</p>
            <p className="text-lg font-black text-emerald-700 mt-0.5">{completedTasks}</p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50">
            <p className="text-slate-500">Pendientes / En curso:</p>
            <p className="text-lg font-black text-amber-600 mt-0.5">{totalTasks - completedTasks}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
