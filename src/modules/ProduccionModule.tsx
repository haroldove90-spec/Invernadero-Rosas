import React, { useState } from 'react';
import {
  Flower2,
  CalendarCheck,
  AlertTriangle,
  Plus,
  CheckCircle,
  Scissors,
  Check,
  X,
  Droplets,
  Bug,
  ThermometerSnowflake,
  ShieldAlert,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CalidadRosa } from '../types';

export const ProduccionModule: React.FC = () => {
  const {
    actividades,
    completarActividad,
    cosechas,
    registrarCosecha,
    incidencias,
    addIncidencia,
    resolverIncidencia,
    variedades,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'cosechas' | 'actividades' | 'incidencias'>('cosechas');

  // Modals
  const [showCosechaModal, setShowCosechaModal] = useState(false);
  const [showIncidenciaModal, setShowIncidenciaModal] = useState(false);

  // Form Cosecha
  const [newCosecha, setNewCosecha] = useState({
    fecha: new Date().toISOString().split('T')[0],
    loteZona: 'Lote 1 (Invernadero A)',
    variedad: variedades[0]?.nombre || 'Freedom Roja',
    tallosCortados: 350,
    calidad: 'Exportación' as CalidadRosa,
    longitudTallo: '70cm',
    mermasTallos: 15,
    encargado: 'Juan Morales (Producción)',
    notas: 'Corte matutino con buena apertura y tallo rígido',
  });

  // Form Incidencia
  const [newIncidencia, setNewIncidencia] = useState({
    fecha: new Date().toISOString().split('T')[0],
    zona: 'Invernadero A',
    tipo: 'plaga' as 'plaga' | 'clima' | 'enfermedad' | 'riego_fallido' | 'otro',
    descripcion: '',
    severidad: 'media' as 'baja' | 'media' | 'alta' | 'critica',
    reportadoPor: 'Juan Morales',
  });

  const handleCosechaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCosecha.tallosCortados || newCosecha.tallosCortados <= 0) return;

    registrarCosecha({
      fecha: newCosecha.fecha,
      loteZona: newCosecha.loteZona,
      variedad: newCosecha.variedad,
      tallosCortados: Number(newCosecha.tallosCortados),
      calidad: newCosecha.calidad,
      longitudTallo: newCosecha.longitudTallo,
      mermasTallos: Number(newCosecha.mermasTallos || 0),
      encargado: newCosecha.encargado,
      notas: newCosecha.notas,
    });

    setShowCosechaModal(false);
    setNewCosecha({
      fecha: new Date().toISOString().split('T')[0],
      loteZona: 'Lote 1 (Invernadero A)',
      variedad: variedades[0]?.nombre || 'Freedom Roja',
      tallosCortados: 350,
      calidad: 'Exportación',
      longitudTallo: '70cm',
      mermasTallos: 15,
      encargado: 'Juan Morales (Producción)',
      notas: 'Corte matutino con buena apertura y tallo rígido',
    });
  };

  const handleIncidenciaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIncidencia.descripcion.trim()) return;

    addIncidencia({
      fecha: newIncidencia.fecha,
      zona: newIncidencia.zona,
      tipo: newIncidencia.tipo,
      descripcion: newIncidencia.descripcion,
      severidad: newIncidencia.severidad,
      reportadoPor: newIncidencia.reportadoPor,
    });

    setShowIncidenciaModal(false);
    setNewIncidencia({
      fecha: new Date().toISOString().split('T')[0],
      zona: 'Invernadero A',
      tipo: 'plaga',
      descripcion: '',
      severidad: 'media',
      reportadoPor: 'Juan Morales',
    });
  };

  const pendingLabores = actividades.filter((a) => a.estado !== 'completada');
  const totalTallosCortados = cosechas.reduce((acc, c) => acc + c.tallosCortados, 0);
  const totalMermas = cosechas.reduce((acc, c) => acc + c.mermasTallos, 0);
  const totalIngresados = cosechas.reduce((acc, c) => acc + c.tallosIngresadosStock, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider">
            Rol: Encargado de Producción / Invernadero
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
            Control de Campo, Cosechas & Labores Diarias
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Registro diario de cortes de rosas, clasificación de calidad hacia el inventario y resolución de incidencias fitosanitarias.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCosechaModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition"
          >
            <Flower2 className="w-4 h-4" />
            Registrar Corte de Cosecha
          </button>
          <button
            onClick={() => setShowIncidenciaModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition"
          >
            <AlertTriangle className="w-4 h-4" />
            Reportar Incidencia
          </button>
        </div>
      </div>

      {/* KPI Cards de Campo */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase">Tallos Cosechados</span>
          <p className="text-2xl font-black text-slate-900 mt-1">
            {totalTallosCortados.toLocaleString()} <span className="text-sm font-semibold text-slate-500">tallos</span>
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Total recolectado en naves</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase">Ingreso a Stock Venta</span>
          <p className="text-2xl font-black text-emerald-700 mt-1">
            {totalIngresados.toLocaleString()} <span className="text-sm font-semibold text-emerald-600">tallos</span>
          </p>
          <p className="text-[11px] text-emerald-600 mt-0.5">Clasificados y disponibles para POS</p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase">Mermas Descartadas</span>
          <p className="text-2xl font-black text-rose-600 mt-1">
            {totalMermas.toLocaleString()} <span className="text-sm font-semibold text-rose-500">tallos</span>
          </p>
          <p className="text-[11px] text-rose-600 mt-0.5">Por botrytis, quiebre o deformidad</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setActiveTab('cosechas')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition ${
            activeTab === 'cosechas'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Flower2 className="w-4 h-4" />
          <span>Control de Cosecha ({cosechas.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('actividades')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition ${
            activeTab === 'actividades'
              ? 'bg-teal-700 text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <CalendarCheck className="w-4 h-4" />
          <span>Labores Diarias ({pendingLabores.length} pendientes)</span>
        </button>

        <button
          onClick={() => setActiveTab('incidencias')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition ${
            activeTab === 'incidencias'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Incidencias de Campo ({incidencias.length})</span>
        </button>
      </div>

      {/* Tab 1: Cosechas */}
      {activeTab === 'cosechas' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Fecha / Lote</th>
                  <th className="py-3 px-4">Variedad de Rosa</th>
                  <th className="py-3 px-4">Calidad / Tallo</th>
                  <th className="py-3 px-4">Corte Bruto</th>
                  <th className="py-3 px-4">Mermas</th>
                  <th className="py-3 px-4">Ingresadas a Stock</th>
                  <th className="py-3 px-4">Encargado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {cosechas.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-500">
                      No hay cosechas registradas. Presiona "Registrar Corte de Cosecha".
                    </td>
                  </tr>
                ) : (
                  cosechas.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-900">{c.fecha}</p>
                        <p className="text-[11px] text-slate-500">{c.loteZona}</p>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {c.variedad}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-800 font-bold text-xs">
                          {c.calidad}
                        </span>
                        <span className="ml-1 text-slate-500 text-xs">({c.longitudTallo})</span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-800">
                        {c.tallosCortados} tallos
                      </td>
                      <td className="py-3.5 px-4 text-rose-600 font-semibold">
                        -{c.mermasTallos}
                      </td>
                      <td className="py-3.5 px-4 font-black text-emerald-700">
                        +{c.tallosIngresadosStock} tallos
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 text-xs">
                        {c.encargado}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Labores Diarias (Lista rápida para marcar completadas) */}
      {activeTab === 'actividades' && (
        <div className="space-y-3">
          {actividades.map((act) => (
            <div
              key={act.id}
              className={`p-4 rounded-xl bg-white border flex items-center justify-between gap-4 transition shadow-xs ${
                act.estado === 'completada' ? 'border-emerald-200 bg-emerald-50/10' : 'border-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-slate-50 text-slate-700">
                  {act.tipo === 'riego' ? <Droplets className="w-5 h-5 text-blue-500" /> : <Scissors className="w-5 h-5 text-amber-500" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{act.titulo}</span>
                    <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                      {act.zona}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Programado para: {act.fechaProgramada} • Responsable: {act.asignadoA}
                  </p>
                </div>
              </div>

              {act.estado === 'completada' ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold">
                  <CheckCircle className="w-4 h-4" />
                  Completada
                </span>
              ) : (
                <button
                  onClick={() => completarActividad(act.id)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition"
                >
                  <Check className="w-4 h-4" />
                  Marcar como Realizada
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Incidencias */}
      {activeTab === 'incidencias' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {incidencias.length === 0 ? (
            <div className="col-span-full p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500">
              No hay incidencias reportadas en el cultivo.
            </div>
          ) : (
            incidencias.map((inc) => (
              <div
                key={inc.id}
                className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
                      <ShieldAlert className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{inc.zona}</h4>
                      <p className="text-xs text-slate-500">Tipo: {inc.tipo} • {inc.fecha}</p>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                      inc.severidad === 'critica' || inc.severidad === 'alta'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    Severidad {inc.severidad}
                  </span>
                </div>

                <p className="text-xs text-slate-700">{inc.descripcion}</p>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">Reportó: {inc.reportadoPor}</span>
                  {inc.estado !== 'resuelta' ? (
                    <button
                      onClick={() => resolverIncidencia(inc.id)}
                      className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-xs"
                    >
                      Marcar Resuelta
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Resuelta
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal Registrar Cosecha */}
      {showCosechaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 text-left my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Registrar Corte de Cosecha</h3>
              <button onClick={() => setShowCosechaModal(false)} className="p-1 rounded text-slate-400 hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCosechaSubmit} className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Fecha de Corte</label>
                  <input
                    type="date"
                    required
                    value={newCosecha.fecha}
                    onChange={(e) => setNewCosecha({ ...newCosecha, fecha: e.target.value })}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Lote / Sección</label>
                  <select
                    value={newCosecha.loteZona}
                    onChange={(e) => setNewCosecha({ ...newCosecha, loteZona: e.target.value })}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="Lote 1 (Invernadero A)">Lote 1 (Invernadero A)</option>
                    <option value="Lote 2 (Invernadero B)">Lote 2 (Invernadero B)</option>
                    <option value="Lote 3 (Invernadero C)">Lote 3 (Invernadero C)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Variedad de Rosas</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Freedom Roja, Mondial Blanca..."
                  value={newCosecha.variedad}
                  onChange={(e) => setNewCosecha({ ...newCosecha, variedad: e.target.value })}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Clasificación / Calidad</label>
                  <select
                    value={newCosecha.calidad}
                    onChange={(e) => setNewCosecha({ ...newCosecha, calidad: e.target.value as CalidadRosa })}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="Exportación">Exportación</option>
                    <option value="Nacional">Nacional</option>
                    <option value="Botones">Botones</option>
                    <option value="Rosas Abiertas">Rosas Abiertas</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Longitud de Tallo</label>
                  <select
                    value={newCosecha.longitudTallo}
                    onChange={(e) => setNewCosecha({ ...newCosecha, longitudTallo: e.target.value })}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="50cm">50 cm</option>
                    <option value="60cm">60 cm</option>
                    <option value="70cm">70 cm</option>
                    <option value="80cm">80 cm</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Total Tallos Cortados</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newCosecha.tallosCortados}
                    onChange={(e) => setNewCosecha({ ...newCosecha, tallosCortados: Number(e.target.value) })}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tallos Dañados (Merma)</label>
                  <input
                    type="number"
                    min="0"
                    value={newCosecha.mermasTallos}
                    onChange={(e) => setNewCosecha({ ...newCosecha, mermasTallos: Number(e.target.value) })}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs flex items-center justify-between font-bold text-emerald-950">
                <span>Ingreso Neto al Stock Disponible de Venta:</span>
                <span className="text-sm font-black text-emerald-800">
                  +{Math.max(0, newCosecha.tallosCortados - (newCosecha.mermasTallos || 0))} tallos
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Encargado de Corte</label>
                <input
                  type="text"
                  required
                  value={newCosecha.encargado}
                  onChange={(e) => setNewCosecha({ ...newCosecha, encargado: e.target.value })}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="mt-5 flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCosechaModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold"
                >
                  Guardar Cosecha e Ingresar Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Reportar Incidencia */}
      {showIncidenciaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 text-left my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Reportar Incidencia en Cultivo</h3>
              <button onClick={() => setShowIncidenciaModal(false)} className="p-1 rounded text-slate-400 hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleIncidenciaSubmit} className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Zona / Invernadero</label>
                  <select
                    value={newIncidencia.zona}
                    onChange={(e) => setNewIncidencia({ ...newIncidencia, zona: e.target.value })}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="Invernadero A">Invernadero A</option>
                    <option value="Invernadero B">Invernadero B</option>
                    <option value="Invernadero C">Invernadero C</option>
                    <option value="Lote 1">Lote 1</option>
                    <option value="Lote 2">Lote 2</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tipo de Incidencia</label>
                  <select
                    value={newIncidencia.tipo}
                    onChange={(e) => setNewIncidencia({ ...newIncidencia, tipo: e.target.value as any })}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="plaga">Plaga (Trips, ácaros, pulgón)</option>
                    <option value="enfermedad">Enfermedad (Botrytis, Oídio)</option>
                    <option value="clima">Clima / Temperatura extrema</option>
                    <option value="riego_fallido">Falla de Riego / Tubería</option>
                    <option value="otro">Otro contratiempo</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Severidad</label>
                <select
                  value={newIncidencia.severidad}
                  onChange={(e) => setNewIncidencia({ ...newIncidencia, severidad: e.target.value as any })}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                >
                  <option value="baja">Baja - Monitoreo preventivo</option>
                  <option value="media">Media - Requiere atención en 24h</option>
                  <option value="alta">Alta - Riesgo para la cama de cultivo</option>
                  <option value="critica">Crítica - Intervención urgente</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Descripción del Problema</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detalla ubicación exacta, síntomas observados y posible acción..."
                  value={newIncidencia.descripcion}
                  onChange={(e) => setNewIncidencia({ ...newIncidencia, descripcion: e.target.value })}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Reportado Por</label>
                <input
                  type="text"
                  required
                  value={newIncidencia.reportadoPor}
                  onChange={(e) => setNewIncidencia({ ...newIncidencia, reportadoPor: e.target.value })}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="mt-5 flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowIncidenciaModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold"
                >
                  Registrar Incidencia
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
