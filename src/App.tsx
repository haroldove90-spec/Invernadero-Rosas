/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { RoleSelector } from './components/RoleSelector';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { BottomBar } from './components/BottomBar';
import { SupabaseModal } from './components/SupabaseModal';
import { DashboardAdmin } from './modules/DashboardAdmin';
import { InventariosModule } from './modules/InventariosModule';
import { ComprasModule } from './modules/ComprasModule';
import { ActividadesModule } from './modules/ActividadesModule';
import { ProduccionModule } from './modules/ProduccionModule';
import { POSModule } from './modules/POSModule';
import { VentasModule } from './modules/VentasModule';
import { ReportesModule } from './modules/ReportesModule';
import { WorkflowDiagram } from './components/WorkflowDiagram';
import { CheckCircle, AlertCircle } from 'lucide-react';

const MainDashboardLayout: React.FC = () => {
  const { activeRole, activeModule, toastMessage } = useApp();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);

  // If no role is selected, show the Role Selector start screen (no header, no descriptions, unencapsulated logo)
  if (!activeRole) {
    return <RoleSelector />;
  }

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return <DashboardAdmin />;
      case 'inventarios':
        return <InventariosModule />;
      case 'compras':
        return <ComprasModule />;
      case 'actividades':
        return <ActividadesModule />;
      case 'produccion':
      case 'cosecha':
        return <ProduccionModule />;
      case 'pos':
      case 'stock-ventas':
        return <POSModule />;
      case 'ventas':
      case 'ventas-historial':
        return <VentasModule />;
      case 'reportes':
        return <ReportesModule />;
      case 'workflow':
        return (
          <div className="space-y-6">
            <WorkflowDiagram />
          </div>
        );
      default:
        return <DashboardAdmin />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      {/* Cabecera Institucional Unificada */}
      <Header
        onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Menú Lateral Desplegable en Escritorio */}
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Área de Trabajo Principal - Sin pestañas repetitivas para maximizar visualización */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-24 lg:pb-12 max-w-7xl mx-auto w-full">
          {renderActiveModule()}
        </main>
      </div>

      {/* Navegación Móvil y Tablet (Bottom Bar fija) */}
      <BottomBar />

      {/* Modal de Supabase y Control de Datos de Muestra */}
      <SupabaseModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 lg:bottom-6 right-4 z-50 animate-bounce shadow-2xl">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold border border-slate-700">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainDashboardLayout />
    </AppProvider>
  );
}
