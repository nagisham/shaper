import { JSX } from 'src/runtime';

export interface RenderOptions {
  component: JSX.Element;
  container: string | HTMLElement | null;
}
