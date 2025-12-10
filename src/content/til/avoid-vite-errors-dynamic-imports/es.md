---
title: "Evitar errores de Vite con imports dinámicos en desarrollo"
pubDate: 2025-12-10
tags: ["vite", "astro", "dev-experience"]
lang: "es"
---

Cuando intentas hacer un `import()` dinámico de un archivo que **todavía no existe** (porque se genera en el build, como el índice de Pagefind), Vite lanza un error en modo desarrollo y detiene el servidor.

El típico comentario `/* @vite-ignore */` a veces no es suficiente si Vite intenta analizar estáticamente la ruta.

### La Solución

El truco infalible es **ocultar la ruta en una variable**. Al hacer esto, Vite renuncia al análisis estático y permite que el código se ejecute (o falle controladamente en el `try/catch`).

```javascript
try {
  // ❌ Esto falla en dev si el archivo no existe
  // await import('/pagefind/pagefind.js');

  // ✅ Esto funciona (Vite ignora el análisis)
  const url = '/pagefind/pagefind.js';
  await import(/* @vite-ignore */ url);
} catch (e) {
  console.warn('Pagefind no disponible en dev');
}
```

Es un pequeño hack, pero muy útil para librerías post-build como Pagefind o WASM generados dinámicamente.
