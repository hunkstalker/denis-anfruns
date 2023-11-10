import * as React from "react";
import Index from './index.astro';
import {NextUIProvider} from "@nextui-org/react";

function App() {
  return (
    <NextUIProvider>
      <Index/>
    </NextUIProvider>
  );
}