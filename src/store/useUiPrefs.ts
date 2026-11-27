import { create } from 'zustand';

export type AppVariant = 'gato' | 'cybergato';

export interface UiPrefs {
  appVariant: AppVariant;
  leftPanelOpen: boolean;
  leftPanelWidth: number;
  rightPanelOpen: boolean;
  rightPanelWidth: number;
  showCanvasHints: boolean;
  alwaysShowLightHandles: boolean;
  alignToObjects: boolean;
  propColumns: 2 | 3 | 4;
  zoomSpeed: 'slow' | 'normal' | 'fast';
  autoSaveEnabled: boolean;
  defaultExportPpg: 70 | 100 | 140;
}

const PREFS_KEY = 'gato_mapmaker_prefs_v1';

export const DEFAULT_UI_PREFS: UiPrefs = {
  appVariant: 'gato',
  leftPanelOpen: true,
  leftPanelWidth: 276,
  rightPanelOpen: true,
  rightPanelWidth: 276,
  showCanvasHints: true,
  alwaysShowLightHandles: false,
  alignToObjects: true,
  propColumns: 3,
  zoomSpeed: 'normal',
  autoSaveEnabled: true,
  defaultExportPpg: 140,
};

function clampWidth(w: number | undefined, fallback: number): number {
  return Math.max(220, Math.min(520, w ?? fallback));
}

function isMobileViewport(): boolean {
  return typeof window !== 'undefined' && window.innerWidth <= 860;
}

function loadInitialPrefs(): UiPrefs {
  const mobile = isMobileViewport();
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const raw = window.localStorage.getItem(PREFS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<UiPrefs>;
        return {
          ...DEFAULT_UI_PREFS,
          ...parsed,
          leftPanelOpen: mobile ? false : (parsed.leftPanelOpen ?? DEFAULT_UI_PREFS.leftPanelOpen),
          rightPanelOpen: mobile ? false : (parsed.rightPanelOpen ?? DEFAULT_UI_PREFS.rightPanelOpen),
          leftPanelWidth: clampWidth(parsed.leftPanelWidth, DEFAULT_UI_PREFS.leftPanelWidth),
          rightPanelWidth: clampWidth(parsed.rightPanelWidth, DEFAULT_UI_PREFS.rightPanelWidth),
        };
      }
    }
  } catch {
    // ignore
  }
  return {
    ...DEFAULT_UI_PREFS,
    leftPanelOpen: !mobile,
    rightPanelOpen: !mobile,
  };
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
  toggleLeftPanel: () => void;
  toggleRightPanel: () => void;
  resetPrefs: () => void;
}

export const useUiPrefs = create<UiPrefsStore>((set) => ({
  ...loadInitialPrefs(),
  setPrefs: (patch) =>
    set((s) => {
      const mobile = isMobileViewport();
      let leftOpen = patch.leftPanelOpen ?? s.leftPanelOpen;
      let rightOpen = patch.rightPanelOpen ?? s.rightPanelOpen;
      if (mobile) {
        if (patch.leftPanelOpen === true && patch.rightPanelOpen === undefined) {
          rightOpen = false;
        } else if (patch.rightPanelOpen === true && patch.leftPanelOpen === undefined) {
          leftOpen = false;
        }
      }
      const next: UiPrefs = {
        appVariant: patch.appVariant ?? s.appVariant,
        leftPanelOpen: leftOpen,
        leftPanelWidth: clampWidth(patch.leftPanelWidth, s.leftPanelWidth),
        rightPanelOpen: rightOpen,
        rightPanelWidth: clampWidth(patch.rightPanelWidth, s.rightPanelWidth),
        showCanvasHints: patch.showCanvasHints ?? s.showCanvasHints,
        alwaysShowLightHandles:
          patch.alwaysShowLightHandles ?? s.alwaysShowLightHandles,
        alignToObjects: patch.alignToObjects ?? s.alignToObjects,
        propColumns: patch.propColumns ?? s.propColumns,
        zoomSpeed: patch.zoomSpeed ?? s.zoomSpeed,
        autoSaveEnabled: patch.autoSaveEnabled ?? s.autoSaveEnabled,
        defaultExportPpg: patch.defaultExportPpg ?? s.defaultExportPpg,
      };
      savePrefs(next);
      return next;
    }),
  toggleLeftPanel: () =>
    set((s) => {
      const opening = !s.leftPanelOpen;
      const rightOpen = isMobileViewport() && opening ? false : s.rightPanelOpen;
      const next = { ...s, leftPanelOpen: opening, rightPanelOpen: rightOpen };
      savePrefs(next);
      return { leftPanelOpen: next.leftPanelOpen, rightPanelOpen: next.rightPanelOpen };
    }),
  toggleRightPanel: () =>
    set((s) => {
      const opening = !s.rightPanelOpen;
      const leftOpen = isMobileViewport() && opening ? false : s.leftPanelOpen;
      const next = { ...s, rightPanelOpen: opening, leftPanelOpen: leftOpen };
      savePrefs(next);
      return { rightPanelOpen: next.rightPanelOpen, leftPanelOpen: next.leftPanelOpen };
    }),
  resetPrefs: () => {
    const mobile = isMobileViewport();
    const resetState = {
      ...DEFAULT_UI_PREFS,
      leftPanelOpen: !mobile,
      rightPanelOpen: !mobile,
    };
    savePrefs(resetState);
    set(resetState);
  },
}));
