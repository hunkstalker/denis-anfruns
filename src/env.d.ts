/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
/// <reference types="vite-plugin-svgr/client" />

declare module '*.svg' {
  const content: astroHTML.JSX.Element
  export default content
}
