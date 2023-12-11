import { is_array } from '@nagisham/standard';

import { JSX } from 'src/runtime';

import { Properties } from './types';

export function property(propepties: Properties, elements?: JSX.Elements) {
  const { key, ref, ...props } = propepties ?? {};

  if (elements) {
    Object.assign(props, {
      children: is_array(elements, 1) ? elements[0] : elements,
    });
  }

  return {
    key,
    ref,
    props,
  };
}
