import { JSX } from "@nagisham/shaper";

import { Footer, Header, Main } from "../layout";
import { ToDo } from "../features";

export const Root: JSX.FC = () => {
  return (
    <>
      <Header />
      <Main>
        <ToDo />
      </Main>
      <Footer />
    </>
  );
};
