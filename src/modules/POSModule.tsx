import React, { useState } from 'react';
import {
  CreditCard,
  ShoppingCart,
  Flower2,
  Plus,
  Minus,
  Trash2,
  Receipt,
  User,
  CheckCircle,
  Printer,
  X,
  Search,
  DollarSign,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ItemVenta, Venta, VariedadRosa } from '../types';

export const POSModule: React.FC = () => {
  const {
    variedades,
    clientes,
    addCliente,
    registrarVenta,
    ventas,
  } = useApp();

  // Search & Filters in catalog
  const [catalogSearch, setCatalogSearch] = useState('');
  const [selectedCalidad, setSelectedCalidad] = useState<string>('all');

  // Cart state
  const [cartItems, setCartItems] = useState<ItemVenta[]>([]);
  const [selectedClienteId, setSelectedClienteId] = useState<string>(clientes[0]?.id || '');
  const [nombreClienteManual, setNombreClienteManual] = useState('Cliente de Mostrador');
  const [tipoCliente, setTipoCliente] = useState<string>('menudeo_mostrador');
  const [metodoPago, setMetodoPago] = useState<'efectivo' | 'transferencia' | 'tarjeta'>('efectivo');
  const [descuento, setDescuento] = useState<number>(0);

  // New client inline modal
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [newClientType, setNewClientType] = useState<'florería' | 'mayorista' | 'evento' | 'menudeo_mostrador'>('florería');

  // Completed sale receipt modal
  const [completedSale, setCompletedSale] = useState<Venta | null>(null);

  // Filter available roses
  const filteredRoses = variedades.filter((v) => {
    const matchesSearch =
      v.nombre.toLowerCase().includes(catalogSearch.toLowerCase()) ||
      v.color.toLowerCase().includes(catalogSearch.toLowerCase());
    const matchesCalidad = selectedCalidad === 'all' || v.calidad === selectedCalidad;
    return matchesSearch && matchesCalidad;
  });

  // Presentation multiplier and price logic
  const handleAddToCart = (
    rosa: VariedadRosa,
    tipoPresentacion: 'tallo_suelto' | 'docena' | 'gruesa' | 'ramo_especial'
  ) => {
    let stemsPerUnit = 1;
    let unitPrice = rosa.precioTalloMenudeo;

    if (tipoPresentacion === 'docena') {
      stemsPerUnit = 12;
      unitPrice = rosa.precioDocena;
    } else if (tipoPresentacion === 'gruesa') {
      stemsPerUnit = 144;
      unitPrice = rosa.precioGruesa;
    } else if (tipoPresentacion === 'ramo_especial') {
      stemsPerUnit = 24; // Ramo especial de 2 docenas
      unitPrice = rosa.precioDocena * 2 * 0.95; // 5% bundle discount
    } else if (tipoPresentacion === 'tallo_suelto' && tipoCliente === 'mayorista') {
      unitPrice = rosa.precioTalloMayoreo;
    }

    // Check available stock
    const alreadyInCartStems = cartItems
      .filter((i) => i.variedadId === rosa.id)
      .reduce((acc, i) => acc + i.tallosTotales, 0);

    if (alreadyInCartStems + stemsPerUnit > rosa.stockActualTallos) {
      alert(`Stock insuficiente de ${rosa.nombre}. Disponibles: ${rosa.stockActualTallos} tallos.`);
      return;
    }

    setCartItems((prev) => {
      const existing = prev.find(
        (i) => i.variedadId === rosa.id && i.tipoPresentacion === tipoPresentacion
      );
      if (existing) {
        return prev.map((item) => {
          if (item.variedadId === rosa.id && item.tipoPresentacion === tipoPresentacion) {
            const newQty = item.cantidad + 1;
            return {
              ...item,
              cantidad: newQty,
              tallosTotales: newQty * stemsPerUnit,
              subtotal: Number((newQty * unitPrice).toFixed(2)),
            };
          }
          return item;
        });
      } else {
        const newItem: ItemVenta = {
          variedadId: rosa.id,
          nombreVariedad: rosa.nombre,
          calidad: rosa.calidad,
          tipoPresentacion,
          cantidad: 1,
          tallosTotales: stemsPerUnit,
          precioUnitario: unitPrice,
          subtotal: unitPrice,
        };
        return [...prev, newItem];
      }
    });
  };

  const handleUpdateCartQty = (index: number, change: number) => {
    setCartItems((prev) => {
      return prev
        .map((item, i) => {
          if (i === index) {
            const newQty = item.cantidad + change;
            if (newQty <= 0) return null;
            const stemsPerUnit = item.tallosTotales / item.cantidad;
            return {
              ...item,
              cantidad: newQty,
              tallosTotales: newQty * stemsPerUnit,
              subtotal: Number((newQty * item.precioUnitario).toFixed(2)),
            };
          }
          return item;
        })
        .filter(Boolean) as ItemVenta[];
    });
  };

  const handleRemoveFromCart = (index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Cart totals
  const subtotal = cartItems.reduce((acc, item) => acc + item.subtotal, 0);
  const total = Math.max(0, Number((subtotal - descuento).toFixed(2)));

  const handleProcessSale = () => {
    if (cartItems.length === 0) return;

    let finalClienteName = nombreClienteManual;
    if (selectedClienteId) {
      const c = clientes.find((cli) => cli.id === selectedClienteId);
      if (c) finalClienteName = c.nombre;
    }

    const saleResult = registrarVenta({
      fecha: new Date().toLocaleString('es-MX'),
      clienteId: selectedClienteId || undefined,
      nombreCliente: finalClienteName,
      tipoCliente,
      items: cartItems,
      subtotal,
      descuento,
      total,
      metodoPago,
      estado: 'pagado',
      atendidoPor: 'Cajero / Punto de Venta',
    });

    setCompletedSale(saleResult);
    setCartItems([]);
    setDescuento(0);
  };

  const handleCreateNewClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName.trim()) return;
    addCliente({
      nombre: newClientName,
      tipo: newClientType,
      telefono: newClientPhone,
      direccion: 'Venta de Invernadero',
    });
    setNombreClienteManual(newClientName);
    setTipoCliente(newClientType);
    setShowAddClientModal(false);
    setNewClientName('');
    setNewClientPhone('');
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 text-[10px] font-black uppercase tracking-wider">
            Paso 4 del Flujo • Punto de Venta
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
            Terminal POS & Mostrador de Rosas
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Selección rápida de paquetes, descuento automático de inventario en tiempo real y emisión de ticket.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            Stock Vinculado en Vivo
          </span>
        </div>
      </div>

      {/* Grid Principal: Catálogo de Rosas (Izquierda) vs Carrito / Cobro (Derecha) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Catálogo de Rosas Disponibles (7 de 12 columnas) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Búsqueda y Filtros de Rosas */}
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full sm:flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Buscar rosa por variedad o color..."
                value={catalogSearch}
                onChange={(e) => setCatalogSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={selectedCalidad}
                onChange={(e) => setSelectedCalidad(e.target.value)}
                className="text-xs rounded-lg border border-slate-300 px-3 py-1.5 bg-white w-full sm:w-auto"
              >
                <option value="all">Todas las calidades</option>
                <option value="Exportación">Exportación</option>
                <option value="Nacional">Nacional</option>
                <option value="Botones">Botones</option>
                <option value="Rosas Abiertas">Rosas Abiertas</option>
              </select>
            </div>
          </div>

          {/* Grid de Rosas para Agregar al Carrito */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {filteredRoses.length === 0 ? (
              <div className="col-span-full p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
                No hay rosas disponibles con ese criterio de búsqueda.
              </div>
            ) : (
              filteredRoses.map((rosa) => {
                const isOutOfStock = rosa.stockActualTallos <= 0;
                return (
                  <div
                    key={rosa.id}
                    className={`p-4 rounded-2xl bg-white border transition shadow-xs flex flex-col justify-between ${
                      isOutOfStock ? 'opacity-60 border-slate-200 bg-slate-50' : 'border-slate-200 hover:border-rose-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
                            style={{ backgroundColor: rosa.colorHex }}
                          />
                          <div>
                            <h4 className="text-sm font-bold text-slate-900 leading-tight">{rosa.nombre}</h4>
                            <p className="text-[11px] text-slate-500">{rosa.color} • {rosa.longitud}</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {rosa.calidad}
                        </span>
                      </div>

                      {/* Stock Badge */}
                      <div className="mt-3 flex items-center justify-between text-xs py-1 px-2 rounded-lg bg-slate-50">
                        <span className="text-slate-500 text-[11px]">Disponible:</span>
                        <span className={`font-black ${isOutOfStock ? 'text-rose-600' : 'text-slate-900'}`}>
                          {rosa.stockActualTallos.toLocaleString()} tallos
                        </span>
                      </div>
                    </div>

                    {/* Botones de Selección Rápida de Paquetes */}
                    <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5">
                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          disabled={isOutOfStock}
                          onClick={() => handleAddToCart(rosa, 'docena')}
                          className="px-2 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 text-[11px] font-bold flex flex-col items-center transition disabled:opacity-40"
                        >
                          <span>+1 Docena (12)</span>
                          <span className="text-[10px] text-rose-600 font-semibold">${rosa.precioDocena}</span>
                        </button>

                        <button
                          disabled={isOutOfStock || rosa.stockActualTallos < 144}
                          onClick={() => handleAddToCart(rosa, 'gruesa')}
                          className="px-2 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold flex flex-col items-center transition disabled:opacity-40"
                        >
                          <span>+1 Gruesa (144)</span>
                          <span className="text-[10px] text-slate-600 font-semibold">${rosa.precioGruesa}</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          disabled={isOutOfStock}
                          onClick={() => handleAddToCart(rosa, 'tallo_suelto')}
                          className="px-2 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-[11px] font-medium transition disabled:opacity-40"
                        >
                          +1 Tallo (${rosa.precioTalloMenudeo})
                        </button>

                        <button
                          disabled={isOutOfStock || rosa.stockActualTallos < 24}
                          onClick={() => handleAddToCart(rosa, 'ramo_especial')}
                          className="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold transition disabled:opacity-40"
                        >
                          +Ramo 24 (${rosa.precioDocena * 2 * 0.95})
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Panel del Carrito de Venta y Cobro (5 de 12 columnas) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
                    <Receipt className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Ticket de Venta Actual</h3>
                    <p className="text-[11px] text-slate-500">{cartItems.length} tipos de producto en carrito</p>
                  </div>
                </div>

                {cartItems.length > 0 && (
                  <button
                    onClick={() => setCartItems([])}
                    className="text-xs text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Vaciar
                  </button>
                )}
              </div>

              {/* Selector de Cliente */}
              <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    Cliente / Destino:
                  </label>
                  <button
                    onClick={() => setShowAddClientModal(true)}
                    className="text-[11px] font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Nuevo Cliente
                  </button>
                </div>

                <select
                  value={selectedClienteId}
                  onChange={(e) => {
                    setSelectedClienteId(e.target.value);
                    const cli = clientes.find((c) => c.id === e.target.value);
                    if (cli) {
                      setNombreClienteManual(cli.nombre);
                      setTipoCliente(cli.tipo);
                    }
                  }}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                >
                  <option value="">Cliente Ocasional / Mostrador</option>
                  {clientes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre} ({c.tipo})
                    </option>
                  ))}
                </select>
              </div>

              {/* Lista de Items en Carrito */}
              <div className="mt-4 space-y-2 max-h-60 overflow-y-auto pr-1">
                {cartItems.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 text-xs">
                    El carrito está vacío. Agrega docenas, gruesas o ramos desde el catálogo.
                  </div>
                ) : (
                  cartItems.map((item, index) => (
                    <div
                      key={`${item.variedadId}-${item.tipoPresentacion}-${index}`}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                    >
                      <div>
                        <p className="font-bold text-slate-900">{item.nombreVariedad}</p>
                        <p className="text-[10px] text-slate-500">
                          {item.tipoPresentacion.replace('_', ' ')} • {item.tallosTotales} tallos totales
                        </p>
                        <p className="text-[11px] font-semibold text-rose-700">
                          ${item.subtotal.toFixed(2)} (${item.precioUnitario} c/u)
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-0.5">
                          <button
                            onClick={() => handleUpdateCartQty(index, -1)}
                            className="p-1 rounded text-slate-600 hover:bg-slate-100"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 font-bold text-slate-800">{item.cantidad}</span>
                          <button
                            onClick={() => handleUpdateCartQty(index, 1)}
                            className="p-1 rounded text-slate-600 hover:bg-slate-100"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => handleRemoveFromCart(index)}
                          className="p-1 rounded text-slate-400 hover:text-rose-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Método de Pago */}
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                <span className="text-xs font-bold text-slate-700 block">Método de Pago:</span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setMetodoPago('efectivo')}
                    className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition ${
                      metodoPago === 'efectivo'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-400'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Efectivo
                  </button>
                  <button
                    onClick={() => setMetodoPago('transferencia')}
                    className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition ${
                      metodoPago === 'transferencia'
                        ? 'bg-blue-50 text-blue-800 border-blue-400'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Transferencia
                  </button>
                  <button
                    onClick={() => setMetodoPago('tarjeta')}
                    className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition ${
                      metodoPago === 'tarjeta'
                        ? 'bg-purple-50 text-purple-800 border-purple-400'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Tarjeta
                  </button>
                </div>
              </div>

              {/* Descuento opcional */}
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-slate-600">Descuento aplicado ($):</span>
                <input
                  type="number"
                  min="0"
                  step="10"
                  value={descuento || ''}
                  placeholder="0"
                  onChange={(e) => setDescuento(Number(e.target.value))}
                  className="w-24 p-1 rounded-lg border border-slate-300 text-right text-xs"
                />
              </div>

              {/* Resumen Total */}
              <div className="mt-4 p-4 rounded-xl bg-slate-900 text-white space-y-1.5">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Subtotal:</span>
                  <span>${subtotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
                </div>
                {descuento > 0 && (
                  <div className="flex justify-between text-xs text-rose-400 font-semibold">
                    <span>Descuento:</span>
                    <span>-${descuento.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-black text-white pt-2 border-t border-slate-800">
                  <span>Total a Cobrar:</span>
                  <span className="text-lg text-emerald-400">
                    ${total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>

            {/* Botón de Cobro y Salida */}
            <button
              disabled={cartItems.length === 0}
              onClick={handleProcessSale}
              className="mt-4 w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-sm shadow-md transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <CreditCard className="w-5 h-5" />
              <span>Cobrar y Generar Nota de Venta</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal Ticket de Venta Emitido */}
      {completedSale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 text-left my-8 font-mono text-xs">
            <div className="text-center pb-3 border-b border-dashed border-slate-300 space-y-1">
              <img src="/icon.svg" alt="Invernadero Rosas" className="w-10 h-10 mx-auto" />
              <h2 className="text-sm font-black uppercase text-slate-900">Invernadero Rosas</h2>
              <p className="text-[10px] text-slate-500">Producción & Venta de Rosas Finas</p>
              <p className="text-[10px] text-slate-600 font-bold">FOLIO: {completedSale.folio}</p>
              <p className="text-[10px] text-slate-500">{completedSale.fecha}</p>
            </div>

            <div className="py-3 border-b border-dashed border-slate-300 space-y-1">
              <p><strong>Cliente:</strong> {completedSale.nombreCliente}</p>
              <p><strong>Pago:</strong> {completedSale.metodoPago.toUpperCase()}</p>
              <p><strong>Atendió:</strong> {completedSale.atendidoPor}</p>
            </div>

            <div className="py-3 border-b border-dashed border-slate-300 space-y-2">
              {completedSale.items.map((it, idx) => (
                <div key={idx} className="flex justify-between">
                  <div>
                    <p className="font-bold">{it.cantidad}x {it.nombreVariedad} ({it.tipoPresentacion})</p>
                    <p className="text-[10px] text-slate-500">{it.tallosTotales} tallos</p>
                  </div>
                  <span className="font-bold">${it.subtotal.toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="py-3 space-y-1 text-right">
              <p>Subtotal: ${completedSale.subtotal.toFixed(2)}</p>
              {completedSale.descuento > 0 && <p className="text-rose-600">Descuento: -${completedSale.descuento.toFixed(2)}</p>}
              <p className="text-base font-black text-slate-900 pt-1 border-t border-slate-200">
                TOTAL: ${completedSale.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
              </p>
            </div>

            <div className="text-center pt-3 border-t border-dashed border-slate-300 text-[10px] text-slate-500">
              ¡Gracias por su compra en Invernadero Rosas!
            </div>

            <div className="mt-4 flex gap-2 font-sans">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <Printer className="w-4 h-4" /> Imprimir
              </button>
              <button
                onClick={() => setCompletedSale(null)}
                className="flex-1 py-2 rounded-xl bg-slate-100 text-slate-800 font-bold text-xs hover:bg-slate-200"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Registrar Cliente */}
      {showAddClientModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 text-left my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Registrar Cliente Frecuente</h3>
              <button onClick={() => setShowAddClientModal(false)} className="p-1 rounded text-slate-400 hover:bg-slate-100">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateNewClient} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre o Florería</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Florería San Ángel"
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tipo de Cliente</label>
                <select
                  value={newClientType}
                  onChange={(e) => setNewClientType(e.target.value as any)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                >
                  <option value="florería">Florería</option>
                  <option value="mayorista">Mayorista / Distribuidor</option>
                  <option value="evento">Organizador de Eventos / Bodas</option>
                  <option value="menudeo_mostrador">Cliente de Mostrador</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Teléfono / WhatsApp</label>
                <input
                  type="text"
                  placeholder="+52 55 ..."
                  value={newClientPhone}
                  onChange={(e) => setNewClientPhone(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="mt-5 flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddClientModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
                >
                  Guardar y Seleccionar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
