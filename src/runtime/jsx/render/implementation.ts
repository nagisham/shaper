import { Lambda, struct } from '@nagisham/standard';
import { event_engine } from '@nagisham/syren';

import { JSX } from 'src/runtime';
import { Html } from 'src/runtime/html';
import { is_element } from 'src/utils';

import { Events, Render } from './types';

export const render = struct((render_function: Lambda<[], JSX.Element | Html.Element>): Render => {
  const { fire, listen } = event_engine<Events>();

  return Object.assign(render_function, {
    render() {
      const element = render_function();
      return is_element(element) ? element.render() : element;
    },
    fire,
    listen,
  });
});
