import { Functions } from "@nagisham/standard";
import { Signal, selector, signal } from "@nagisham/syren";
import { For, JSX, Show } from "@nagisham/shaper";

import { TODO, select_todos, todo_state } from "./store";

interface BoxProps extends JSX.ChildrenProps {
  class?: string;
}

const Box: JSX.FC<BoxProps> = (props) => {
  const { class: cs, children } = props;
  return (
    <div class={"flex gap-2 border border-gray-300 p-4 " + cs}>{children}</div>
  );
};

interface InputProps {
  class?: string;
  value: Signal<string>;
}

const Input: JSX.FC<InputProps> = (props) => {
  const { class: cs, value } = props;
  return (
    <input
      class={cs}
      bind:value={value}
      on:change={(e) => value(e.target.value)}
    />
  );
};

type ButtonProps = JSX.IntrinsicElements["button"];

const Button: JSX.FC<ButtonProps> = (props) => {
  const { class: cs, children, ...rest } = props;
  return (
    <button class={"border border-gray-300 px-2 py-1 " + cs} {...rest}>
      {children}
    </button>
  );
};

const ToDoInput: JSX.FC = () => {
  const value = signal<string>("");
  const { action } = todo_state;

  const handle = () => {
    action.add({ text: value() });
    value("");
  };

  return (
    <Box class="flex-col shadow-lg">
      <label>New Todo:</label>
      <div class="flex w-full flex-row gap-2">
        <Input
          class="w-full rounded-sm border border-gray-300 px-2 py-1 focus:outline-none"
          value={value}
        />
        <Button on:click={handle}>Add</Button>
      </div>
    </Box>
  );
};

interface ToDoItemEditProps {
  todo: TODO;
  onsave: (text: string) => void;
}

const ToDoItemEdit: JSX.FC<ToDoItemEditProps> = ({ todo, onsave }) => {
  const value = signal(todo.text);
  return (
    <>
      <div class="flex items-center justify-center">Edit:</div>
      <Input
        class="w-full rounded-sm border border-gray-300 px-2 py-1 focus:outline-none"
        value={value}
      />
      <Button on:click={() => onsave(value())}>Save</Button>
    </>
  );
};

interface ToDoItemShowProps {
  todo: TODO;
  onedit: () => void;
}

const ToDoItemShow: JSX.FC<ToDoItemShowProps> = ({ todo, onedit }) => {
  const { action } = todo_state;

  const checked = signal(false);
  const check = () => checked(Functions.togle);

  return (
    <>
      <div class="flex items-center justify-center">
        <input
          class="h-4 w-4 cursor-pointer rounded border-gray-300 bg-gray-100"
          type="checkbox"
          bind:checked={checked}
          on:change={check}
        />
      </div>
      <div
        bind:class={[
          "flex w-full cursor-pointer items-center",
          [checked, "line-through"],
        ]}
        on:click={check}
      >
        {todo.text}
      </div>
      <Button on:click={onedit}>Edt</Button>
      <Button on:click={() => action.remove(todo)}>Del</Button>
    </>
  );
};

const ToDoItem: JSX.FC<{ todo: TODO }> = ({ todo }) => {
  const { action } = todo_state;
  const editing = signal(false);

  const onedit = () => editing(true);

  const onsave = (text: string) => {
    editing(false);
    action.update({ ...todo, text });
  };

  return (
    <Box>
      <Show not:when={editing}>
        <ToDoItemShow todo={todo} onedit={onedit} />
      </Show>
      <Show when={editing}>
        <ToDoItemEdit todo={todo} onsave={onsave} />
      </Show>
    </Box>
  );
};

const ToDoList: JSX.FC = () => {
  const { slice } = todo_state;

  const todos = selector(slice, select_todos);

  return (
    <div class="w-full py-4">
      <For each={todos}>{(todo) => <ToDoItem key={todo} todo={todo} />}</For>
    </div>
  );
};

export const ToDo: JSX.FC = () => {
  return (
    <div class="h-full w-1/3 select-none">
      <ToDoInput />
      <ToDoList />
    </div>
  );
};
