---
title: "Avoid Vite errors with dynamic imports in development"
pubDate: 2025-12-10
tags: ["vite", "astro", "dev-experience"]
lang: "en"
---

When you try to dynamically `import()` a file that **does not exist yet** (because it is generated at build time, like the Pagefind index), Vite throws an error in development mode and stops the server.

The typical `/* @vite-ignore */` comment is sometimes not enough if Vite scans the static path.

### The Solution

The trick is to **hide the path in a variable**. By doing this, Vite gives up on static analysis and allows the code to execute (or fail gracefully in a `try/catch`).

```javascript
try {
  // ❌ This fails in dev if the file doesn't exist
  // await import('/pagefind/pagefind.js');

  // ✅ This works (Vite ignores analysis)
  const url = '/pagefind/pagefind.js';
  await import(/* @vite-ignore */ url);
} catch (e) {
  console.warn('Pagefind not available in dev');
}
```

It's a small hack, but very useful for post-build libraries like Pagefind or dynamically generated WASM.
