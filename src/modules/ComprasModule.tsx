import React, { useState } from 'react';
import {
  ShoppingCart,
  Users,
  Plus,
  Search,
  CheckCircle2,
  Calendar,
  DollarSign,
  Package,
  Building,
  Phone,
  Mail,
  MapPin,
  X,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ComprasModule: React.FC = () => {
  const {
    compras,
    proveedores,
    insumos,
    addCompra,
    addProveedor,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'compras' | 'proveedores'>('compras');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [showAddCompraModal, setShowAddCompraModal] = useState(false);
  const [showAddProveedorModal, setShowAddProveedorModal] = useState(false);

  // New Compra Form state
  const [newCompra, setNewCompra] = useState({
    fecha: new Date().toISOString().split('T')[0],
    proveedorId: proveedores[0]?.id || '',
    insumoId: insumos[0]?.id || '',
    cantidad: 20,
    costoUnitario: 45,
    notas: 'Resurtido para labores del invernadero',
    estado: 'completado' as 'completado' | 'pendiente',
  });

  // New Proveedor Form state
  const [newProv, setNewProv] = useState({
    nombre: '',
    empresa: '',
    telefono: '',
    email: '',
    categoriasInsumos: ['fertilizante'],
    direccion: '',
  });

  const totalSpent = compras.reduce((acc, c) => acc + c.total, 0);

  const handleCreateCompra = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedInsumo = insumos.find((i) => i.id === newCompra.insumoId);
    const nombreInsumo = selectedInsumo ? selectedInsumo.nombre : 'Insumo Variado';
    const unidad = selectedInsumo ? selectedInsumo.unidad : 'kg';
    const total = Number((newCompra.cantidad * newCompra.costoUnitario).toFixed(2));

    addCompra({
      fecha: newCompra.fecha,
      proveedorId: newCompra.proveedorId,
      insumoId: newCompra.insumoId,
      nombreInsumo,
      cantidad: Number(newCompra.cantidad),
      unidad,
      costoUnitario: Number(newCompra.costoUnitario),
      total,
      notas: newCompra.notas,
      estado: newCompra.estado,
    });

    setShowAddCompraModal(false);
    setNewCompra({
      fecha: new Date().toISOString().split('T')[0],
      proveedorId: proveedores[0]?.id || '',
      insumoId: insumos[0]?.id || '',
      cantidad: 20,
      costoUnitario: 45,
      notas: 'Resurtido para labores del invernadero',
      estado: 'completado',
    });
  };

  const handleCreateProveedor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProv.empresa.trim()) return;
    addProveedor(newProv);
    setShowAddProveedorModal(false);
    setNewProv({
      nombre: '',
      empresa: '',
      telefono: '',
      email: '',
      categoriasInsumos: ['fertilizante'],
      direccion: '',
    });
  };

  const filteredCompras = compras.filter((c) =>
    c.folio.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.nombreInsumo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProveedores = proveedores.filter((p) =>
    p.empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[10px] font-black uppercase tracking-wider">
            Paso 1 del Flujo • Abastecimiento
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
            Módulo de Compras & Proveedores
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Entrada de fertilizantes, plaguicidas y empaques. Cada compra actualiza de forma automática el stock de insumos.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'compras' ? (
            <button
              onClick={() => setShowAddCompraModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition"
            >
              <Plus className="w-4 h-4" />
              Registrar Compra / Insumo
            </button>
          ) : (
            <button
              onClick={() => setShowAddProveedorModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs shadow-xs transition"
            >
              <Plus className="w-4 h-4" />
              Nuevo Proveedor
            </button>
          )}
        </div>
      </div>

      {/* KPI Resumen de Compras */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase">Gasto Acumulado en Insumos</span>
          <p className="text-2xl font-black text-slate-900 mt-1">
            ${totalSpent.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Inversión en nutrición y empaques</p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase">Órdenes de Compra</span>
          <p className="text-2xl font-black text-blue-700 mt-1">{compras.length}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Todas ingresadas al inventario de materiales</p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase">Proveedores Activos</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{proveedores.length}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Agroquímicos, empaques y semillas</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setActiveTab('compras')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition ${
            activeTab === 'compras'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Historial de Órdenes ({compras.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('proveedores')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition ${
            activeTab === 'proveedores'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Directorio de Proveedores ({proveedores.length})</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder={activeTab === 'compras' ? 'Buscar orden o insumo...' : 'Buscar proveedor o empresa...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Main Content */}
      {activeTab === 'compras' ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Folio / Fecha</th>
                  <th className="py-3 px-4">Insumo Comprado</th>
                  <th className="py-3 px-4">Proveedor</th>
                  <th className="py-3 px-4">Cantidad</th>
                  <th className="py-3 px-4">Costo Unit.</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Estatus Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCompras.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-500">
                      No se encontraron órdenes de compra registradas.
                    </td>
                  </tr>
                ) : (
                  filteredCompras.map((c) => {
                    const prov = proveedores.find((p) => p.id === c.proveedorId);
                    return (
                      <tr key={c.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3 px-4">
                          <p className="font-bold text-blue-900">{c.folio}</p>
                          <p className="text-[11px] text-slate-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {c.fecha}
                          </p>
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-bold text-slate-900">{c.nombreInsumo}</p>
                          {c.notas && <p className="text-[11px] text-slate-500 line-clamp-1">{c.notas}</p>}
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          {prov ? prov.empresa : 'Proveedor Local'}
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-800">
                          +{c.cantidad} {c.unidad}
                        </td>
                        <td className="py-3 px-4 text-slate-700">
                          ${c.costoUnitario.toFixed(2)}
                        </td>
                        <td className="py-3 px-4 font-black text-slate-900">
                          ${c.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                            <CheckCircle2 className="w-3 h-3" />
                            Sumado a Stock
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Directorio de Proveedores */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProveedores.length === 0 ? (
            <div className="col-span-full p-8 text-center bg-white rounded-2xl border border-slate-200">
              <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">No hay proveedores registrados.</p>
            </div>
          ) : (
            filteredProveedores.map((p) => (
              <div key={p.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
                      <Building className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 leading-tight">{p.empresa}</h3>
                      <p className="text-xs text-slate-500 font-medium">{p.nombre}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{p.telefono}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{p.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{p.direccion}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-1">
                  {p.categoriasInsumos.map((cat, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold text-[10px] uppercase">
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal Registrar Compra */}
      {showAddCompraModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 text-left my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Registrar Orden de Compra de Insumos</h3>
              <button onClick={() => setShowAddCompraModal(false)} className="p-1 rounded text-slate-400 hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateCompra} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Insumo a Adquirir</label>
                <select
                  value={newCompra.insumoId}
                  onChange={(e) => {
                    const ins = insumos.find((i) => i.id === e.target.value);
                    setNewCompra({
                      ...newCompra,
                      insumoId: e.target.value,
                      costoUnitario: ins ? ins.costoUnitario : newCompra.costoUnitario,
                    });
                  }}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                >
                  {insumos.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.nombre} ({i.cantidad} {i.unidad} en stock)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Proveedor</label>
                <select
                  value={newCompra.proveedorId}
                  onChange={(e) => setNewCompra({ ...newCompra, proveedorId: e.target.value })}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                >
                  {proveedores.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.empresa} - {p.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Cantidad Comprada</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newCompra.cantidad}
                    onChange={(e) => setNewCompra({ ...newCompra, cantidad: Number(e.target.value) })}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Costo Unitario ($)</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={newCompra.costoUnitario}
                    onChange={(e) => setNewCompra({ ...newCompra, costoUnitario: Number(e.target.value) })}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200 text-xs flex items-center justify-between">
                <span className="font-semibold text-blue-900">Total a Pagar:</span>
                <span className="font-black text-sm text-blue-950">
                  ${(newCompra.cantidad * newCompra.costoUnitario).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Notas / Factura / Lote</label>
                <input
                  type="text"
                  value={newCompra.notas}
                  onChange={(e) => setNewCompra({ ...newCompra, notas: e.target.value })}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="mt-5 flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddCompraModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
                >
                  Confirmar Compra e Ingresar a Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Nuevo Proveedor */}
      {showAddProveedorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 text-left my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Registrar Proveedor</h3>
              <button onClick={() => setShowAddProveedorModal(false)} className="p-1 rounded text-slate-400 hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateProveedor} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre de la Empresa</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Invernaderos & Fertilizantes del Centro"
                  value={newProv.empresa}
                  onChange={(e) => setNewProv({ ...newProv, empresa: e.target.value })}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre del Contacto</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Ing. Juan Pérez"
                  value={newProv.nombre}
                  onChange={(e) => setNewProv({ ...newProv, nombre: e.target.value })}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Teléfono</label>
                  <input
                    type="text"
                    value={newProv.telefono}
                    onChange={(e) => setNewProv({ ...newProv, telefono: e.target.value })}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Correo Electrónico</label>
                  <input
                    type="email"
                    value={newProv.email}
                    onChange={(e) => setNewProv({ ...newProv, email: e.target.value })}
                    className="w-full text-xs p-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Dirección / Ubicación</label>
                <input
                  type="text"
                  value={newProv.direccion}
                  onChange={(e) => setNewProv({ ...newProv, direccion: e.target.value })}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="mt-5 flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddProveedorModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold"
                >
                  Guardar Proveedor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
