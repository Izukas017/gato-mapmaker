import React, { useEffect, useState } from 'react';
import { ExportDialog, NewMapDialog, SettingsDialog } from './components/Dialogs';
import { MapCanvas } from './components/MapCanvas';
import { RightPanel } from './components/RightPanel';
import { StatusBar } from './components/StatusBar';
import { ToolDrawer } from './components/ToolDrawer';
import { ToolRail } from './components/ToolRail';
import { TopBar } from './components/TopBar';
import { useUiPrefs } from './store/useUiPrefs';

export function App() {
  const [showNew, setShowNew] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const appVariant = useUiPrefs((s) => s.appVariant);

  useEffect(() => {
    document.title =
      appVariant === 'cybergato'
        ? 'CyberGato MapMaker v0.7.7 — Editor de Mapas Tácticos'
        : 'Gato MapMaker v0.7.7 — Editor de Mapas Tácticos';
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', appVariant === 'cybergato' ? '#120c24' : '#1d2027');
    }
  }, [appVariant]);

  return (
    <div className="app-shell" data-variant={appVariant}>
      <TopBar
        onOpenNewDialog={() => setShowNew(true)}
        onOpenExportDialog={() => setShowExport(true)}
        onOpenSettingsDialog={() => setShowSettings(true)}
      />
      <main className="app-workspace">
        <ToolRail />
        <ToolDrawer />
        <MapCanvas />
        <RightPanel />
      </main>
      <StatusBar />

      {showNew && <NewMapDialog onClose={() => setShowNew(false)} />}
      {showExport && <ExportDialog onClose={() => setShowExport(false)} />}
      {showSettings && <SettingsDialog onClose={() => setShowSettings(false)} />}
    </div>
  );
}
export default App;
