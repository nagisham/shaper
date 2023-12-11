import { is_array } from '@nagisham/standard';
import { computed } from '@nagisham/syren';

import { ForComponent } from './types';

export const For: ForComponent = ({ each, children }, { slot }) => {
  if (is_array(each)) {
    return <slot data-for={each.length}>{each?.map(children)}</slot>;
  }

  const length = computed({
    listener: (next) => {
      const current = next.map(children);

      if (current.some((item) => item.key === undefined)) {
        //rerender everything
        slot.unmount();
        slot.mount(current);
      } else {
        current.forEach(function action(c, i) {
          const index = slot.find((e) => e.key === c.key);
          if (index === -1) {
            // new element
            slot.insert(i, c);
          } else if (index !== i) {
            const e = slot(i);
            const j = current.findIndex((c) => c.key === e.key);
            if (j === -1) {
              // remove element
              slot.remove(i);
              return action(c, i);
            } else {
              // move element
              slot.insert(j, slot.remove(index));
            }
          }
        });
        // remove extra elements
        slot.len(next.length);
      }

      return next.length;
    },
    dependency: [each],
  });

  return <slot bind:data-for={length}>{slot}</slot>;
};
