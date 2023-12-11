import { is_array, struct } from '@nagisham/standard';
import { storage } from '@nagisham/syren';

import { JSX } from 'src/runtime';

import { Slot } from './types';

export const slot = struct((elements?: JSX.Elements): Slot => {
  const state = storage(elements);

  const slot = Object.assign(state, {
    render() {
      const fragment = document.createDocumentFragment();
      state.each((element) => fragment.appendChild(element.render()));
      return fragment;
    },
    mount(elements?: JSX.Element | JSX.Elements) {
      if (elements) {
        if (is_array(elements)) {
          elements.forEach((element, i) => {
            state.insert(i, element);
            element.fire('mount');
          });
        } else {
          state.insert(elements);
          elements.fire('mount');
        }
      }

      return slot;
    },
    // TODO: implement a Map to assosiate the elements with dom nodes
    unmount(elements: JSX.Element | JSX.Elements) {
      if (is_array(elements)) {
        elements.forEach((element) => {
          element.fire('unmount');
        });
      } else {
        elements.fire('unmount');
      }

      state.len(0);

      return slot;
    },
  });

  return slot;
});
