import React, { useState } from 'react';
import { ExportDialog, NewMapDialog } from './components/Dialogs';
import { MapCanvas } from './components/MapCanvas';
import { RightPanel } from './components/RightPanel';
import { StatusBar } from './components/StatusBar';
import { ToolDrawer } from './components/ToolDrawer';
import { ToolRail } from './components/ToolRail';
import { TopBar } from './components/TopBar';

export function App() {
  const [showNew, setShowNew] = useState(false);
  const [showExport, setShowExport] = useState(false);

  return (
    <div className="app-shell">
      <TopBar
        onOpenNewDialog={() => setShowNew(true)}
        onOpenExportDialog={() => setShowExport(true)}
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
    </div>
  );
}
export default App;
