import React from 'react';
import {
  TrendingUp,
  Boxes,
  Flower2,
  AlertTriangle,
  ShoppingCart,
  Calendar,
  DollarSign,
  Plus,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { WorkflowDiagram } from '../components/WorkflowDiagram';

export const DashboardAdmin: React.FC = () => {
  const {
    variedades,
    insumos,
    compras,
    ventas,
    actividades,
    cosechas,
    incidencias,
    setActiveModule,
  } = useApp();

  // Metrics calculation
  const totalSalesRevenue = ventas.reduce((acc, v) => acc + v.total, 0);
  const totalPurchasesCost = compras.reduce((acc, c) => acc + c.total, 0);
  const grossProfit = totalSalesRevenue - totalPurchasesCost;

  // Stems in inventory
  const totalRoseStems = variedades.reduce((acc, v) => acc + v.stockActualTallos, 0);

  // Low stock alerts
  const lowStockSupplies = insumos.filter((i) => i.cantidad <= i.stockMinimo);
  const lowStockRoses = variedades.filter((v) => v.stockActualTallos <= v.stockMinimo);
  const activeAlertsCount = lowStockSupplies.length + lowStockRoses.length;

  // Pending activities
  const pendingTasks = actividades.filter((a) => a.estado !== 'completada');

  return (
    <div className="space-y-6">
      {/* Saludo y acciones rápidas ejecutivas */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 text-[10px] font-black uppercase tracking-wider">
              Dirección General
            </span>
            <span className="text-xs text-slate-500 font-medium">Temporada Activa 2026</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
            Panel de Control • Aaron Mena Morales
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Monitoreo en tiempo real de producción en invernadero, stock de rosas, insumos y rentabilidad financiera.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveModule('pos')}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            Nueva Venta
          </button>
          <button
            onClick={() => setActiveModule('produccion')}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition"
          >
            <Flower2 className="w-4 h-4" />
            Registrar Cosecha
          </button>
          <button
            onClick={() => setActiveModule('compras')}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs shadow-xs transition"
          >
            <ShoppingCart className="w-4 h-4" />
            Nueva Compra
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Ventas Totales */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Ventas Acumuladas</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl sm:text-3xl font-black text-slate-900">
              ${totalSalesRevenue.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-emerald-700 font-semibold mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              {ventas.length} pedidos y tickets facturados
            </p>
          </div>
          <button
            onClick={() => setActiveModule('ventas')}
            className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-rose-600 hover:text-rose-700"
          >
            <span>Ver detalle de ventas</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* KPI 2: Stock Actual de Rosas */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Stock de Rosas</span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <Flower2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl sm:text-3xl font-black text-slate-900">
              {totalRoseStems.toLocaleString()} <span className="text-sm font-semibold text-slate-500">tallos</span>
            </p>
            <p className="text-xs text-rose-700 font-semibold mt-1">
              {variedades.length} variedades y calidades listas
            </p>
          </div>
          <button
            onClick={() => setActiveModule('inventarios')}
            className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-rose-600 hover:text-rose-700"
          >
            <span>Consultar inventario</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* KPI 3: Compras & Insumos */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Compras de Insumos</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <ShoppingCart className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl sm:text-3xl font-black text-slate-900">
              ${totalPurchasesCost.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-blue-700 font-semibold mt-1">
              {compras.length} órdenes y fertilizantes/empaques
            </p>
          </div>
          <button
            onClick={() => setActiveModule('compras')}
            className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-rose-600 hover:text-rose-700"
          >
            <span>Gestionar proveedores</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* KPI 4: Alertas de Stock y Tareas */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Alertas y Labores</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl sm:text-3xl font-black text-slate-900">
              {activeAlertsCount}{' '}
              <span className="text-sm font-semibold text-amber-700">bajos</span>
            </p>
            <p className="text-xs text-slate-600 font-semibold mt-1">
              {pendingTasks.length} tareas pendientes en invernadero
            </p>
          </div>
          <button
            onClick={() => setActiveModule('actividades')}
            className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-rose-600 hover:text-rose-700"
          >
            <span>Ver programa de campo</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Flujo de Trabajo Interactivo del Invernadero (1. Compras -> 2. Actividades -> 3. Cosecha -> 4. Ventas -> 5. Supervisión) */}
      <WorkflowDiagram />

      {/* Grid de 2 Columnas: Alertas de Stock & Tareas Prioritarias vs Rentabilidad Financiera */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel Izquierdo: Alertas de Stock Bajo y Estado de Cultivo */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <h3 className="text-sm font-bold text-slate-900">Alertas de Stock Bajo & Atención</h3>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
              {activeAlertsCount} críticas
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {lowStockRoses.length === 0 && lowStockSupplies.length === 0 ? (
              <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                Todos los niveles de rosas e insumos se encuentran en rangos óptimos.
              </div>
            ) : (
              <>
                {lowStockRoses.map((v) => (
                  <div
                    key={v.id}
                    className="p-3 rounded-xl bg-rose-50/70 border border-rose-200 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <Flower2 className="w-4 h-4 text-rose-600 shrink-0" />
                      <div>
                        <p className="font-bold text-rose-950">Rosa {v.nombre} ({v.calidad})</p>
                        <p className="text-[11px] text-rose-800">
                          Stock actual: <strong className="text-rose-900">{v.stockActualTallos} tallos</strong> (Mínimo: {v.stockMinimo})
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveModule('produccion')}
                      className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-bold text-[11px] hover:bg-rose-700"
                    >
                      Cosechar
                    </button>
                  </div>
                ))}

                {lowStockSupplies.map((i) => (
                  <div
                    key={i.id}
                    className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <Boxes className="w-4 h-4 text-amber-600 shrink-0" />
                      <div>
                        <p className="font-bold text-amber-950">{i.nombre}</p>
                        <p className="text-[11px] text-amber-800">
                          Existencia: <strong className="text-amber-900">{i.cantidad} {i.unidad}</strong> (Mínimo: {i.stockMinimo} {i.unidad})
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveModule('compras')}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 text-white font-bold text-[11px] hover:bg-slate-900"
                    >
                      Comprar
                    </button>
                  </div>
                ))}
              </>
            )}

            {/* Incidencias activas */}
            {incidencias.filter((inc) => inc.estado !== 'resuelta').map((inc) => (
              <div key={inc.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <div className="flex items-center justify-between font-bold text-slate-800">
                  <span>Incidencia: {inc.zona} ({inc.tipo})</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-800 uppercase">
                    {inc.severidad}
                  </span>
                </div>
                <p className="text-slate-600 text-[11px] mt-1">{inc.descripcion}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Panel Derecho: Balance de Rentabilidad & Cosechas Recientes */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Control Financiero & Rendimiento</h3>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                Margen Positivo
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-[11px] font-semibold text-slate-500 uppercase">Ingresos Ventas</p>
                <p className="text-lg font-black text-slate-900 mt-1">
                  ${totalSalesRevenue.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-[11px] font-semibold text-slate-500 uppercase">Gastos Insumos</p>
                <p className="text-lg font-black text-slate-900 mt-1">
                  ${totalPurchasesCost.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            <div className="mt-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-950 uppercase">Utilidad Operativa Bruta</span>
                <span className="text-sm font-black text-emerald-800">
                  ${grossProfit.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <p className="text-[11px] text-emerald-700 mt-1">
                Calculada en base a costo directo de compras de agroquímicos, empaques y ventas de rosas emitidas.
              </p>
            </div>

            {/* Últimas Cosechas registradas */}
            <div className="mt-4">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Últimos Cortes Ingresados al Stock
              </h4>
              <div className="space-y-2">
                {cosechas.slice(0, 2).map((c) => (
                  <div key={c.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-800">{c.variedad} ({c.calidad})</p>
                      <p className="text-[10px] text-slate-500">{c.loteZona} • {c.fecha}</p>
                    </div>
                    <span className="font-extrabold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded">
                      +{c.tallosIngresadosStock} tallos
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Supervisor: Aaron Mena Morales</span>
            <button
              onClick={() => setActiveModule('reportes')}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
            >
              Reportes Detallados & Mermas <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
