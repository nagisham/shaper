import { is_string } from '@nagisham/standard';

import { RenderOptions } from './types';

export function render(options: RenderOptions) {
  if (is_string(options.container)) {
    options.container = document.querySelector<HTMLElement>(options.container);
  }

  if (!options.container) {
    throw new Error('container not found');
  }

  options.container.appendChild(options.component.render());
}
