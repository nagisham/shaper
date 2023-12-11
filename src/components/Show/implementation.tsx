import { effect, computed, Signal } from '@nagisham/syren';

import { JSX } from 'src/runtime';

import { ShowProps } from './types';

export const Show: JSX.FC<ShowProps> = (props, { slot, use }) => {
  const { when, 'not:when': not_when, children } = props;

  let signal: Signal<boolean>;

  if (when) {
    signal = when;
  } else if (not_when) {
    signal = computed({
      listener: (show) => !show,
      dependency: [not_when],
    });
  } else {
    throw new Error('Show component must have "when" or "not:when" props');
  }

  use(() =>
    effect({
      listener: (show) => {
        show ? slot.mount(children) : slot.unmount(children);
      },
      dependency: [signal],
    }),
  );

  return <slot bind:data-show={signal}>{slot}</slot>;
};
