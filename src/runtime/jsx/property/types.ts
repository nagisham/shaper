import { Lambda } from '@nagisham/standard';

import { JSX } from 'src/runtime';

export interface Properties extends Record<string, unknown> {
  key?: string;
  ref?: Lambda<[value: JSX.Element | undefined], void>;
}
