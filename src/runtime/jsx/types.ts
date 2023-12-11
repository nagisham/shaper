import { Lambda, PickMutable } from '@nagisham/standard';
import { Signal } from '@nagisham/syren';

import { Html } from 'src/runtime/html';

import { Component } from './component';
import { Node } from './node';
import { Render } from './render';
import { Slot } from './slot';
import { Text } from './text';

export interface Name {
  name: string;
}

export interface Renderable {
  key?: string | undefined;
  render(): Html.Element;
}

export namespace JSX {
  export type Elements = Array<JSX.Element>;
  export type Element = Node | Component | Render | Text | Slot;

  export type Children = Array<Child>;
  export type Child =
    | JSX.Element
    | Lambda<[], JSX.Element | Html.Element>
    | boolean
    | string
    | number
    | Signal<string | number | undefined>
    | null
    | undefined;

  type Cleanup = () => void;

  export type Api = {
    slot: Slot;
    use: (effect: () => void | Cleanup) => void;
    memo: <T>(memoize: () => T) => T;
  };

  export interface ChildrenProps {
    children?: JSX.Element | JSX.Elements;
  }

  export type FC<P = JSX.ChildrenProps> = (props: P, api: JSX.Api) => JSX.Element;

  export type Class =
    | Signal<string>
    | [Signal<boolean>, string]
    | Array<string | [Signal<boolean>, string]>;

  interface Props {
    class: string | undefined;
    ['bind:class']: Class;
    key: string | undefined;
    ref: Signal<Node | undefined>;
    children: JSX.Child | JSX.Children;
  }

  type EventMap<T> = {
    [K in keyof HTMLElementEventMap as `on:${K & string}`]: Lambda<
      [
        event: Omit<HTMLElementEventMap[K], 'target'> & {
          target: T;
        },
      ],
      void
    >;
  };

  type BindProps<T> = {
    [K in keyof T as `bind:${K & string}`]: Signal<T[K]>;
  };

  type ElementProps<T> = Partial<Props & PickMutable<T> & BindProps<PickMutable<T>> & EventMap<T>>;

  // end types

  export type HtmlElementTagMap = {
    [K in keyof HTMLElementTagNameMap]: ElementProps<HTMLElementTagNameMap[K]>;
  };

  export type SvgElementTagMap = {
    [K in keyof HTMLElementTagNameMap]: ElementProps<HTMLElementTagNameMap[K]>;
  };

  export type MathElementTagMap = {
    [K in keyof MathMLElementTagNameMap]: ElementProps<MathMLElementTagNameMap[K]>;
  };

  // element tag map

  export interface IntrinsicAttributes {
    key?: any;
    ref?: Lambda<[Node | undefined], void>;
  }

  export interface IntrinsicElements
    extends HtmlElementTagMap,
      SvgElementTagMap,
      MathElementTagMap {}
}
