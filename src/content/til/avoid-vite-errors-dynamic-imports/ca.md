---
title: "Evitar errors de Vite amb imports dinàmics en desenvolupament"
pubDate: 2025-12-10
tags: ["vite", "astro", "dev-experience"]
lang: "ca"
---

Quan intentes fer un `import()` dinàmic d'un fitxer que **encara no existeix** (perquè es genera al build, com l'índex de Pagefind), Vite llança un error en mode desenvolupament i atura el servidor.

El típic comentari `/* @vite-ignore */` a vegades no és suficient si Vite intenta analitzar estàticament la ruta.

### La Solució

El truc infalible és **amagar la ruta en una variable**. En fer això, Vite renuncia a l'anàlisi estàtic i permet que el codi s'executi (o falli controladament en el `try/catch`).

```javascript
try {
  // ❌ Això falla en dev si el fitxer no existeix
  // await import('/pagefind/pagefind.js');

  // ✅ Això funciona (Vite ignora l'anàlisi)
  const url = '/pagefind/pagefind.js';
  await import(/* @vite-ignore */ url);
} catch (e) {
  console.warn('Pagefind no disponible en dev');
}
```

És un petit hack, però molt útil per llibreries post-build com Pagefind o WASM generats dinàmicament.
