# Game Dev con Godot - Plan de Implementación

NORMA: No usar analogías. Explicar la ciencia primero, la herramienta después.
ENFOQUE: Matemáticas y fundamentos del Game Dev clásico.

## El Proyecto: "Area88" (Shoot 'em Up)

Un **Horizontal Side-Scrolling Shooter** inspirado en clásicos como *U.N. Squadron*, *Gradius* o *R-Type*.
El jugador controla una nave que se mueve, dispara proyectiles y esquiva enemigos.

### Filosofía del Curso
1. **Matemáticas primero**: Entender sin, cos, vectores, delta antes de usar nodos.
2. **Shaders como ciencia**: No son "efectos mágicos", son programas de GPU.
3. **Sin atajos prematuros**: Evitar herramientas de conveniencia (Path2D, Tweens) hasta entender la base.

---

## Roadmap

### Part 1: Vectores y Movimiento ✅
- Teoría: Vectores, Normalización, Delta.
- Nodos: `CharacterBody2D`.
- Scripting: `Input`, `move_and_slide()`.

### Part 2: Instanciación y Balas ✅
- `PackedScene` vs `Node`.
- Coordenadas Locales vs Globales.
- Señales vía UI (Editor).
- `queue_free()`.

### Part 3: Señales y Enemigos ✅
- `Area2D` vs `Body2D`.
- Señales por código (`connect`).
- Script del Enemigo: Movimiento, HP.
- Físicas simuladas (caída sin RigidBody).

### Part 4: Shaders 101 ✅
- Arquitectura CPU (serial) vs GPU (paralelo).
- GLSL: `fragment`, `vec4`, `uniform`, `UV`, `texture()`.
- Ejercicio: Hit Flash.

### Part 5: Trigonometría de Combate ✅
**Focus**: Movimiento matemático clásico.
- **El Seno**: Movimiento ondulatorio (`sin(time)`).
- **El Coseno**: Desfase y combinación.
- **Círculos y Elipses**: `cos` + `sin` para órbitas.
- **Práctica**: Enemigo que ondula, enemigo orbital.

---

### Part 6: El SpawnPoint - Formaciones Lineales 🔜
**Focus**: Sistema de spawn configurable (parte 1).
- **Corrección Bug Shader**: `material.duplicate()` para instancias independientes.
- **Collision Layers**: Configurar capas para que solo balas dañen enemigos.
- **SpawnPoint Base**: Nodo que carga escenas y define patrones.
- **Patrón LINE**: Enemigos en fila (avión), dirección configurable.
- **Patrón WAVE**: LINE + ondulación (sin/cos), desfase para efecto serpiente.

### Part 7: El SpawnPoint - Formaciones Orbitales 🆕
**Focus**: Sistema de spawn configurable (parte 2).
- **Patrón ORBIT**: Helicópteros girando alrededor de un centro.
- **Radios Diferentes**: Órbitas elípticas (radius_x ≠ radius_y).
- **Patrón LINE_TO_ORBIT**: Transición por posición X (entrada en fila → órbita).
- **Mejora futura (nota)**: Transición por distancia recorrida.

### Part 8: Estados y Rutas de Enemigos
**Focus**: Comportamientos secuenciales.
- **Enum y Match**: Estructura de estados en GDScript.
- **Transiciones por Posición**: `move_toward()` para llegar a un punto, luego cambiar estado.
- **Transiciones por Tiempo**: Usar Timer para cambiar de fase.
- **Práctica**: Enemigo que entra → orbita 3s → huye.
- **🔄 Espiral**: Profundizar en `lerp()`, `clamp()`, `move_toward()` (interpolación y límites).

### Part 9: El Motor de Nivel (Level Engine)
**Focus**: Infraestructura del "Scroll" infinito.
- **Virtual Scroll**: Separar la posición de la cámara del avance del nivel.
- **Scroll Table**: Implementar la estructura de datos (Coordinate-based triggering).
- **Prototipo**: Lograr que *un* solo enemigo aparezca en la coordenada X=5000.

### Part 10: Diseño de Nivel y Oleadas (Grayboxing)
**Focus**: Diseñar la EXPERIENCIA usando cajas prototipo.
- **Grayboxing**: Crear obstáculos (muros, asteroides) usando `StaticBody2D` y formas simples.
- **Level Flow**: Combinar topografía (obstáculos) con enemigos.
- **Editor de Oleadas**: Crear arrays de datos complejos (JSON/Dictionaries).
- **Pacing**: Curva de dificultad básica.

### Part 11: Arsenal y Sistema de Daño (Refactor)
**Focus**: Expandir combate y arquitectura.
- **Armas del Player**:
  - *Main Alternativo*: Disparo Doble (Frontal + Diagonal-Abajo). Menos daño, mayor cobertura (2 zonas).
  - *Sub-Weapons*: Misiles Guiados (Homing Missiles) automáticos.
  - *Special*: "Cluster Shield" (Ref. U.N. Squadron). Proyectiles orbitando en elipse (sin/cos) que se expanden y contraen.
- **Refactor**: Grupos de Godot para detección de daño (`is_in_group` vs `class_name`).
- Estrategia de armas escalable.

### Part 12: Audio Espacial
**Focus**: Feedback sonoro.
- `AudioStreamPlayer` y `AudioStreamPlayer2D`.
- AudioBus (Master, SFX, Music).
- Pitch randomizer para variedad.

### Part 13: Fondos Infinitos (Shader)
**Focus**: Scroll visual sin mover objetos.
- **Parallax por Shader**: Manipulación de UVs con `TIME` para scroll infinito.
  - ⚠️ *Sección saltable*: Este enfoque enseña la teoría. Más adelante se mostrará cómo hacerlo fácilmente con los nodos `ParallaxBackground` y `ParallaxLayer` de Godot.
- Capas de parallax con velocidades diferentes.
- **🔄 Espiral**: Profundizar en shaders (UVs avanzados, TIME, efectos visuales).

### Part 14: UI y Game Loop
**Focus**: Retroalimentación al jugador.
- `CanvasLayer` y `Control` nodes.
- Score, Vidas, Game Over.
- EventBus (Autoload con señales globales).
- `reload_current_scene()`.
- **🔄 Espiral**: Profundizar en señales personalizadas (`signal`, `emit_signal()`).

### Part 15: Object Pooling
**Focus**: Optimización profesional.
- Por qué `instantiate()` es costoso.
- Pool Manager genérico.
- Reutilizar balas y enemigos.
- **`instance uniform`**: Shaders optimizados donde todas las instancias comparten el código pero con valores individuales (mencionado en Part 6).

### Part 16: Polish Final
**Focus**: Detalles de juego profesional.
- `CPUParticles2D` para explosiones.
- Screen Shake (cámara).
- Transiciones de escena.
- **CRT / Scanlines** (Opcional): Shader de post-procesado retro con `CanvasLayer`.

### Part 17: Exportación
**Focus**: Publicar el juego.
- Export HTML5.
- PWA y Fullscreen.
- Debugging en build.

---

## Cursos Futuros (No incluidos aquí)
- **Godot Avanzado**: Path2D, PathFollow2D, Tweens, AnimationPlayer.
- **IA para Juegos**: State Machines, Behavior Trees.
- **Multijugador**: Networking básico.
