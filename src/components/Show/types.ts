import { Signal } from '@nagisham/syren';

import { JSX } from 'src/runtime';

export type ShowProps = JSX.ChildrenProps &
  (
    | { when: Signal<boolean>; 'not:when'?: undefined }
    | { when?: undefined; 'not:when': Signal<boolean> }
  );
