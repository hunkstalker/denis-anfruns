# GDScript Course Implementation Plan

Goal: Create a `GDScriptEditor` with syntax highlighting and a basic JS-based interpreter to run simple GDScript code in the browser, and launch the first chapter of the GDScript course.

## Proposed Changes

### 1. GDScript Syntax Highlighting (Monaco)
*   Create `src/components/learn/gdscript/monarch.ts`: Define the Monarch JSON for GDScript (keywords, built-ins, tokens).

#### Roadmap: Godot & Game Dev Science 🚀

### Part 2: Instanciación y Balas 🔫
**Focus**: Crear cosas de la nada.
- **Teoría**: La diferencia entre `PackedScene` (Plano) y `Node` (Instancia).
- **Matemáticas Espaciales**: Coordenadas Locales vs Globales. El bug del Canguro.
- **Señales**: Limpieza automática con `queue_free()`.
- **Pro Tip**: Uso de `Marker2D` para puntos de spawn.

### Part 3: Señales y Enemigos (Cazando naves) 👾
**Focus**: Que los objetos hablen entre sí.
- Crear un Enemigo básico (`Area2D`).
- Detectar colisiones (`area_entered`): Bala choca Enemigo.
- Señales: `connect`, `emit_signal`.
- **Física como FX**: Enemigos que al morir caen con gravedad/inercia (Estilo *U.N. Squadron*).
- **Shader 101**: Crear un "Hit Flash" blanco al recibir daño.
- `queue_free()`: Limpiar la basura.

### Part 4: UI, Game Loop y el Mundo 💯
**Focus**: Feedback, Reinicio y Ambiente.
- CanvasLayer y Control Nodes (Score y Vidas).
- Señales Globales (EventBus básico).
- Reiniciar la escena (`reload_current_scene`) al morir.
- **Shader 102**: Fondo con *Infinite Scrolling* (Nebulosa).

### Part 5: Matemáticas vs Herramientas (La Evolución del Movimiento) 📐vs🛠️
**Focus**: Primero lo difícil, luego lo fácil.
- **Old School**: Trigonometría (`sin`/`cos`) y ecuaciones paramétricas a mano.
- **Godot Way**: Usar `Path2D` y `PathFollow2D` para hacer lo mismo en 3 clicks.
- **Conclusión**: Entender la matemática te permite hacer cosas que las herramientas no pueden.

### Part 6: Formaciones de Combate (Hardcode vs Nodos) 💃
**Focus**: Diseñar coreografías.
- **Old School**: Escribir patrones en código puro (sumar vectores, `look_at`).
- **Godot Way**: Usar `AnimationPlayer` o `RemoteTransform2D` para orquestar movimientos complejos visualmente.

### Part 7: Spawners y Oleadas (Arrays vs Timers) ⏱️
**Focus**: El ritmo del juego.
- **Old School**: Frame Counters y Arrays de datos (precisión de relojero).
- **Godot Way**: Nodos `Timer` y `await` (comodidad y legibilidad).
- **Hybrid**: Un sistema robusto que aproveche lo mejor de ambos.

### Part 8: Optimization & Object Pooling ♻️
**Focus**: Rendimiento extremo.
- Por qué `instantiate` es lento.
- Crear un Pool Manager.

### Part 9: Shaders 101 (The Juice) 🎨
**Focus**: Feedback visual.
- Matemáticas de color (Mix, Step).
- Hit Flash.

### Part 10: Shaders Avanzados ✨
**Focus**: Efectos de fondo y escudos.
- UV Manipulation.
- Scrolling Background infinito.

### Part 11: Game Loop & UI 🔄
- Game Over, Score, Retry.

### Part 12: Export & Polish 🚀
- Exportar a Web/Desktop.
- Sonido y toques finales.

## Verification Plan
*   **Visual**: Check that keywords like `extends`, `func`, `var` are colored correctly.
*   **Functional**: Run the exercises and verify the game mechanics match the explanations.
