import { EventEngine } from '@nagisham/syren';
import { Name, Renderable } from '../types';

export type Events = { mount: void; unmount: void };

export interface ComponentState {
  memo: {
    index: number;
    array: Array<unknown>;
  };
}

export type Component = Name & Renderable & EventEngine<Events>;
