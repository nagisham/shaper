import { JSX } from 'src/runtime';

import { Component, component } from 'src/runtime/jsx/component';
import { Node, node } from 'src/runtime/jsx/node';
import { Render, render } from 'src/runtime/jsx/render';
import { Text, text } from 'src/runtime/jsx/text';
import { Slot, slot } from 'src/runtime/jsx/slot';

export function is_node<A>(jsx: A | JSX.Element): jsx is Node {
  return jsx instanceof node;
}

export function is_component<A>(jsx: A | JSX.Element): jsx is Component {
  return jsx instanceof component;
}

export function is_render<A>(jsx: A | JSX.Element): jsx is Render {
  return jsx instanceof render;
}

export function is_text<A>(jsx: A | JSX.Element): jsx is Text {
  return jsx instanceof text;
}

export function is_slot<A>(jsx: A | JSX.Element): jsx is Slot {
  return jsx instanceof slot;
}

export function is_element<A>(jsx: A | JSX.Element): jsx is JSX.Element {
  return is_node(jsx) || is_component(jsx) || is_render(jsx) || is_text(jsx) || is_slot(jsx);
}
