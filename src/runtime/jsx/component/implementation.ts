import { Lambda, struct } from '@nagisham/standard';
import { event_engine } from '@nagisham/syren';

import { JSX } from 'src/runtime';

import { Properties, property } from '../property';
import { slot } from '../slot';
import { Component, ComponentState, Events } from './types';

export const component = struct(
  (tag: JSX.FC, properties: Properties, elements: JSX.Elements): Component => {
    const { key, ref, props } = property(properties, elements);

    const { fire, listen } = event_engine<Events>();

    const state: ComponentState = {
      memo: {
        index: 0,
        array: new Array<unknown>(),
      },
    };

    function use(effect: () => void | Lambda<[], void>) {
      listen({
        type: 'mount',
        once: () => {
          const cleanup = effect();
          if (cleanup) {
            listen({ type: 'unmount', once: cleanup });
          }
        },
      });
    }

    function memo<T>(memoize: () => T) {
      const { memo } = state;

      let memoized = memo.array[memo.index];
      if (!memoized) {
        memo.array[memo.index] = memoized = memoize();
      }

      memo.index += 1;
      return memoized as T;
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
        state.memo.index = 0;
        elements.forEach((element) => element.fire('unmount'));
      },
    });

    return {
      name: tag.name,
      key,
      render() {
        ref?.(this);

        const api: JSX.Api = {
          slot: slot(),
          use,
          memo,
        };

        return tag(props, api).render();
      },
      fire,
      listen,
    };
  },
);
