import {Drawable} from '../types';

export function getDrawArea(drawable: Drawable): HTMLElement {
  if (drawable instanceof HTMLElement) {
    return drawable;
  } else if (drawable.drawArea instanceof HTMLElement) {
    return drawable.drawArea;
  } else {
    throw new Error('Not a drawable');
  }
}
