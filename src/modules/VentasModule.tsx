import React, { useState } from 'react';
import {
  CreditCard,
  Search,
  Calendar,
  DollarSign,
  Receipt,
  User,
  Plus,
  ArrowUpRight,
  Printer,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Venta } from '../types';

export const VentasModule: React.FC = () => {
  const { ventas, setActiveModule } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<Venta | null>(null);

  const totalVentas = ventas.reduce((acc, v) => acc + v.total, 0);

  const filteredVentas = ventas.filter((v) =>
    v.folio.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.nombreCliente.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <span className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 text-[10px] font-black uppercase tracking-wider">
            Facturación & Salidas
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
            Ventas, Tickets & Clientes
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Historial de tickets emitidos, comprobantes de venta de rosas a florerías y clientes finales.
          </p>
        </div>

        <button
          onClick={() => setActiveModule('pos')}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition"
        >
          <Plus className="w-4 h-4" />
          Abrir Terminal de Cobro (POS)
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase">Ingresos Totales por Ventas</span>
          <p className="text-2xl font-black text-slate-900 mt-1">
            ${totalVentas.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">Ingresos acumulados en caja</p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase">Tickets Emitidos</span>
          <p className="text-2xl font-black text-indigo-700 mt-1">{ventas.length}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Comprobantes generados con stock descontado</p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase">Ticket Promedio</span>
          <p className="text-2xl font-black text-slate-900 mt-1">
            ${ventas.length > 0 ? (totalVentas / ventas.length).toLocaleString('es-MX', { minimumFractionDigits: 2 }) : '0.00'}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Por transacción realizada</p>
        </div>
      </div>

      {/* Search */}
      <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar por folio o cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>
      </div>

      {/* Tabla de Ventas */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Folio / Fecha</th>
                <th className="py-3 px-4">Cliente</th>
                <th className="py-3 px-4">Productos Vendidos</th>
                <th className="py-3 px-4">Método de Pago</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4 text-right">Comprobante</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredVentas.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No hay ventas registradas. Realiza una venta en el Punto de Venta.
                  </td>
                </tr>
              ) : (
                filteredVentas.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900">{v.folio}</p>
                      <p className="text-[11px] text-slate-500">{v.fecha}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900">{v.nombreCliente}</p>
                      <span className="text-[10px] uppercase font-semibold text-slate-500">
                        {v.tipoCliente.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-600">
                      {v.items.map((it, idx) => (
                        <div key={idx} className="line-clamp-1">
                          {it.cantidad}x {it.nombreVariedad} ({it.tipoPresentacion.replace('_', ' ')})
                        </div>
                      ))}
                    </td>
                    <td className="py-3.5 px-4 capitalize text-slate-700">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-xs font-semibold">
                        {v.metodoPago}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-black text-slate-900 text-sm">
                      ${v.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedTicket(v)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs"
                      >
                        Ver Ticket
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Visualizar Ticket */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 text-left my-8 font-mono text-xs">
            <div className="text-center pb-3 border-b border-dashed border-slate-300 space-y-1">
              <img src="/icon.svg" alt="Invernadero Rosas" className="w-10 h-10 mx-auto" />
              <h2 className="text-sm font-black uppercase text-slate-900">Invernadero Rosas</h2>
              <p className="text-[10px] text-slate-500">Comprobante Fiscal / Nota de Venta</p>
              <p className="text-[10px] text-slate-600 font-bold">FOLIO: {selectedTicket.folio}</p>
              <p className="text-[10px] text-slate-500">{selectedTicket.fecha}</p>
            </div>

            <div className="py-3 border-b border-dashed border-slate-300 space-y-1">
              <p><strong>Cliente:</strong> {selectedTicket.nombreCliente}</p>
              <p><strong>Método:</strong> {selectedTicket.metodoPago.toUpperCase()}</p>
              <p><strong>Atendió:</strong> {selectedTicket.atendidoPor}</p>
            </div>

            <div className="py-3 border-b border-dashed border-slate-300 space-y-2">
              {selectedTicket.items.map((it, idx) => (
                <div key={idx} className="flex justify-between">
                  <div>
                    <p className="font-bold">{it.cantidad}x {it.nombreVariedad} ({it.tipoPresentacion.replace('_', ' ')})</p>
                    <p className="text-[10px] text-slate-500">{it.tallosTotales} tallos</p>
                  </div>
                  <span className="font-bold">${it.subtotal.toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="py-3 space-y-1 text-right">
              <p>Subtotal: ${selectedTicket.subtotal.toFixed(2)}</p>
              {selectedTicket.descuento > 0 && <p className="text-rose-600">Descuento: -${selectedTicket.descuento.toFixed(2)}</p>}
              <p className="text-base font-black text-slate-900 pt-1 border-t border-slate-200">
                TOTAL: ${selectedTicket.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </p>
            </div>

            <div className="mt-4 flex gap-2 font-sans">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <Printer className="w-4 h-4" /> Imprimir
              </button>
              <button
                onClick={() => setSelectedTicket(null)}
                className="flex-1 py-2 rounded-xl bg-slate-100 text-slate-800 font-bold text-xs hover:bg-slate-200"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
