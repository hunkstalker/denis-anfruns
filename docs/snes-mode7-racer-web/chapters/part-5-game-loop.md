# Part 5: The Game Loop (El Corazón del Motor)

## Objetivo Didáctico
En Godot tienes `_process` y `_physics_process` gratis. En Web tienes que construirlos.
Aprenderemos a crear un **Fixed Time Step Loop** para la física (determinismo) y variable para el render.

**Meta**: Un sistema que corre suave en monitores 144Hz y 60Hz.

## 1. Main.ts
```typescript
let lastTime = 0;
const PHYSICS_STEP = 1000 / 60; // 60 updates por segundo
let accumulator = 0;

function loop(timestamp: number) {
    const dt = timestamp - lastTime;
    lastTime = timestamp;
    accumulator += dt;

    // Física Determinista (Catch-up)
    while (accumulator >= PHYSICS_STEP) {
        game.update(PHYSICS_STEP / 1000); // dt en segundos
        accumulator -= PHYSICS_STEP;
    }
    
    // Renderizado (Tanto como se pueda)
    // alpha = accumulator / PHYSICS_STEP (para interpolación visual pro)
    game.render();

    requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
```

## 2. Input Manager
No usar `addEventListener` dentro del Update.
Usar un singleton que "escucha" siempre y guarda banderas.
```typescript
window.addEventListener("keydown", (e) => {
    if (e.code === "KeyW") Input.up = true;
});
```
