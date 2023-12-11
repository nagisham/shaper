import { local_storage_middleware, slice } from "@nagisham/syren";

export interface TODO {
  id: number;
  text: string;
}

interface TODOState {
  todos: TODO[];
}

const todo_slice = slice<TODOState>(
  {
    todos: [],
  },
  [local_storage_middleware("todo_slice")],
);

const id = () => Math.floor(Math.random() * 1_000_000_000);

export const todo_state = {
  slice: todo_slice,
  action: {
    add(todo: Omit<TODO, "id">) {
      if (todo.text) {
        const todos = todo_slice("todos");
        todo_slice("todos", [...todos, { ...todo, id: id() }]);
      }

      console.log(todo_slice());
    },
    remove(todo: TODO) {
      const copy = todo_slice("todos").slice();

      const index = copy.findIndex((t) => Object.is(t, todo));
      if (index === -1) return;

      copy.splice(index, 1);

      todo_slice("todos", copy);
    },
    update(todo: TODO) {
      const copy = todo_slice("todos").slice();

      const index = copy.findIndex((t) => t.id === todo.id);
      copy.splice(index, 1, todo);

      todo_slice("todos", copy);
    },
  },
};

export const select_todos = (state: TODOState) => state.todos;
