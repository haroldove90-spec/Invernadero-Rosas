import React, { useState } from 'react';
import { Download, Smartphone, Monitor, CheckCircle2, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface Props {
  variant?: 'header' | 'compact' | 'full';
  className?: string;
}

export const PWAInstallButton: React.FC<Props> = ({ variant = 'header', className = '' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState(false);

  const handleInstallClick = async () => {
    if (isInstallable) {
      await install();
    } else {
      setShowGuideModal(true);
    }
  };

  if (isInstalled) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        <span className="hidden sm:inline">App Instalada</span>
        <span className="sm:hidden">PWA</span>
      </span>
    );
  }

  return (
    <>
      <button
        onClick={handleInstallClick}
        title="Instalar Invernadero Rosas en Android, iOS o PC"
        className={`group relative inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all shadow-sm active:scale-95 ${
          variant === 'header'
            ? 'bg-rose-600 text-white hover:bg-rose-700 px-3 py-1.5 text-xs sm:text-sm font-semibold shadow-rose-600/20'
            : 'bg-emerald-600 text-white hover:bg-emerald-700 px-4 py-2 text-sm'
        } ${className}`}
      >
        <Download className="w-4 h-4 animate-bounce group-hover:scale-110 transition-transform" />
        <span>Instalar</span>
      </button>

      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center">
                  <img src="/icon.svg" alt="Invernadero Rosas" className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Instalar Invernadero Rosas</h3>
                  <p className="text-xs text-slate-500">Acceso rápido sin conexión en tu dispositivo</p>
                </div>
              </div>
              <button
                onClick={() => setShowGuideModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs sm:text-sm text-slate-600">
              {isIOS ? (
                <div className="p-3.5 rounded-xl bg-rose-50/60 border border-rose-200/60 space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-rose-900">
                    <Smartphone className="w-4 h-4 text-rose-600" />
                    <span>Instrucciones para iPhone / iPad (Safari):</span>
                  </div>
                  <ol className="list-decimal pl-5 space-y-1.5 text-slate-700 text-xs">
                    <li>Presiona el botón de <strong>Compartir</strong> (ícono de cuadro con flecha hacia arriba en la barra inferior de Safari).</li>
                    <li>Desliza hacia abajo en las opciones y selecciona <strong>"Agregar a pantalla de inicio"</strong>.</li>
                    <li>Toca en <strong>"Agregar"</strong> en la esquina superior derecha.</li>
                  </ol>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center gap-2 font-semibold text-slate-800">
                      <Smartphone className="w-4 h-4 text-emerald-600" />
                      <span>En Teléfono Android (Chrome):</span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Toca el menú de 3 puntos en la esquina superior derecha de tu navegador y pulsa en <strong>"Instalar aplicación"</strong> o <strong>"Agregar a la pantalla principal"</strong>.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center gap-2 font-semibold text-slate-800">
                      <Monitor className="w-4 h-4 text-blue-600" />
                      <span>En Computadora (Chrome / Edge / Mac / Windows):</span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Haz clic en el ícono de instalación <Download className="w-3.5 h-3.5 inline mx-1 text-rose-600" /> en la barra de direcciones de tu navegador y confirma <strong>"Instalar"</strong> para abrirla como ventana de escritorio independiente.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowGuideModal(false)}
                className="w-full sm:w-auto px-5 py-2 rounded-xl bg-rose-600 text-white font-medium text-xs hover:bg-rose-700 transition"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
