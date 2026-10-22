import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  Insumo,
  Proveedor,
  Compra,
  Actividad,
  Incidencia,
  Cosecha,
  Merma,
  VariedadRosa,
  Cliente,
  Venta,
  ItemVenta,
  SupabaseSettings,
} from '../types';
import {
  INITIAL_VARIEDADES,
  INITIAL_INSUMOS,
  INITIAL_PROVEEDORES,
  INITIAL_COMPRAS,
  INITIAL_ACTIVIDADES,
  INITIAL_INCIDENCIAS,
  INITIAL_COSECHAS,
  INITIAL_MERMAS,
  INITIAL_CLIENTES,
  INITIAL_VENTAS,
} from '../data/initialData';

interface AppContextType {
  activeRole: UserRole | null;
  setActiveRole: (role: UserRole | null) => void;
  activeModule: string;
  setActiveModule: (mod: string) => void;

  // Data states
  variedades: VariedadRosa[];
  insumos: Insumo[];
  proveedores: Proveedor[];
  compras: Compra[];
  actividades: Actividad[];
  incidencias: Incidencia[];
  cosechas: Cosecha[];
  mermas: Merma[];
  clientes: Cliente[];
  ventas: Venta[];

  // Sample data controls
  isSampleDataSuppressed: boolean;
  clearAllSampleData: () => void;
  restoreSampleData: () => void;

  // Supabase integration state & actions
  supabaseSettings: SupabaseSettings;
  updateSupabaseSettings: (settings: Partial<SupabaseSettings>) => void;
  wipeSupabaseRemoteData: () => Promise<{ success: boolean; message: string }>;

  // Automated workflow actions
  addInsumo: (insumo: Omit<Insumo, 'id' | 'ultimaActualizacion'>) => void;
  updateInsumo: (id: string, insumo: Partial<Insumo>) => void;
  deleteInsumo: (id: string) => void;

  addProveedor: (prov: Omit<Proveedor, 'id'>) => void;
  updateProveedor: (id: string, prov: Partial<Proveedor>) => void;
  deleteProveedor: (id: string) => void;

  addCompra: (compra: Omit<Compra, 'id' | 'folio'>) => void;

  addActividad: (act: Omit<Actividad, 'id' | 'estado'>) => void;
  completarActividad: (id: string, insumoIdUsado?: string, cantidadUsada?: number) => void;
  updateActividadEstado: (id: string, estado: Actividad['estado']) => void;

  addIncidencia: (inc: Omit<Incidencia, 'id' | 'estado'>) => void;
  resolverIncidencia: (id: string) => void;

  registrarCosecha: (cosecha: Omit<Cosecha, 'id' | 'tallosIngresadosStock'>) => void;
  registrarMerma: (merma: Omit<Merma, 'id'>) => void;

  addVariedadRosa: (varData: Omit<VariedadRosa, 'id'>) => void;
  updateVariedadRosa: (id: string, varData: Partial<VariedadRosa>) => void;

  addCliente: (cli: Omit<Cliente, 'id' | 'comprasAcumuladas'>) => void;

  registrarVenta: (venta: Omit<Venta, 'id' | 'folio'>) => Venta;

  // Toast notification
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  ROLE: 'invernadero_active_role',
  SUPPRESS: 'invernadero_suppress_sample_data',
  VARIEDADES: 'invernadero_variedades',
  INSUMOS: 'invernadero_insumos',
  PROVEEDORES: 'invernadero_proveedores',
  COMPRAS: 'invernadero_compras',
  ACTIVIDADES: 'invernadero_actividades',
  INCIDENCIAS: 'invernadero_incidencias',
  COSECHAS: 'invernadero_cosechas',
  MERMAS: 'invernadero_mermas',
  CLIENTES: 'invernadero_clientes',
  VENTAS: 'invernadero_ventas',
  SUPABASE: 'invernadero_supabase_config',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeRole, setActiveRoleState] = useState<UserRole | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ROLE);
    return saved ? (saved as UserRole) : null;
  });

  const [activeModule, setActiveModule] = useState<string>('dashboard');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((cur) => (cur === msg ? null : cur));
    }, 4000);
  };

  const isSuppressedInitial = () => {
    return localStorage.getItem(STORAGE_KEYS.SUPPRESS) === 'true';
  };

  const [isSampleDataSuppressed, setIsSampleDataSuppressed] = useState<boolean>(isSuppressedInitial);

  // Initialize data with local persistence or seed data
  const loadState = <T,>(key: string, defaultData: T[]): T[] => {
    if (isSampleDataSuppressed) {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : [];
    }
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultData;
  };

  const [variedades, setVariedades] = useState<VariedadRosa[]>(() =>
    loadState(STORAGE_KEYS.VARIEDADES, INITIAL_VARIEDADES)
  );
  const [insumos, setInsumos] = useState<Insumo[]>(() =>
    loadState(STORAGE_KEYS.INSUMOS, INITIAL_INSUMOS)
  );
  const [proveedores, setProveedores] = useState<Proveedor[]>(() =>
    loadState(STORAGE_KEYS.PROVEEDORES, INITIAL_PROVEEDORES)
  );
  const [compras, setCompras] = useState<Compra[]>(() =>
    loadState(STORAGE_KEYS.COMPRAS, INITIAL_COMPRAS)
  );
  const [actividades, setActividades] = useState<Actividad[]>(() =>
    loadState(STORAGE_KEYS.ACTIVIDADES, INITIAL_ACTIVIDADES)
  );
  const [incidencias, setIncidencias] = useState<Incidencia[]>(() =>
    loadState(STORAGE_KEYS.INCIDENCIAS, INITIAL_INCIDENCIAS)
  );
  const [cosechas, setCosechas] = useState<Cosecha[]>(() =>
    loadState(STORAGE_KEYS.COSECHAS, INITIAL_COSECHAS)
  );
  const [mermas, setMermas] = useState<Merma[]>(() =>
    loadState(STORAGE_KEYS.MERMAS, INITIAL_MERMAS)
  );
  const [clientes, setClientes] = useState<Cliente[]>(() =>
    loadState(STORAGE_KEYS.CLIENTES, INITIAL_CLIENTES)
  );
  const [ventas, setVentas] = useState<Venta[]>(() =>
    loadState(STORAGE_KEYS.VENTAS, INITIAL_VENTAS)
  );

  const [supabaseSettings, setSupabaseSettings] = useState<SupabaseSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SUPABASE);
    return saved
      ? JSON.parse(saved)
      : {
          url: '',
          anonKey: '',
          isConfigured: false,
        };
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.VARIEDADES, JSON.stringify(variedades));
  }, [variedades]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INSUMOS, JSON.stringify(insumos));
  }, [insumos]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROVEEDORES, JSON.stringify(proveedores));
  }, [proveedores]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COMPRAS, JSON.stringify(compras));
  }, [compras]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACTIVIDADES, JSON.stringify(actividades));
  }, [actividades]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INCIDENCIAS, JSON.stringify(incidencias));
  }, [incidencias]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COSECHAS, JSON.stringify(cosechas));
  }, [cosechas]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MERMAS, JSON.stringify(mermas));
  }, [mermas]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CLIENTES, JSON.stringify(clientes));
  }, [clientes]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.VENTAS, JSON.stringify(ventas));
  }, [ventas]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SUPABASE, JSON.stringify(supabaseSettings));
  }, [supabaseSettings]);

  const setActiveRole = (role: UserRole | null) => {
    setActiveRoleState(role);
    if (role) {
      localStorage.setItem(STORAGE_KEYS.ROLE, role);
      // Auto-set optimal initial module per role
      if (role === 'admin' || role === 'supervisor') {
        setActiveModule('dashboard');
      } else if (role === 'production') {
        setActiveModule('produccion');
      } else if (role === 'sales') {
        setActiveModule('pos');
      }
    } else {
      localStorage.removeItem(STORAGE_KEYS.ROLE);
    }
  };

  // Clear all sample data
  const clearAllSampleData = () => {
    localStorage.setItem(STORAGE_KEYS.SUPPRESS, 'true');
    setIsSampleDataSuppressed(true);
    setVariedades([]);
    setInsumos([]);
    setProveedores([]);
    setCompras([]);
    setActividades([]);
    setIncidencias([]);
    setCosechas([]);
    setMermas([]);
    setClientes([]);
    setVentas([]);
    showToast('Todos los datos de muestra han sido eliminados. El sistema permanecerá en blanco.');
  };

  // Restore sample data
  const restoreSampleData = () => {
    localStorage.removeItem(STORAGE_KEYS.SUPPRESS);
    setIsSampleDataSuppressed(false);
    setVariedades(INITIAL_VARIEDADES);
    setInsumos(INITIAL_INSUMOS);
    setProveedores(INITIAL_PROVEEDORES);
    setCompras(INITIAL_COMPRAS);
    setActividades(INITIAL_ACTIVIDADES);
    setIncidencias(INITIAL_INCIDENCIAS);
    setCosechas(INITIAL_COSECHAS);
    setMermas(INITIAL_MERMAS);
    setClientes(INITIAL_CLIENTES);
    setVentas(INITIAL_VENTAS);
    showToast('Datos de demostración restaurados exitosamente.');
  };

  const updateSupabaseSettings = (newSettings: Partial<SupabaseSettings>) => {
    setSupabaseSettings((prev) => ({
      ...prev,
      ...newSettings,
      isConfigured: Boolean(newSettings.url || prev.url) && Boolean(newSettings.anonKey || prev.anonKey),
    }));
    showToast('Configuración de Supabase actualizada');
  };

  const wipeSupabaseRemoteData = async (): Promise<{ success: boolean; message: string }> => {
    if (!supabaseSettings.url || !supabaseSettings.anonKey) {
      return {
        success: false,
        message: 'Supabase no está configurado con URL y Clave Anónima.',
      };
    }

    try {
      // Direct REST call to Supabase PostgREST endpoints to delete all records from tables
      const tables = ['ventas', 'cosechas', 'actividades', 'compras', 'mermas', 'incidencias', 'insumos', 'variedades', 'proveedores', 'clientes'];
      const headers = {
        apikey: supabaseSettings.anonKey,
        Authorization: `Bearer ${supabaseSettings.anonKey}`,
        'Content-Type': 'application/json',
      };

      for (const table of tables) {
        try {
          await fetch(`${supabaseSettings.url.replace(/\/$/, '')}/rest/v1/${table}?id=neq.placeholder`, {
            method: 'DELETE',
            headers,
          });
        } catch {
          // Continue if table doesn't exist
        }
      }

      // Also clean local
      clearAllSampleData();
      return {
        success: true,
        message: 'Se enviaron las solicitudes de borrado a las tablas de Supabase y se limpió el estado local.',
      };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      return {
        success: false,
        message: `Error al conectar con Supabase: ${errorMsg}`,
      };
    }
  };

  // Insumos CRUD
  const addInsumo = (data: Omit<Insumo, 'id' | 'ultimaActualizacion'>) => {
    const newInsumo: Insumo = {
      ...data,
      id: `ins-${Date.now()}`,
      ultimaActualizacion: new Date().toISOString().split('T')[0],
    };
    setInsumos((prev) => [newInsumo, ...prev]);
    showToast(`Insumo "${data.nombre}" registrado`);
  };

  const updateInsumo = (id: string, updated: Partial<Insumo>) => {
    setInsumos((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, ...updated, ultimaActualizacion: new Date().toISOString().split('T')[0] }
          : item
      )
    );
    showToast('Insumo actualizado');
  };

  const deleteInsumo = (id: string) => {
    setInsumos((prev) => prev.filter((i) => i.id !== id));
    showToast('Insumo eliminado');
  };

  // Proveedores CRUD
  const addProveedor = (data: Omit<Proveedor, 'id'>) => {
    const newProv: Proveedor = {
      ...data,
      id: `prov-${Date.now()}`,
    };
    setProveedores((prev) => [newProv, ...prev]);
    showToast(`Proveedor "${data.empresa}" agregado`);
  };

  const updateProveedor = (id: string, updated: Partial<Proveedor>) => {
    setProveedores((prev) => prev.map((p) => (p.id === id ? { ...p, ...updated } : p)));
    showToast('Proveedor actualizado');
  };

  const deleteProveedor = (id: string) => {
    setProveedores((prev) => prev.filter((p) => p.id !== id));
    showToast('Proveedor eliminado');
  };

  // Compras: Automated workflow step 1: Adds supplies to stock
  const addCompra = (data: Omit<Compra, 'id' | 'folio'>) => {
    const count = compras.length + 1;
    const folio = `OC-2026-${String(count).padStart(3, '0')}`;
    const newCompra: Compra = {
      ...data,
      id: `cmp-${Date.now()}`,
      folio,
    };
    setCompras((prev) => [newCompra, ...prev]);

    // Automatically increment stock of the corresponding supply
    setInsumos((prev) => {
      const exists = prev.some((i) => i.id === data.insumoId);
      if (exists) {
        return prev.map((item) => {
          if (item.id === data.insumoId) {
            return {
              ...item,
              cantidad: Number((item.cantidad + data.cantidad).toFixed(2)),
              costoUnitario: data.costoUnitario || item.costoUnitario,
              ultimaActualizacion: data.fecha || new Date().toISOString().split('T')[0],
            };
          }
          return item;
        });
      } else {
        // Create new insumo automatically if not exists
        const autoInsumo: Insumo = {
          id: data.insumoId || `ins-${Date.now()}`,
          nombre: data.nombreInsumo,
          categoria: 'otro',
          cantidad: data.cantidad,
          unidad: (data.unidad as Insumo['unidad']) || 'kg',
          stockMinimo: 10,
          costoUnitario: data.costoUnitario,
          proveedorId: data.proveedorId,
          ultimaActualizacion: data.fecha || new Date().toISOString().split('T')[0],
        };
        return [autoInsumo, ...prev];
      }
    });

    showToast(`Compra ${folio} registrada. Se añadieron +${data.cantidad} ${data.unidad} al inventario.`);
  };

  // Actividades: Automated workflow step 2: Consumes supplies upon completion
  const addActividad = (data: Omit<Actividad, 'id' | 'estado'>) => {
    const newAct: Actividad = {
      ...data,
      id: `act-${Date.now()}`,
      estado: 'pendiente',
    };
    setActividades((prev) => [newAct, ...prev]);
    showToast(`Actividad programada: ${data.titulo}`);
  };

  const completarActividad = (id: string, insumoIdUsado?: string, cantidadUsada?: number) => {
    const act = actividades.find((a) => a.id === id);
    if (!act) return;

    const usedInsumoId = insumoIdUsado || act.insumoRequeridoId;
    const usedQty = cantidadUsada !== undefined ? cantidadUsada : act.insumoCantidadRequerida;

    let supplyDeductedMsg = '';

    // Automated deduction of supply
    if (usedInsumoId && usedQty && usedQty > 0) {
      setInsumos((prev) =>
        prev.map((ins) => {
          if (ins.id === usedInsumoId) {
            const nuevaCantidad = Math.max(0, Number((ins.cantidad - usedQty).toFixed(2)));
            supplyDeductedMsg = ` Se descontaron ${usedQty} ${ins.unidad} de ${ins.nombre}.`;
            return {
              ...ins,
              cantidad: nuevaCantidad,
              ultimaActualizacion: new Date().toISOString().split('T')[0],
            };
          }
          return ins;
        })
      );
    }

    setActividades((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              estado: 'completada',
              fechaRealizada: new Date().toISOString().split('T')[0],
            }
          : a
      )
    );

    showToast(`Actividad "${act.titulo}" marcada como completada.${supplyDeductedMsg}`);
  };

  const updateActividadEstado = (id: string, estado: Actividad['estado']) => {
    if (estado === 'completada') {
      completarActividad(id);
    } else {
      setActividades((prev) => prev.map((a) => (a.id === id ? { ...a, estado } : a)));
      showToast(`Estado de actividad actualizado a: ${estado}`);
    }
  };

  // Incidencias
  const addIncidencia = (data: Omit<Incidencia, 'id' | 'estado'>) => {
    const newInc: Incidencia = {
      ...data,
      id: `inc-${Date.now()}`,
      estado: 'abierta',
    };
    setIncidencias((prev) => [newInc, ...prev]);
    showToast(`Incidencia registrada en ${data.zona}`);
  };

  const resolverIncidencia = (id: string) => {
    setIncidencias((prev) =>
      prev.map((inc) => (inc.id === id ? { ...inc, estado: 'resuelta' } : inc))
    );
    showToast('Incidencia marcada como resuelta');
  };

  // Cosecha: Automated workflow step 3: Adds harvested roses to stock & registers mermas
  const registrarCosecha = (data: Omit<Cosecha, 'id' | 'tallosIngresadosStock'>) => {
    const tallosIngresadosStock = Math.max(0, data.tallosCortados - (data.mermasTallos || 0));
    const newCosecha: Cosecha = {
      ...data,
      id: `cos-${Date.now()}`,
      tallosIngresadosStock,
    };
    setCosechas((prev) => [newCosecha, ...prev]);

    // Automatically record merma if any
    if (data.mermasTallos && data.mermasTallos > 0) {
      const newMerma: Merma = {
        id: `mer-${Date.now()}`,
        fecha: data.fecha,
        loteZona: data.loteZona,
        variedad: data.variedad,
        cantidadTallos: data.mermasTallos,
        causa: 'tallo_quebrado',
        registradoPor: data.encargado,
        notas: `Merma detectada durante cosecha de ${data.tallosCortados} tallos`,
      };
      setMermas((prev) => [newMerma, ...prev]);
    }

    // Automatically update or create rose stock in inventory
    setVariedades((prev) => {
      const normalizedVarName = data.variedad.toLowerCase().trim();
      const existingIndex = prev.findIndex(
        (v) =>
          v.nombre.toLowerCase().trim() === normalizedVarName &&
          v.calidad.toLowerCase() === data.calidad.toLowerCase()
      );

      if (existingIndex >= 0) {
        return prev.map((v, i) =>
          i === existingIndex
            ? { ...v, stockActualTallos: v.stockActualTallos + tallosIngresadosStock }
            : v
        );
      } else {
        // Create new variety record
        const newVar: VariedadRosa = {
          id: `var-${Date.now()}`,
          nombre: data.variedad,
          color: 'Rojo / Mixto',
          colorHex: '#e11d48',
          calidad: data.calidad,
          longitud: data.longitudTallo || '70cm',
          precioTalloMayoreo: 10.0,
          precioTalloMenudeo: 16.0,
          precioDocena: 160.0,
          precioGruesa: 1600.0,
          stockActualTallos: tallosIngresadosStock,
          stockMinimo: 150,
        };
        return [...prev, newVar];
      }
    });

    showToast(
      `Cosecha registrada: +${tallosIngresadosStock} tallos de ${data.variedad} (${data.calidad}) ingresaron al inventario de venta.`
    );
  };

  const registrarMerma = (data: Omit<Merma, 'id'>) => {
    const newMerma: Merma = {
      ...data,
      id: `mer-${Date.now()}`,
    };
    setMermas((prev) => [newMerma, ...prev]);

    // Also deduct from variety stock if present
    setVariedades((prev) => {
      const normalized = data.variedad.toLowerCase().trim();
      return prev.map((v) => {
        if (v.nombre.toLowerCase().trim() === normalized) {
          return {
            ...v,
            stockActualTallos: Math.max(0, v.stockActualTallos - data.cantidadTallos),
          };
        }
        return v;
      });
    });

    showToast(`Merma registrada: ${data.cantidadTallos} tallos descontados por ${data.causa}.`);
  };

  // Variedades
  const addVariedadRosa = (data: Omit<VariedadRosa, 'id'>) => {
    const newVar: VariedadRosa = {
      ...data,
      id: `var-${Date.now()}`,
    };
    setVariedades((prev) => [...prev, newVar]);
    showToast(`Variedad "${data.nombre}" (${data.calidad}) agregada al catálogo.`);
  };

  const updateVariedadRosa = (id: string, updated: Partial<VariedadRosa>) => {
    setVariedades((prev) => prev.map((v) => (v.id === id ? { ...v, ...updated } : v)));
    showToast('Variedad actualizada');
  };

  // Clientes
  const addCliente = (data: Omit<Cliente, 'id' | 'comprasAcumuladas'>) => {
    const newCli: Cliente = {
      ...data,
      id: `cli-${Date.now()}`,
      comprasAcumuladas: 0,
    };
    setClientes((prev) => [newCli, ...prev]);
    showToast(`Cliente "${data.nombre}" registrado`);
  };

  // Ventas: Automated workflow step 4: Deducts sold rose stems from inventory & creates invoice ticket
  const registrarVenta = (data: Omit<Venta, 'id' | 'folio'>): Venta => {
    const count = ventas.length + 1403;
    const folio = `TK-2026-${count}`;
    const newVenta: Venta = {
      ...data,
      id: `ven-${Date.now()}`,
      folio,
    };
    setVentas((prev) => [newVenta, ...prev]);

    // Automatically deduct sold rose stems
    data.items.forEach((item) => {
      setVariedades((prev) =>
        prev.map((v) => {
          if (v.id === item.variedadId) {
            return {
              ...v,
              stockActualTallos: Math.max(0, v.stockActualTallos - item.tallosTotales),
            };
          }
          return v;
        })
      );
    });

    // Update client cumulative purchases
    if (data.clienteId) {
      setClientes((prev) =>
        prev.map((c) =>
          c.id === data.clienteId
            ? { ...c, comprasAcumuladas: c.comprasAcumuladas + data.total }
            : c
        )
      );
    }

    showToast(`¡Venta realizada con éxito! Folio: ${folio}. Total: $${data.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`);
    return newVenta;
  };

  return (
    <AppContext.Provider
      value={{
        activeRole,
        setActiveRole,
        activeModule,
        setActiveModule,
        variedades,
        insumos,
        proveedores,
        compras,
        actividades,
        incidencias,
        cosechas,
        mermas,
        clientes,
        ventas,
        isSampleDataSuppressed,
        clearAllSampleData,
        restoreSampleData,
        supabaseSettings,
        updateSupabaseSettings,
        wipeSupabaseRemoteData,
        addInsumo,
        updateInsumo,
        deleteInsumo,
        addProveedor,
        updateProveedor,
        deleteProveedor,
        addCompra,
        addActividad,
        completarActividad,
        updateActividadEstado,
        addIncidencia,
        resolverIncidencia,
        registrarCosecha,
        registrarMerma,
        addVariedadRosa,
        updateVariedadRosa,
        addCliente,
        registrarVenta,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
