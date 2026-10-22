export type UserRole = 'admin' | 'production' | 'sales' | 'supervisor';

export interface RoleConfig {
  id: UserRole;
  name: string;
  userLabel: string;
  badge: string;
  description: string;
}

export type InsumoCategoria = 'fertilizante' | 'pesticida' | 'empaque' | 'sustrato' | 'herramientas' | 'otro';

export interface Insumo {
  id: string;
  nombre: string;
  categoria: InsumoCategoria;
  cantidad: number;
  unidad: 'kg' | 'L' | 'piezas' | 'cajas' | 'rollos' | 'bultos';
  stockMinimo: number;
  costoUnitario: number;
  proveedorId?: string;
  ultimaActualizacion: string;
}

export interface Proveedor {
  id: string;
  nombre: string;
  empresa: string;
  telefono: string;
  email: string;
  categoriasInsumos: string[];
  direccion: string;
}

export interface Compra {
  id: string;
  folio: string;
  fecha: string;
  proveedorId: string;
  insumoId: string;
  nombreInsumo: string;
  cantidad: number;
  unidad: string;
  costoUnitario: number;
  total: number;
  notas: string;
  estado: 'completado' | 'pendiente';
}

export type TipoActividad = 'riego' | 'fumigacion' | 'poda' | 'abonado' | 'cosecha' | 'desbotone' | 'mantenimiento';

export interface Actividad {
  id: string;
  titulo: string;
  tipo: TipoActividad;
  zona: string;
  fechaProgramada: string;
  fechaRealizada?: string;
  asignadoA: string;
  estado: 'pendiente' | 'en_progreso' | 'completada';
  insumoRequeridoId?: string;
  insumoCantidadRequerida?: number;
  notas?: string;
}

export interface Incidencia {
  id: string;
  fecha: string;
  zona: string;
  tipo: 'plaga' | 'clima' | 'enfermedad' | 'riego_fallido' | 'otro';
  descripcion: string;
  severidad: 'baja' | 'media' | 'alta' | 'critica';
  estado: 'abierta' | 'en_atencion' | 'resuelta';
  reportadoPor: string;
}

export type CalidadRosa = 'Exportación' | 'Nacional' | 'Botones' | 'Rosas Abiertas';

export interface Cosecha {
  id: string;
  fecha: string;
  loteZona: string;
  variedad: string;
  tallosCortados: number;
  calidad: CalidadRosa;
  longitudTallo: string;
  mermasTallos: number;
  tallosIngresadosStock: number;
  encargado: string;
  notas?: string;
}

export interface Merma {
  id: string;
  fecha: string;
  loteZona: string;
  variedad: string;
  cantidadTallos: number;
  causa: 'plaga' | 'botrytis' | 'tallo_quebrado' | 'deformidad' | 'quemadura_sol' | 'otro';
  registradoPor: string;
  notas?: string;
}

export interface VariedadRosa {
  id: string;
  nombre: string;
  color: string;
  colorHex: string;
  calidad: CalidadRosa;
  longitud: string;
  precioTalloMayoreo: number;
  precioTalloMenudeo: number;
  precioDocena: number;
  precioGruesa: number; // 144 tallos (12 docenas)
  stockActualTallos: number;
  stockMinimo: number;
}

export interface Cliente {
  id: string;
  nombre: string;
  tipo: 'florería' | 'mayorista' | 'evento' | 'menudeo_mostrador';
  telefono: string;
  direccion: string;
  comprasAcumuladas: number;
}

export interface ItemVenta {
  variedadId: string;
  nombreVariedad: string;
  calidad: CalidadRosa;
  tipoPresentacion: 'tallo_suelto' | 'docena' | 'gruesa' | 'ramo_especial';
  cantidad: number;
  tallosTotales: number;
  precioUnitario: number;
  subtotal: number;
}

export interface Venta {
  id: string;
  folio: string;
  fecha: string;
  clienteId?: string;
  nombreCliente: string;
  tipoCliente: string;
  items: ItemVenta[];
  subtotal: number;
  descuento: number;
  total: number;
  metodoPago: 'efectivo' | 'transferencia' | 'tarjeta';
  estado: 'pagado' | 'pendiente';
  atendidoPor: string;
}

export interface SupabaseSettings {
  url: string;
  anonKey: string;
  isConfigured: boolean;
  lastSync?: string;
}
