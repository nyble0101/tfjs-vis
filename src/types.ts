// Types shared across the project and that users will commonly interact with

/**
 * The public visor api
 */
export interface VisorInstance {
  el: HTMLElement;
  surface: (options: SurfaceInfo) => SurfaceInstance;
  isOpen: () => boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  toggleFullScreen: () => void;
  unbindKeys: () => void;
  bindKeys: () => void;
}

/**
 * The public api of a 'surface'
 */
export interface SurfaceInstance {
  container: HTMLElement;
  label: HTMLElement;
  drawArea: HTMLElement;
}

/**
 * Options used to specify a surface.
 *
 * name and tab are also used for retrieval of a surface instance.
 */
export interface SurfaceInfo {
  name: string;
  tab?: string;
  styles?: StyleOptions;
}

/**
 * Internally all surfaces must have a tab.
 */
export interface SurfaceInfoStrict extends SurfaceInfo {
  name: string;
  tab: string;
  styles?: StyleOptions;
}

/**
 * Style properties are generally optional as components will specify defaults.
 */
export type StyleOptions = Partial<CSSOptions>;
interface CSSOptions {
  width: string;
  height: string;
  maxWidth: string;
  maxHeight: string;
}
