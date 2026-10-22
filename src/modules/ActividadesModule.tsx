import React, { useState } from 'react';
import {
  CalendarCheck2,
  Plus,
  CheckCircle,
  Clock,
  Droplets,
  Scissors,
  Bug,
  Sparkles,
  Flower2,
  Calendar,
  AlertCircle,
  X,
  Check,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Actividad, TipoActividad } from '../types';

export const ActividadesModule: React.FC = () => {
  const {
    actividades,
    insumos,
    addActividad,
    completarActividad,
    updateActividadEstado,
  } = useApp();

  const [filterZona, setFilterZona] = useState<string>('all');
  const [filterEstado, setFilterEstado] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // New task form
  const [newTask, setNewTask] = useState({
    titulo: '',
    tipo: 'riego' as TipoActividad,
    zona: 'Invernadero A',
    fechaProgramada: new Date().toISOString().split('T')[0],
    asignadoA: 'Juan Morales (Producción)',
    insumoRequeridoId: '',
    insumoCantidadRequerida: 0,
    notas: '',
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.titulo.trim()) return;
    addActividad({
      ...newTask,
      insumoRequeridoId: newTask.insumoRequeridoId || undefined,
      insumoCantidadRequerida: newTask.insumoCantidadRequerida > 0 ? Number(newTask.insumoCantidadRequerida) : undefined,
    });
    setShowAddModal(false);
    setNewTask({
      titulo: '',
      tipo: 'riego',
      zona: 'Invernadero A',
      fechaProgramada: new Date().toISOString().split('T')[0],
      asignadoA: 'Juan Morales (Producción)',
      insumoRequeridoId: '',
      insumoCantidadRequerida: 0,
      notas: '',
    });
  };

  const getTipoIcon = (tipo: TipoActividad) => {
    switch (tipo) {
      case 'riego':
        return <Droplets className="w-4 h-4 text-blue-500" />;
      case 'fumigacion':
        return <Bug className="w-4 h-4 text-purple-500" />;
      case 'poda':
      case 'desbotone':
        return <Scissors className="w-4 h-4 text-amber-500" />;
      case 'abonado':
        return <Sparkles className="w-4 h-4 text-emerald-500" />;
      case 'cosecha':
        return <Flower2 className="w-4 h-4 text-rose-500" />;
      default:
        return <CalendarCheck2 className="w-4 h-4 text-slate-500" />;
    }
  };

  const filteredActividades = actividades.filter((a) => {
    const matchesZona = filterZona === 'all' || a.zona === filterZona;
    const matchesEstado = filterEstado === 'all' || a.estado === filterEstado;
    return matchesZona && matchesEstado;
  });

  const pendingCount = actividades.filter((a) => a.estado === 'pendiente').length;
  const inProgressCount = actividades.filter((a) => a.estado === 'en_progreso').length;
  const completedCount = actividades.filter((a) => a.estado === 'completada').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <span className="px-2 py-0.5 rounded-md bg-teal-100 text-teal-800 text-[10px] font-black uppercase tracking-wider">
            Paso 2 del Flujo • Labores de Cultivo
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
            Módulo de Actividades & Tareas
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Programación y control de riego, poda, fumigación y desbotone. El sistema descuenta automáticamente los insumos al completar cada labor.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs shadow-xs transition"
        >
          <Plus className="w-4 h-4" />
          Programar Nueva Tarea
        </button>
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase">Pendientes</span>
            <p className="text-2xl font-black text-amber-600 mt-1">{pendingCount}</p>
            <p className="text-[11px] text-slate-500">Por iniciar en invernadero</p>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase">En Progreso</span>
            <p className="text-2xl font-black text-blue-600 mt-1">{inProgressCount}</p>
            <p className="text-[11px] text-slate-500">Operadores en campo</p>
          </div>
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase">Completadas</span>
            <p className="text-2xl font-black text-emerald-600 mt-1">{completedCount}</p>
            <p className="text-[11px] text-slate-500">Insumos descontados con éxito</p>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Zona:</span>
            <select
              value={filterZona}
              onChange={(e) => setFilterZona(e.target.value)}
              className="text-xs rounded-lg border border-slate-300 px-3 py-1.5 bg-white"
            >
              <option value="all">Todas las zonas</option>
              <option value="Invernadero A">Invernadero A</option>
              <option value="Invernadero B">Invernadero B</option>
              <option value="Invernadero C">Invernadero C</option>
              <option value="Lote 1 (Invernadero A)">Lote 1</option>
              <option value="Lote 2 (Invernadero B)">Lote 2</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Estado:</span>
            <select
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
              className="text-xs rounded-lg border border-slate-300 px-3 py-1.5 bg-white"
            >
              <option value="all">Todos los estados</option>
              <option value="pendiente">Pendientes</option>
              <option value="en_progreso">En Progreso</option>
              <option value="completada">Completadas</option>
            </select>
          </div>
        </div>

        <span className="text-xs text-slate-500 font-medium">
          Mostrando {filteredActividades.length} actividades
        </span>
      </div>

      {/* Lista de Tareas y Calendario Semanal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna Principal: Lista de Tareas con acción de consumo */}
        <div className="lg:col-span-2 space-y-3">
          {filteredActividades.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500">
              No hay labores que coincidan con los filtros seleccionados.
            </div>
          ) : (
            filteredActividades.map((act) => {
              const reqInsumo = insumos.find((i) => i.id === act.insumoRequeridoId);
              const isCompleted = act.estado === 'completada';
              return (
                <div
                  key={act.id}
                  className={`p-4 sm:p-5 rounded-2xl bg-white border transition shadow-xs flex flex-col justify-between ${
                    isCompleted
                      ? 'border-emerald-200 bg-emerald-50/20'
                      : 'border-slate-200 hover:border-teal-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 mt-0.5">
                        {getTipoIcon(act.tipo)}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                            {act.zona}
                          </span>
                          <span
                            className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                              act.estado === 'completada'
                                ? 'bg-emerald-100 text-emerald-800'
                                : act.estado === 'en_progreso'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {act.estado}
                          </span>
                        </div>
                        <h3 className="text-sm sm:text-base font-bold text-slate-900 mt-1">
                          {act.titulo}
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Asignado: <strong className="text-slate-700">{act.asignadoA}</strong> • Fecha: {act.fechaProgramada}
                        </p>
                        {act.notas && <p className="text-xs text-slate-600 mt-1 italic">"{act.notas}"</p>}
                      </div>
                    </div>
                  </div>

                  {/* Detalle de Insumo asociado para consumo automatizado */}
                  {reqInsumo && (
                    <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-600" />
                        <span className="text-slate-600">
                          Insumo programado: <strong>{reqInsumo.nombre}</strong>
                        </span>
                      </div>
                      <span className="font-bold text-emerald-700">
                        {act.insumoCantidadRequerida} {reqInsumo.unidad}
                      </span>
                    </div>
                  )}

                  {/* Acciones de Estado */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      {isCompleted && act.fechaRealizada ? `Realizada el ${act.fechaRealizada}` : 'Pendiente de confirmación en campo'}
                    </span>

                    <div className="flex items-center gap-2">
                      {!isCompleted && act.estado === 'pendiente' && (
                        <button
                          onClick={() => updateActividadEstado(act.id, 'en_progreso')}
                          className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs"
                        >
                          Iniciar Labor
                        </button>
                      )}

                      {!isCompleted && (
                        <button
                          onClick={() => completarActividad(act.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Marcar Completada
                        </button>
                      )}

                      {isCompleted && (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700">
                          <CheckCircle className="w-4 h-4" />
                          Completada (Insumo consumido)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Columna Lateral: Calendario General de Cultivo & Recomendaciones */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
              <Calendar className="w-4 h-4 text-teal-600" />
              Calendario General de Cultivo
            </h3>
            <div className="mt-4 space-y-3">
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 text-xs">
                <span className="font-bold text-blue-900">Lunes y Jueves: Fertirriego</span>
                <p className="text-blue-700 text-[11px] mt-0.5">
                  Aplicación de Nitrato de Calcio y Microelementos. Monitorear pH entre 5.8 y 6.2.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-purple-50 border border-purple-100 text-xs">
                <span className="font-bold text-purple-900">Martes: Monitoreo Fitosanitario</span>
                <p className="text-purple-700 text-[11px] mt-0.5">
                  Revisión minuciosa en envés de hojas para detección oportuna de trips, ácaros o botrytis.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-rose-50 border border-rose-100 text-xs">
                <span className="font-bold text-rose-900">Miércoles, Viernes y Sábado: Corte Matutino</span>
                <p className="text-rose-700 text-[11px] mt-0.5">
                  Cosecha entre 6:00 AM y 9:30 AM con calibre de punto de arroz a estrella según la variedad.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-100 text-xs">
                <span className="font-bold text-amber-900">Diario: Ventilación y Mallas</span>
                <p className="text-amber-700 text-[11px] mt-0.5">
                  Apertura de cortinas y control de humedad relativa en naves de invernadero.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Programar Tarea */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 text-left my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Programar Actividad de Cultivo</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 rounded text-slate-400 hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateTask} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Título de la Actividad</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Riego con solución nutritiva en Lote 2"
                  value={newTask.titulo}
                  onChange={(e) => setNewTask({ ...newTask, titulo: e.target.value })}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tipo de Labor</label>
                  <select
                    value={newTask.tipo}
                    onChange={(e) => setNewTask({ ...newTask, tipo: e.target.value as TipoActividad })}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="riego">Riego / Fertirriego</option>
                    <option value="fumigacion">Fumigación / Fitosanitario</option>
                    <option value="poda">Poda</option>
                    <option value="desbotone">Desbotone</option>
                    <option value="abonado">Abonado al suelo</option>
                    <option value="cosecha">Corte / Cosecha</option>
                    <option value="mantenimiento">Mantenimiento de nave</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Zona / Invernadero</label>
                  <select
                    value={newTask.zona}
                    onChange={(e) => setNewTask({ ...newTask, zona: e.target.value })}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="Invernadero A">Invernadero A</option>
                    <option value="Invernadero B">Invernadero B</option>
                    <option value="Invernadero C">Invernadero C</option>
                    <option value="Lote 1 (Invernadero A)">Lote 1</option>
                    <option value="Lote 2 (Invernadero B)">Lote 2</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Fecha Programada</label>
                  <input
                    type="date"
                    required
                    value={newTask.fechaProgramada}
                    onChange={(e) => setNewTask({ ...newTask, fechaProgramada: e.target.value })}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Responsable / Asignado</label>
                  <input
                    type="text"
                    required
                    value={newTask.asignadoA}
                    onChange={(e) => setNewTask({ ...newTask, asignadoA: e.target.value })}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              {/* Insumo a descontar automáticamente */}
              <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 space-y-2">
                <span className="text-xs font-bold text-teal-900 block">
                  Consumo Automático de Insumos (Opcional)
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] text-teal-800 mb-1">Insumo Utilizado</label>
                    <select
                      value={newTask.insumoRequeridoId}
                      onChange={(e) => setNewTask({ ...newTask, insumoRequeridoId: e.target.value })}
                      className="w-full text-xs p-2 rounded-lg border border-teal-300 bg-white"
                    >
                      <option value="">Ninguno / Sin insumo</option>
                      {insumos.map((i) => (
                        <option key={i.id} value={i.id}>
                          {i.nombre} ({i.cantidad} {i.unidad})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] text-teal-800 mb-1">Cantidad a Descontar</label>
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      placeholder="0"
                      value={newTask.insumoCantidadRequerida || ''}
                      onChange={(e) => setNewTask({ ...newTask, insumoCantidadRequerida: Number(e.target.value) })}
                      className="w-full text-xs p-2 rounded-lg border border-teal-300 bg-white"
                    />
                  </div>
                </div>
                <p className="text-[10px] text-teal-700">
                  El sistema restará esta cantidad del inventario en cuanto se marque la labor como completada.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Instrucciones / Notas</label>
                <textarea
                  rows={2}
                  value={newTask.notas}
                  onChange={(e) => setNewTask({ ...newTask, notas: e.target.value })}
                  placeholder="Dosis, pH objetivo, precauciones de seguridad..."
                  className="w-full text-xs p-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="mt-5 flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold"
                >
                  Agendar Tarea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
