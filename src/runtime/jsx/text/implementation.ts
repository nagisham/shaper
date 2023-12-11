import { is_null, is_number, is_string, struct } from '@nagisham/standard';
import { Signal, event_engine, is_signal } from '@nagisham/syren';

import { Events, Text } from './types';

export const text = struct((text: string | number | Signal<string | number | undefined>): Text => {
  const { fire, listen } = event_engine<Events>();

  return {
    name: 'Text',
    render() {
      const node = document.createTextNode('');

      if (is_string(text) || is_number(text)) {
        node.textContent = `${text}`;
        return node;
      }

      if (is_signal(text)) {
        text.listen({
          type: 'change',
          each: (value) => {
            if (is_null(value)) return;
            node.textContent = `${value}`;
          },
        });
      }

      return node;
    },
    fire,
    listen,
  };
});
