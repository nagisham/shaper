import { JSX } from "@nagisham/shaper";

export const Main: JSX.FC = ({ children }) => {
  return (
    <main class="flex h-full w-full flex-col items-center [grid-area:main]">
      {children}
    </main>
  );
};
