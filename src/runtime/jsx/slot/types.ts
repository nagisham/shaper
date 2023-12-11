import {
  ArrayEvents,
  EventEngine,
  IndexAccessor,
  StorageEngine,
  Store,
  StoreEvents,
} from '@nagisham/syren';

import { JSX } from 'src/runtime';

import { Name, Renderable } from '../types';

export type Events = { mount: void; unmount: void };

interface Slotable
  extends Store<
    IndexAccessor<JSX.Element>,
    StoreEvents<JSX.Element[]> & ArrayEvents<JSX.Element> & Events,
    StorageEngine<JSX.Element>
  > {
  mount(elements?: JSX.Element | JSX.Elements): Slot;
  unmount(elements?: JSX.Element | JSX.Elements): Slot;
}

export type Slot = Name & Renderable & Slotable & EventEngine<Events>;
