import React, { useState } from 'react';
import {
  Flower2,
  Boxes,
  Plus,
  AlertTriangle,
  Search,
  CheckCircle2,
  X,
  Package,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CalidadRosa, Insumo, InsumoCategoria, VariedadRosa } from '../types';

export const InventariosModule: React.FC = () => {
  const {
    variedades,
    insumos,
    proveedores,
    addVariedadRosa,
    updateVariedadRosa,
    addInsumo,
    updateInsumo,
    deleteInsumo,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'rosas' | 'insumos'>('rosas');
  const [searchTerm, setSearchTerm] = useState('');
  const [calidadFilter, setCalidadFilter] = useState<string>('all');
  const [insumoCatFilter, setInsumoCatFilter] = useState<string>('all');

  // Modal states
  const [showAddRosaModal, setShowAddRosaModal] = useState(false);
  const [showAddInsumoModal, setShowAddInsumoModal] = useState(false);

  // Form states for new Rose
  const [newRosa, setNewRosa] = useState({
    nombre: '',
    color: '',
    colorHex: '#be123c',
    calidad: 'Exportación' as CalidadRosa,
    longitud: '70cm',
    precioTalloMayoreo: 12,
    precioTalloMenudeo: 18,
    precioDocena: 190,
    precioGruesa: 1950,
    stockActualTallos: 200,
    stockMinimo: 150,
  });

  // Form states for new Insumo
  const [newInsumo, setNewInsumo] = useState({
    nombre: '',
    categoria: 'fertilizante' as InsumoCategoria,
    cantidad: 50,
    unidad: 'kg' as Insumo['unidad'],
    stockMinimo: 20,
    costoUnitario: 45,
    proveedorId: proveedores[0]?.id || '',
  });

  // Filters
  const filteredRosas = variedades.filter((v) => {
    const matchesSearch =
      v.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.color.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCalidad = calidadFilter === 'all' || v.calidad === calidadFilter;
    return matchesSearch && matchesCalidad;
  });

  const filteredInsumos = insumos.filter((i) => {
    const matchesSearch = i.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = insumoCatFilter === 'all' || i.categoria === insumoCatFilter;
    return matchesSearch && matchesCat;
  });

  const lowStockRosasCount = variedades.filter((v) => v.stockActualTallos <= v.stockMinimo).length;
  const lowStockInsumosCount = insumos.filter((i) => i.cantidad <= i.stockMinimo).length;

  const handleCreateRosa = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRosa.nombre.trim()) return;
    addVariedadRosa({
      ...newRosa,
      stockActualTallos: Number(newRosa.stockActualTallos),
      stockMinimo: Number(newRosa.stockMinimo),
      precioTalloMayoreo: Number(newRosa.precioTalloMayoreo),
      precioTalloMenudeo: Number(newRosa.precioTalloMenudeo),
      precioDocena: Number(newRosa.precioDocena),
      precioGruesa: Number(newRosa.precioGruesa),
    });
    setShowAddRosaModal(false);
    setNewRosa({
      nombre: '',
      color: '',
      colorHex: '#be123c',
      calidad: 'Exportación',
      longitud: '70cm',
      precioTalloMayoreo: 12,
      precioTalloMenudeo: 18,
      precioDocena: 190,
      precioGruesa: 1950,
      stockActualTallos: 200,
      stockMinimo: 150,
    });
  };

  const handleCreateInsumo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInsumo.nombre.trim()) return;
    addInsumo({
      ...newInsumo,
      cantidad: Number(newInsumo.cantidad),
      stockMinimo: Number(newInsumo.stockMinimo),
      costoUnitario: Number(newInsumo.costoUnitario),
    });
    setShowAddInsumoModal(false);
    setNewInsumo({
      nombre: '',
      categoria: 'fertilizante',
      cantidad: 50,
      unidad: 'kg',
      stockMinimo: 20,
      costoUnitario: 45,
      proveedorId: proveedores[0]?.id || '',
    });
  };

  return (
    <div className="space-y-6">
      {/* Encabezado del Módulo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider">
            Almacén & Existencias
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
            Módulo de Inventarios
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Control de stock de rosas clasificadas y registro de materiales e insumos de cultivo.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'rosas' ? (
            <button
              onClick={() => setShowAddRosaModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition"
            >
              <Plus className="w-4 h-4" />
              Nueva Variedad / Calidad
            </button>
          ) : (
            <button
              onClick={() => setShowAddInsumoModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition"
            >
              <Plus className="w-4 h-4" />
              Nuevo Insumo
            </button>
          )}
        </div>
      </div>

      {/* Tabs Selector: Rosas vs Insumos con contadores */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setActiveTab('rosas')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition ${
            activeTab === 'rosas'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Flower2 className="w-4 h-4" />
          <span>Stock de Rosas ({variedades.length})</span>
          {lowStockRosasCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-rose-200 text-rose-900 text-[10px] font-black">
              {lowStockRosasCount} bajo mín.
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('insumos')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition ${
            activeTab === 'insumos'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Boxes className="w-4 h-4" />
          <span>Insumos y Materiales ({insumos.length})</span>
          {lowStockInsumosCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-amber-200 text-amber-900 text-[10px] font-black">
              {lowStockInsumosCount} bajo mín.
            </span>
          )}
        </button>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder={activeTab === 'rosas' ? 'Buscar rosa por nombre o color...' : 'Buscar insumo por nombre...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        {activeTab === 'rosas' ? (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Calidad:</span>
            <select
              value={calidadFilter}
              onChange={(e) => setCalidadFilter(e.target.value)}
              className="text-xs rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
            >
              <option value="all">Todas las calidades</option>
              <option value="Exportación">Exportación</option>
              <option value="Nacional">Nacional</option>
              <option value="Botones">Botones</option>
              <option value="Rosas Abiertas">Rosas Abiertas</option>
            </select>
          </div>
        ) : (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Categoría:</span>
            <select
              value={insumoCatFilter}
              onChange={(e) => setInsumoCatFilter(e.target.value)}
              className="text-xs rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              <option value="all">Todas las categorías</option>
              <option value="fertilizante">Fertilizantes</option>
              <option value="pesticida">Pesticidas / Fitosanitarios</option>
              <option value="empaque">Empaques / Cajas</option>
              <option value="sustrato">Sustratos / Suelo</option>
              <option value="herramientas">Herramientas</option>
              <option value="otro">Otros</option>
            </select>
          </div>
        )}
      </div>

      {/* Contenido según Tab */}
      {activeTab === 'rosas' ? (
        /* TAB 1: STOCK DE ROSAS */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRosas.length === 0 ? (
            <div className="col-span-full p-8 text-center bg-white rounded-2xl border border-slate-200">
              <Flower2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">No se encontraron variedades de rosas.</p>
              <p className="text-xs text-slate-500">Agrega una nueva variedad o modifica los filtros.</p>
            </div>
          ) : (
            filteredRosas.map((v) => {
              const isLow = v.stockActualTallos <= v.stockMinimo;
              return (
                <div
                  key={v.id}
                  className={`p-5 rounded-2xl bg-white border transition shadow-xs flex flex-col justify-between ${
                    isLow ? 'border-rose-300 ring-1 ring-rose-200 bg-rose-50/20' : 'border-slate-200'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-4 h-4 rounded-full border border-black/10 shrink-0"
                          style={{ backgroundColor: v.colorHex }}
                          title={v.color}
                        />
                        <div>
                          <h3 className="text-base font-bold text-slate-900 leading-snug">{v.nombre}</h3>
                          <p className="text-xs text-slate-500">{v.color} • {v.longitud}</p>
                        </div>
                      </div>
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                          v.calidad === 'Exportación'
                            ? 'bg-rose-100 text-rose-800'
                            : v.calidad === 'Nacional'
                            ? 'bg-emerald-100 text-emerald-800'
                            : v.calidad === 'Botones'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        {v.calidad}
                      </span>
                    </div>

                    {/* Stock counter */}
                    <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Stock Disponible</span>
                        <p className={`text-xl font-black ${isLow ? 'text-rose-600' : 'text-slate-900'}`}>
                          {v.stockActualTallos.toLocaleString()}{' '}
                          <span className="text-xs font-medium text-slate-500">tallos</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-medium text-slate-500">Mínimo sugerido</span>
                        <p className="text-xs font-bold text-slate-700">{v.stockMinimo} tallos</p>
                      </div>
                    </div>

                    {isLow && (
                      <div className="mt-2 flex items-center gap-1.5 text-xs text-rose-700 font-semibold">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Alerta: Stock por debajo del umbral mínimo</span>
                      </div>
                    )}

                    {/* Pricing grid */}
                    <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 rounded-lg bg-slate-50">
                        <span className="text-[10px] text-slate-500">Tallo Mayoreo:</span>
                        <p className="font-bold text-slate-800">${v.precioTalloMayoreo.toFixed(2)}</p>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-50">
                        <span className="text-[10px] text-slate-500">Tallo Menudeo:</span>
                        <p className="font-bold text-slate-800">${v.precioTalloMenudeo.toFixed(2)}</p>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-50">
                        <span className="text-[10px] text-slate-500">Docena (12):</span>
                        <p className="font-bold text-rose-700">${v.precioDocena.toFixed(2)}</p>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-50">
                        <span className="text-[10px] text-slate-500">Gruesa (144):</span>
                        <p className="font-bold text-slate-800">${v.precioGruesa.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-500">Equivale a ~{Math.floor(v.stockActualTallos / 12)} docenas</span>
                    <button
                      onClick={() => {
                        const newStock = prompt(`Actualizar stock para ${v.nombre}:`, String(v.stockActualTallos));
                        if (newStock !== null && !isNaN(Number(newStock))) {
                          updateVariedadRosa(v.id, { stockActualTallos: Number(newStock) });
                        }
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold"
                    >
                      Ajustar Stock
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* TAB 2: INSUMOS Y MATERIALES */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Insumo / Material</th>
                  <th className="py-3 px-4">Categoría</th>
                  <th className="py-3 px-4">Existencia Actual</th>
                  <th className="py-3 px-4">Stock Mínimo</th>
                  <th className="py-3 px-4">Costo Unit.</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInsumos.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-500">
                      No hay insumos registrados. Registra el primero arriba.
                    </td>
                  </tr>
                ) : (
                  filteredInsumos.map((item) => {
                    const isLow = item.cantidad <= item.stockMinimo;
                    return (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          <div className="flex items-center gap-2">
                            <Package className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>{item.nombre}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 capitalize text-slate-600">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                            {item.categoria}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`font-black text-sm ${isLow ? 'text-amber-700' : 'text-slate-900'}`}>
                            {item.cantidad} {item.unidad}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-500">
                          {item.stockMinimo} {item.unidad}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-800">
                          ${item.costoUnitario.toFixed(2)}
                        </td>
                        <td className="py-3.5 px-4">
                          {isLow ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px]">
                              <AlertTriangle className="w-3 h-3" />
                              Bajo Mínimo
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                              <CheckCircle2 className="w-3 h-3" />
                              Adecuado
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                const newQty = prompt(`Nueva cantidad para ${item.nombre} (${item.unidad}):`, String(item.cantidad));
                                if (newQty !== null && !isNaN(Number(newQty))) {
                                  updateInsumo(item.id, { cantidad: Number(newQty) });
                                }
                              }}
                              className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                            >
                              Ajustar
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`¿Eliminar insumo ${item.nombre}?`)) {
                                  deleteInsumo(item.id);
                                }
                              }}
                              className="p-1 rounded text-slate-400 hover:text-rose-600 transition"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal para Crear Variedad de Rosa */}
      {showAddRosaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 text-left my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Agregar Variedad / Calidad de Rosa</h3>
              <button onClick={() => setShowAddRosaModal(false)} className="p-1 rounded text-slate-400 hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateRosa} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre de Variedad</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Freedom, Mondial, Explorer..."
                  value={newRosa.nombre}
                  onChange={(e) => setNewRosa({ ...newRosa, nombre: e.target.value })}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Color Descriptivo</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Rojo Carmesí"
                    value={newRosa.color}
                    onChange={(e) => setNewRosa({ ...newRosa, color: e.target.value })}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Color Muestra</label>
                  <input
                    type="color"
                    value={newRosa.colorHex}
                    onChange={(e) => setNewRosa({ ...newRosa, colorHex: e.target.value })}
                    className="w-full h-8 rounded-lg cursor-pointer border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Calidad</label>
                  <select
                    value={newRosa.calidad}
                    onChange={(e) => setNewRosa({ ...newRosa, calidad: e.target.value as CalidadRosa })}
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
                  <input
                    type="text"
                    value={newRosa.longitud}
                    onChange={(e) => setNewRosa({ ...newRosa, longitud: e.target.value })}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Precio Tallo Menudeo ($)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={newRosa.precioTalloMenudeo}
                    onChange={(e) => setNewRosa({ ...newRosa, precioTalloMenudeo: Number(e.target.value) })}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Precio Docena ($)</label>
                  <input
                    type="number"
                    step="1"
                    value={newRosa.precioDocena}
                    onChange={(e) => setNewRosa({ ...newRosa, precioDocena: Number(e.target.value) })}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Stock Inicial (Tallos)</label>
                  <input
                    type="number"
                    value={newRosa.stockActualTallos}
                    onChange={(e) => setNewRosa({ ...newRosa, stockActualTallos: Number(e.target.value) })}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Stock Mínimo Alerta</label>
                  <input
                    type="number"
                    value={newRosa.stockMinimo}
                    onChange={(e) => setNewRosa({ ...newRosa, stockMinimo: Number(e.target.value) })}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div className="mt-5 flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddRosaModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
                >
                  Guardar Variedad
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para Crear Insumo */}
      {showAddInsumoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 text-left my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Registrar Insumo de Invernadero</h3>
              <button onClick={() => setShowAddInsumoModal(false)} className="p-1 rounded text-slate-400 hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateInsumo} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre del Insumo / Material</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Fertilizante Soluble Nitrato de Calcio"
                  value={newInsumo.nombre}
                  onChange={(e) => setNewInsumo({ ...newInsumo, nombre: e.target.value })}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Categoría</label>
                  <select
                    value={newInsumo.categoria}
                    onChange={(e) => setNewInsumo({ ...newInsumo, categoria: e.target.value as InsumoCategoria })}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="fertilizante">Fertilizante</option>
                    <option value="pesticida">Pesticida / Fitosanitario</option>
                    <option value="empaque">Empaque / Capuchones</option>
                    <option value="sustrato">Sustrato / Suelo</option>
                    <option value="herramientas">Herramientas</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Unidad de Medida</label>
                  <select
                    value={newInsumo.unidad}
                    onChange={(e) => setNewInsumo({ ...newInsumo, unidad: e.target.value as Insumo['unidad'] })}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="kg">kg (Kilogramos)</option>
                    <option value="L">L (Litros)</option>
                    <option value="piezas">piezas</option>
                    <option value="cajas">cajas</option>
                    <option value="rollos">rollos</option>
                    <option value="bultos">bultos</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Cantidad Inicial</label>
                  <input
                    type="number"
                    value={newInsumo.cantidad}
                    onChange={(e) => setNewInsumo({ ...newInsumo, cantidad: Number(e.target.value) })}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Stock Mínimo</label>
                  <input
                    type="number"
                    value={newInsumo.stockMinimo}
                    onChange={(e) => setNewInsumo({ ...newInsumo, stockMinimo: Number(e.target.value) })}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Costo Unitario ($)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={newInsumo.costoUnitario}
                    onChange={(e) => setNewInsumo({ ...newInsumo, costoUnitario: Number(e.target.value) })}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div className="mt-5 flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddInsumoModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold"
                >
                  Guardar Insumo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
