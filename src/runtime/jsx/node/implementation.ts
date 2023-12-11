import {
  is_array,
  is_function,
  is_not_empty_string,
  is_null,
  is_string,
  struct,
} from '@nagisham/standard';
import { event_engine, is_signal } from '@nagisham/syren';

import { JSX } from 'src/runtime';
import { is_component, is_node, is_slot, is_text } from 'src/utils';

import { Properties, property } from '../property';
import { BIND_PREFIX, ON_PREFIX } from './constants';
import { Events, Node } from './types';

export const node = struct((tag: string, properties: Properties, elements: JSX.Elements): Node => {
  const { key, ref, props } = property(properties);
  const { fire, listen } = event_engine<Events>();

  function mount_elements(html_element: HTMLElement, elements: JSX.Elements) {
    elements.forEach((element) => {
      if (is_node(element)) {
        const node = element.render();
        html_element.appendChild(node);
      }
      if (is_component(element)) {
        const node = element.render();
        html_element.appendChild(node);
      }
      if (is_text(element)) {
        const node = element.render();
        html_element.appendChild(node);
      }
      if (is_slot(element)) {
        const node = element.render();
        html_element.appendChild(node);

        element.listen({
          type: 'insert',
          each: ({ index, element }) => {
            const node = element.render();

            if (html_element.childNodes.length === 0 && index === 0) {
              html_element.appendChild(node);
            }

            const child = html_element.childNodes[index] ?? null;
            html_element.insertBefore(node, child);
          },
        });

        element.listen({
          type: 'remove',
          each: ({ index }) => {
            const child = html_element.childNodes[index];
            if (child) {
              html_element.removeChild(child);
            }
          },
        });

        element.listen({
          type: 'cleanup',
          each: () => {
            html_element.replaceChildren();
          },
        });
      }

      element.fire('mount');
    });
  }

  function bind_props(html_element: HTMLElement) {
    Object.entries(props).forEach(([key, value]) => {
      if (key === 'class' && is_string(value)) {
        value.split(' ').forEach((class_name) => {
          class_name = class_name.trim();
          if (is_not_empty_string(class_name)) {
            html_element.classList.add(class_name);
          }
        });

        return;
      }

      if (key !== 'children' && key in html_element) {
        // @ts-expect-error
        html_element[key] = value;
      }

      if (is_string(key) && is_string(value)) {
        html_element.setAttribute(key, value);
        return;
      }

      if (key.startsWith(ON_PREFIX) && is_function(value)) {
        key = key.substring(ON_PREFIX.length);

        html_element.addEventListener(key, value);
        return;
      }

      if (key.startsWith(BIND_PREFIX)) {
        key = key.substring(BIND_PREFIX.length);

        if (key === 'class') {
          if (is_null(value)) return;

          if (is_signal(value)) {
            value.listen({
              type: 'change',
              each: (class_name) => {
                html_element.className = class_name as string;
              },
            });

            return;
          }

          if (is_array(value, 2) && is_signal(value[0]) && is_string(value[1])) {
            const [signal, class_name] = value;
            signal.listen({
              type: 'change',
              each: (boolean: boolean) => {
                html_element.classList.toggle(class_name, boolean);
              },
            });

            return;
          }

          if (is_array(value)) {
            value.forEach((value) => {
              if (is_string(value)) {
                value.split(' ').forEach((class_name) => {
                  class_name = class_name.trim();
                  if (is_not_empty_string(class_name)) {
                    html_element.classList.add(class_name);
                  }
                });
                return;
              }

              if (is_array(value, 2) && is_signal(value[0]) && is_string(value[1])) {
                const [signal, class_name] = value;
                signal.listen({
                  type: 'change',
                  each: (boolean: boolean) => html_element.classList.toggle(class_name, boolean),
                });

                return;
              }

              console.warn('unknown bind class array signature. value:', JSON.stringify(value));
            });

            return;
          }

          return;
        }

        if (is_signal(value)) {
          if (key in html_element) {
            value.listen({
              type: 'change',
              // @ts-expect-error
              each: (value) => (html_element[key] = value),
            });
          }

          value.listen({
            type: 'change',
            each: (value) => html_element.setAttribute(key, `${value}`),
          });

          return;
        }
      }

      console.warn(`Unhandled attribute. key: ${key}; value: ${value};`);
    });
  }

  listen({
    type: 'mount',
    each: () => {
      elements.forEach((element) => element.fire('mount'));
    },
  });

  listen({
    type: 'unmount',
    each: () => {
      elements.forEach((element) => element.fire('unmount'));
    },
  });

  return {
    name: tag,
    key,
    render() {
      const element = document.createElement(tag);

      bind_props(element);

      ref?.(this);
      mount_elements(element, elements);

      return element;
    },
    fire,
    listen,
  };
});
