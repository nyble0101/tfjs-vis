import {VisorComponent} from './components/visor';
import {SurfaceInfo, SurfaceInfoStrict, VisorInstance} from './types';

/**
 * The primary interface to the visor is the visor() function.
 *
 * This returns a singleton object with the public API of the visor. The
 * singleton object will be replaced if the visor is removed from the DOM for
 * some reason.
 */
let visorSingleton: VisorInstance;
const DEFAULT_TAB = 'Visor';
export function visor(): VisorInstance {
  if (document.querySelector('#tfjs-visor-container') &&
      visorSingleton !== undefined) {
    return visorSingleton;
  }

  // Create the container
  let visorEl = document.querySelector('#tfjs-visor-container') as HTMLElement;

  if (visorEl === null || visorEl === undefined) {
    visorEl = document.createElement('div');
    visorEl.id = 'tfjs-visor-container';
    document.body.appendChild(visorEl);
  }

  let renderRoot: Element;
  function renderVisor(
      domNode: HTMLElement,
      surfaceList: Map<string, SurfaceInfoStrict>): VisorComponent {
    let visorInstance: VisorComponent;
    renderRoot = VisorComponent.render(domNode, renderRoot, {
      ref: (r: VisorComponent) => visorInstance = r,
      surfaceList: Array.from(surfaceList.values()),
    });
    // Side effect of VisorComponent.render() is to assign visorInstance
    return visorInstance!;
  }

  // TODO: consider changing this type. Possibly lift into top level state
  // object
  const surfaceList: Map<string, SurfaceInfoStrict> = new Map();
  const visorComponentInstance: VisorComponent =
      renderVisor(visorEl, surfaceList);

  // Singleton visor instance. Implements public API of the visor.
  visorSingleton = {
    el: visorEl,
    surface: (options: SurfaceInfo) => {
      const {name, tab} = options;
      let _tab: string;
      let finalOptions: SurfaceInfoStrict;

      // Set the default tab if none is provided.
      if (tab === null || tab === undefined) {
        _tab = DEFAULT_TAB;
        finalOptions = {
          ...options,
          tab: _tab,
        };
      } else {
        _tab = tab;
        finalOptions = options as SurfaceInfoStrict;
      }

      const key = `${name}-${_tab}`;
      if (!surfaceList.has(key)) {
        surfaceList.set(key, finalOptions);
      }

      renderVisor(visorEl, surfaceList);
      return visorComponentInstance.getSurface(name, _tab);
    },
    isOpen: () => visorComponentInstance.isOpen(),
    close: () => visorComponentInstance.close(),
    open: () => visorComponentInstance.open(),
    toggle: () => visorComponentInstance.toggle(),
    toggleFullScreen: () => visorComponentInstance.toggleFullScreen(),
    bindKeys: () => {
      throw new Error('Not yet implemented');
    },
    unbindKeys: () => {
      throw new Error('Not yet implemented');
    },
  };

  return visorSingleton;
}
