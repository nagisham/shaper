import { EventEngine } from '@nagisham/syren';

import { Name, Renderable } from '../types';

export type Events = { mount: void; unmount: void };

export type Node = Name & Renderable & EventEngine<Events>;
