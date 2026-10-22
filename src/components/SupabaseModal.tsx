import React, { useState } from 'react';
import { X, Database, Trash2, RefreshCw, Key, Globe, Check, Copy, AlertCircle, ShieldAlert } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const {
    supabaseSettings,
    updateSupabaseSettings,
    wipeSupabaseRemoteData,
    clearAllSampleData,
    restoreSampleData,
    isSampleDataSuppressed,
  } = useApp();

  const [url, setUrl] = useState(supabaseSettings.url);
  const [anonKey, setAnonKey] = useState(supabaseSettings.anonKey);
  const [copiedSql, setCopiedSql] = useState(false);
  const [isDeletingRemote, setIsDeletingRemote] = useState(false);
  const [remoteStatus, setRemoteStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updateSupabaseSettings({ url, anonKey });
  };

  const handleWipeRemote = async () => {
    if (!confirm('¿Estás seguro de que deseas vaciar todos los registros remotos en Supabase y el almacenamiento local?')) {
      return;
    }
    setIsDeletingRemote(true);
    setRemoteStatus(null);
    const res = await wipeSupabaseRemoteData();
    setIsDeletingRemote(false);
    setRemoteStatus(res.message);
  };

  const sqlSchemaScript = `-- Esquema SQL para Invernadero Rosas en Supabase
CREATE TABLE IF NOT EXISTS variedades (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  color TEXT,
  color_hex TEXT,
  calidad TEXT,
  longitud TEXT,
  precio_tallo_mayoreo NUMERIC,
  precio_tallo_menudeo NUMERIC,
  precio_docena NUMERIC,
  precio_gruesa NUMERIC,
  stock_actual_tallos INTEGER DEFAULT 0,
  stock_minimo INTEGER DEFAULT 100
);

CREATE TABLE IF NOT EXISTS insumos (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  categoria TEXT,
  cantidad NUMERIC DEFAULT 0,
  unidad TEXT,
  stock_minimo NUMERIC DEFAULT 10,
  costo_unitario NUMERIC DEFAULT 0,
  proveedor_id TEXT,
  ultima_actualizacion DATE
);

CREATE TABLE IF NOT EXISTS compras (
  id TEXT PRIMARY KEY,
  folio TEXT UNIQUE,
  fecha DATE,
  proveedor_id TEXT,
  insumo_id TEXT,
  nombre_insumo TEXT,
  cantidad NUMERIC,
  unidad TEXT,
  costo_unitario NUMERIC,
  total NUMERIC,
  notas TEXT,
  estado TEXT
);

CREATE TABLE IF NOT EXISTS actividades (
  id TEXT PRIMARY KEY,
  titulo TEXT,
  tipo TEXT,
  zona TEXT,
  fecha_programada DATE,
  fecha_realizada DATE,
  asignado_a TEXT,
  estado TEXT,
  insumo_requerido_id TEXT,
  insumo_cantidad_requerida NUMERIC,
  notas TEXT
);

CREATE TABLE IF NOT EXISTS cosechas (
  id TEXT PRIMARY KEY,
  fecha DATE,
  lote_zona TEXT,
  variedad TEXT,
  tallos_cortados INTEGER,
  calidad TEXT,
  longitud_tallo TEXT,
  mermas_tallos INTEGER,
  tallos_ingresados_stock INTEGER,
  encargado TEXT,
  notas TEXT
);

CREATE TABLE IF NOT EXISTS ventas (
  id TEXT PRIMARY KEY,
  folio TEXT UNIQUE,
  fecha TIMESTAMP,
  cliente_id TEXT,
  nombre_cliente TEXT,
  tipo_cliente TEXT,
  items JSONB,
  subtotal NUMERIC,
  descuento NUMERIC,
  total NUMERIC,
  metodo_pago TEXT,
  estado TEXT,
  atendido_por TEXT
);`;

  const copySql = () => {
    navigator.clipboard.writeText(sqlSchemaScript);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 text-left my-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Gestión de Datos y Conexión Supabase
              </h3>
              <p className="text-xs text-slate-500">
                Control de datos de muestra y preparación para base de datos PostgreSQL en Supabase
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5 space-y-6">
          {/* Seccion 1: Datos de muestra del sistema */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-rose-600" />
              Depuración de Datos de Muestra
            </h4>
            <p className="text-xs text-slate-600 mt-1">
              Al presionar este botón, se borrarán todos los datos precargados (compras, insumos, tareas, cosechas, ventas).
              El navegador recordará esta preferencia en <code>localStorage</code> y <strong>no volverá a mostrar los datos de muestra</strong> al recargar la aplicación.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  clearAllSampleData();
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition shadow-xs"
              >
                <Trash2 className="w-4 h-4" />
                Borrar datos de muestra del todo el sistema
              </button>

              {isSampleDataSuppressed && (
                <button
                  onClick={() => {
                    restoreSampleData();
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-xs transition"
                >
                  <RefreshCw className="w-4 h-4 text-emerald-700" />
                  Restablecer datos de muestra
                </button>
              )}
            </div>

            <div className="mt-3 flex items-center gap-2 text-xs">
              <span className="font-medium text-slate-500">Estado actual:</span>
              {isSampleDataSuppressed ? (
                <span className="font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                  Modo Producción Limpio (Datos de muestra suprimidos)
                </span>
              ) : (
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Modo Demostración (Datos de muestra cargados)
                </span>
              )}
            </div>
          </div>

          {/* Seccion 2: Conexión Supabase */}
          <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200/80">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-emerald-950 flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-700" />
                Credenciales de Supabase (Opcional)
              </h4>
              <span
                className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                  supabaseSettings.isConfigured
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {supabaseSettings.isConfigured ? 'Conectado' : 'No configurado'}
              </span>
            </div>

            <form onSubmit={handleSaveConfig} className="mt-3 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Project URL de Supabase
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="url"
                    placeholder="https://xyzproject.supabase.co"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Anon / Public API Key
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                    value={anonKey}
                    onChange={(e) => setAnonKey(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition"
                >
                  Guardar Parámetros de Supabase
                </button>

                {supabaseSettings.isConfigured && (
                  <button
                    type="button"
                    onClick={handleWipeRemote}
                    disabled={isDeletingRemote}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-100 hover:bg-red-200 text-red-800 font-semibold text-xs transition"
                  >
                    <ShieldAlert className="w-4 h-4 text-red-600" />
                    {isDeletingRemote ? 'Borrando...' : 'Borrar registros en Supabase'}
                  </button>
                )}
              </div>
            </form>

            {remoteStatus && (
              <div className="mt-3 p-2.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{remoteStatus}</span>
              </div>
            )}
          </div>

          {/* Seccion 3: Esquema SQL para crear tablas en Supabase */}
          <div className="p-4 rounded-xl bg-slate-900 text-slate-300">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-mono font-bold text-emerald-400">
                schema_invernadero_rosas.sql
              </span>
              <button
                onClick={copySql}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition"
              >
                {copiedSql ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>¡Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar SQL</span>
                  </>
                )}
              </button>
            </div>
            <pre className="mt-3 text-[11px] font-mono text-slate-400 max-h-36 overflow-y-auto leading-relaxed">
              {sqlSchemaScript}
            </pre>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
          >
            Cerrar Ventana
          </button>
        </div>
      </div>
    </div>
  );
};
