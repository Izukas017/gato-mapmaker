import { create } from 'zustand';

export interface UiPrefs {
  rightPanelOpen: boolean;
  rightPanelWidth: number;
  showCanvasHints: boolean;
  alwaysShowLightHandles: boolean;
  propColumns: 2 | 3 | 4;
  zoomSpeed: 'slow' | 'normal' | 'fast';
  autoSaveEnabled: boolean;
  defaultExportPpg: 70 | 100 | 140;
}

const PREFS_KEY = 'gato_mapmaker_prefs_v1';

export const DEFAULT_UI_PREFS: UiPrefs = {
  rightPanelOpen: true,
  rightPanelWidth: 276,
  showCanvasHints: true,
  alwaysShowLightHandles: false,
  propColumns: 3,
  zoomSpeed: 'normal',
  autoSaveEnabled: true,
  defaultExportPpg: 140,
};

function loadInitialPrefs(): UiPrefs {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const raw = window.localStorage.getItem(PREFS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<UiPrefs>;
        return {
          ...DEFAULT_UI_PREFS,
          ...parsed,
          rightPanelWidth: Math.max(
            220,
            Math.min(520, parsed.rightPanelWidth ?? DEFAULT_UI_PREFS.rightPanelWidth)
          ),
        };
      }
    }
  } catch {
    // ignore
  }
  return { ...DEFAULT_UI_PREFS };
}

function savePrefs(prefs: UiPrefs) {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
    }
  } catch {
    // ignore
  }
}

interface UiPrefsStore extends UiPrefs {
  setPrefs: (patch: Partial<UiPrefs>) => void;
  toggleRightPanel: () => void;
  resetPrefs: () => void;
}

export const useUiPrefs = create<UiPrefsStore>((set) => ({
  ...loadInitialPrefs(),
  setPrefs: (patch) =>
    set((s) => {
      const next: UiPrefs = {
        rightPanelOpen: patch.rightPanelOpen ?? s.rightPanelOpen,
        rightPanelWidth: Math.max(
          220,
          Math.min(520, patch.rightPanelWidth ?? s.rightPanelWidth)
        ),
        showCanvasHints: patch.showCanvasHints ?? s.showCanvasHints,
        alwaysShowLightHandles:
          patch.alwaysShowLightHandles ?? s.alwaysShowLightHandles,
        propColumns: patch.propColumns ?? s.propColumns,
        zoomSpeed: patch.zoomSpeed ?? s.zoomSpeed,
        autoSaveEnabled: patch.autoSaveEnabled ?? s.autoSaveEnabled,
        defaultExportPpg: patch.defaultExportPpg ?? s.defaultExportPpg,
      };
      savePrefs(next);
      return next;
    }),
  toggleRightPanel: () =>
    set((s) => {
      const next = { ...s, rightPanelOpen: !s.rightPanelOpen };
      savePrefs(next);
      return { rightPanelOpen: next.rightPanelOpen };
    }),
  resetPrefs: () => {
    savePrefs(DEFAULT_UI_PREFS);
    set({ ...DEFAULT_UI_PREFS });
  },
}));
