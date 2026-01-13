# GDScript Course Implementation Plan

NORMA: No usar analogías en exceso.

## El Proyecto: "Cosmic Defender" (Space Shooter)

Vamos a crear un **Horizontal Side-Scrolling Shooter** (como *Gradius* o *U.N. Squadron*).
El jugador controla una nave que se mueve libremente por la pantalla, dispara proyectiles y esquiva enemigos en un entorno de scroll lateral.

### ¿Por qué este proyecto? (Motivación Educativa)
He elegido este género porque es el **"Hello World"** perfecto del desarrollo de videojuegos, pero escalable hasta nivel profesional. Toca todos los pilares fundamentales sin la complejidad del Platformer (físicas de salto) o el RPG (inventarios complejos).

**Puntos Clave de Aprendizaje:**
1.  **Matemáticas Vectoriales**: El movimiento en el espacio 2D es pura trigonometría y vectores. Entender esto es la base de todo.
2.  **Arquitectura de Nodos**: Aprenderemos a separar lógica (Script), física (CollisionShape) y visuales (Sprite).
3.  **Ciclo de Vida**: Crear objetos (Instanciar balas) y destruirlos (Queue Free) nos enseña gestión de memoria.
4.  **Game Juice (Shaders)**: Un shooter funcional es aburrido. Un shooter con *feedback* visual (flashes, partículas) es adictivo. Aquí brilla la GPU.

### Conceptos Fundamentales del Curso
*   **Vectores y Normalización**
*   **Señales y Event Bus** (Comunicación desacoplada)
*   **Instanciación y Object Pooling** (Optimización)
*   **Shaders** (Programación gráfica básica)
*   **Game Loop** (Input -> Update -> Render)

---

#### Roadmap: Godot & Game Dev Science

### Part 1: Vectores y Movimiento
**Focus**: Entender las matemáticas del movimiento.
- **Teoría**: Vectores, Normalización y Delta.
- **Nodos**: `CharacterBody2D` vs `Node2D`.
- **Scripting**: `Input` y `move_and_slide()`.

### Part 2: Instanciación y Balas
**Focus**: Crear cosas de la nada.
- **Teoría**: Diferencia entre `PackedScene` (Plano) y `Node` (Instancia).
- **Matemáticas**: Coordenadas Locales vs Globales.
- **Señales (Iteración 1)**: Conexión vía **UI (Editor)**.
    - *Contexto*: Conectar un nodo hijo auxiliar (`VisibleOnScreenNotifier`) al script del padre. Ideal para prototipado rápido y estructuras simples.
- `queue_free()` básico.

### Part 3: Señales y Enemigos (Lógica Pura)
**Focus**: Que los objetos hablen entre sí.
- `Area2D` vs `Body2D`.
- **Señales (Iteración 2)**: Conexión vía **Código (`connect`)**.
    - *Contexto*: El objeto se conecta a sí mismo.
    - *Why*: **Encapsulamiento**. Queremos que el Enemigo funcione por sí solo, sin depender de que alguien haya hecho click en el editor. Es más robusto para trabajar en equipo.
- Script del Enemigo: Movimiento y Vida.
- Física Fake: Muerte con gravedad.

### Part 4: Shaders 101 (Game Juice)
**Focus**: Introducción visual y arquitectura.
- **Arquitectura**: CPU (Serial) vs GPU (Paralelo).
- **Glosario**: `fragment`, `vec4`, `uniform`, `UV`.
- **Ejercicio**: Hit Flash (Brillo al recibir daño).

### Part 5: UI & Game Loop Básico
**Focus**: Feedback y Ciclo de vida.
- CanvasLayer y Control Nodes (Score, Vidas).
- Señales Globales (EventBus).
- Reiniciar escena (`reload_current_scene`).

### Part 6: Fondos Infinitos (Shaders 102)
**Focus**: Movimiento visual avanzado.
- Manipulación de UVs.
- Shader de Nebulosa con *Infinite Scrolling*.
- Diferencia entre mover la cámara y mover las UVs.

### Part 7: La Evolución del Movimiento (Math vs Tools)
**Focus**: Entender la base para usar la herramienta.
- **Old School**: Trigonometría (`sin`/`cos`) para movimiento sinusoidal.
- **Godot Way**: `Path2D` y `PathFollow2D`.

### Part 8: Formaciones de Combate
**Focus**: Orquestación de enemigos.
- Patrones de movimiento complejos.
- `RemoteTransform2D` para coreografías.

### Part 9: Spawners y Ritmo (Arrays vs Timers) 
**Focus**: Diseño de niveles procedural.
- **Old School**: Frame Counters y Arrays.
- **Godot Way**: `Timer` nodes y `await`.

### Part 10: Audio y Atmósfera
**Focus**: El "feel" invisible.
- `AudioStreamPlayer`.
- AudioBus Layout (Master, SFX, Music).
- Pitch randomizer para variedad.

### Part 11: Optimización (Object Pooling)
**Focus**: Rendimiento profesional.
- Por qué `instantiate` es lento.
- Implementar un Pool Manager genérico.
- Reutilizar balas y enemigos.

### Part 12: Polish y FX
**Focus**: Detalles finales.
- Partículas (`CPUParticles2D`).
- Screen Shake (Cámara).
- Transiciones de escena.

### Part 13: Exportación y Web
**Focus**: Compartir el juego.
- Configuración de exportación HTML5.
- PWA y Fullscreen.
- Debugging en build final.

## Verification Plan
*   **Visual**: Check that keywords like `extends`, `func`, `var` are colored correctly.
*   **Functional**: Run the exercises and verify the game mechanics match the explanations.
