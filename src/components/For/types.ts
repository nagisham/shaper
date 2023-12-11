import { Signal } from '@nagisham/syren';

import { JSX } from 'src/runtime';

export interface ForProps<T> {
  each: T[] | Signal<T[]>;
  children: (value: T, index: number) => JSX.Element;
}

export type ForComponent = <T>(props: ForProps<T>, api: JSX.Api) => JSX.Element;
