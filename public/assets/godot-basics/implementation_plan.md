# GDScript Course Implementation Plan

NORMA: No usar analogías. Explicar la ciencia primero, la herramienta después.
ENFOQUE: Matemáticas y fundamentos del Game Dev clásico.

## El Proyecto: "Cosmic Defender" (Space Shooter)

Un **Horizontal Side-Scrolling Shooter** (como *Gradius* o *R-Type*).
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

---

### Part 5: Trigonometría de Combate 🔜
**Focus**: Movimiento matemático clásico.
- **El Seno**: Movimiento ondulatorio (`sin(time)`).
- **El Coseno**: Desfase y combinación.
- **Círculos y Elipses**: `cos` + `sin` para órbitas.
- **Práctica**: Enemigo que ondula, enemigo orbital.

### Part 6: Formaciones y Coreografías
**Focus**: Orquestación de grupos.
- Variables compartidas entre instancias.
- Offsets de fase para formaciones.
- Patrón de "V" y "Escalera".

### Part 7: El Motor de Nivel (Level Engine)
**Focus**: Infraestructura del "Scroll" infinito.
- **Virtual Scroll**: Separar la posición de la cámara del avance del nivel.
- **Scroll Table**: Implementar la estructura de datos (Coordinate-based triggering).
- **Prototipo**: Lograr que *un* solo enemigo aparezca en la coordenada X=5000.

### Part 8: Diseño de Nivel y Oleadas (Grayboxing)
**Focus**: Diseñar la EXPERIENCIA usando cajas prototipo.
- **Grayboxing**: Crear obstáculos (muros, asteroides) usando `StaticBody2D` y formas simples.
- **Level Flow**: Combinar topografía (obstáculos) con enemigos.
- **Editor de Oleadas**: Crear arrays de datos complejos (JSON/Dictionaries).
- **Pacing**: Curva de dificultad básica.

### Part 9: Arsenal y Sistema de Daño (Refactor) 🆕
**Focus**: Expandir combate y arquitectura.
- **Armas del Player**:
  - *Main Alternativo*: Disparo Doble (Frontal + Diagonal-Abajo). Menos daño, mayor cobertura (2 zonas).
  - *Sub-Weapons*: Misiles Guiados (Homing Missiles) automáticos.
  - *Special*: "Cluster Shield" (Ref. U.N. Squadron). Proyectiles orbitando en elipse (sin/cos) que se expanden y contraen.
- **Refactor**: Grupos de Godot para detección de daño (`is_in_group` vs `class_name`).
- Estrategia de armas escalable.

### Part 10: Audio Espacial
**Focus**: Feedback sonoro.
- `AudioStreamPlayer` y `AudioStreamPlayer2D`.
- AudioBus (Master, SFX, Music).
- Pitch randomizer para variedad.

### Part 11: Fondos Infinitos (Shader)
**Focus**: Scroll visual sin mover objetos.
- Manipulación de UVs en el shader.
- Capas de paralax con velocidades diferentes.
- Shader de estrellas/nebulosa.

### Part 12: UI y Game Loop
**Focus**: Retroalimentación al jugador.
- `CanvasLayer` y `Control` nodes.
- Score, Vidas, Game Over.
- EventBus (Autoload con señales globales).
- `reload_current_scene()`.

### Part 13: Object Pooling
**Focus**: Optimización profesional.
- Por qué `instantiate()` es costoso.
- Pool Manager genérico.
- Reutilizar balas y enemigos.

### Part 14: Polish Final
**Focus**: Detalles de juego profesional.
- `CPUParticles2D` para explosiones.
- Screen Shake (cámara).
- Transiciones de escena.

### Part 15: Exportación
**Focus**: Publicar el juego.
- Export HTML5.
- PWA y Fullscreen.
- Debugging en build.

---

## Cursos Futuros (No incluidos aquí)
- **Godot Avanzado**: Path2D, PathFollow2D, Tweens, AnimationPlayer.
- **IA para Juegos**: State Machines, Behavior Trees.
- **Multijugador**: Networking básico.
