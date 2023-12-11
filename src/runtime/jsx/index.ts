import { h, f } from './implementation';
import { JSX } from './types';

export { JSX } from './types';

type IntrinsicElementsMap = JSX.IntrinsicElements;
type IntrinsicAttributesMap = JSX.IntrinsicAttributes;

declare global {
  interface Window {
    h: typeof h;
    f: typeof f;
  }

  namespace JSX {
    interface ElementChildrenAttribute {
      children: {};
    }

    interface IntrinsicElements extends IntrinsicElementsMap {}
    interface IntrinsicAttributes extends IntrinsicAttributesMap {}
  }
}

window.h = h;
window.f = f;
