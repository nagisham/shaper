import { is_function } from '@nagisham/standard';

import { JSX } from 'src/runtime';

import { Properties } from './property';
import { elements } from './elements';
import { component } from './component';
import { node } from './node';

export function h(tag: string | JSX.FC, props: Properties, ...children: JSX.Children): JSX.Element {
  const elem = elements(children);
  return is_function(tag) ? component(tag, props, elem) : node(tag, props, elem);
}

export const f: JSX.FC<{ children: JSX.Element | JSX.Elements }> = ({ children }, { slot }) => {
  return slot.mount(children);
};
