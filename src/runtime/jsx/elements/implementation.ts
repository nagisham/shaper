import { is_function, is_number, is_string } from '@nagisham/standard';
import { is_signal } from '@nagisham/syren';

import { JSX } from 'src/runtime';
import { is_slot } from 'src/utils';

import { render } from '../render';
import { text } from '../text';

export function elements(children: JSX.Children): JSX.Elements {
  return children.flat().reduce((array, child) => {
    if (child === undefined || child === null) return array;
    if (child === true || child === false) return array;

    if (is_string(child) || is_number(child) || is_signal(child)) {
      array.push(text(child));
      return array;
    }

    if (is_slot(child)) {
      array.push(child);
      return array;
    }

    if (is_function(child)) {
      array.push(render(child));
      return array;
    }

    array.push(child);

    return array;
  }, new Array<JSX.Element>());
}
