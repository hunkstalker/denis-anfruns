# Tactics con Godot - Plan de Implementación (Futuro)

NOTA: Este es un borrador de ideas para un futuro Devlog. No está en desarrollo activo.

## El Proyecto: "[Nombre TBD]" (Tactics RPG)

Un **Turn-Based Tactics** con vista ortogonal/isométrica, inspirado en *Fire Emblem*, *Final Fantasy Tactics* o *Into the Breach*.

### Filosofía
1. **Shaders para UX**: Highlight de casillas, fog of war, estados visuales.
2. **Matemáticas de Grid**: Pathfinding básico, distancias Manhattan.
3. **Sin shortcuts excesivos**: Entender la teoría antes de usar plugins.

---

## Ideas de Contenido

### Shaders de Terreno/Grid
- **Highlight de casilla**: La casilla bajo el cursor brilla.
- **Zonas de movimiento**: Área azul donde puede moverse la unidad.
- **Zonas de ataque**: Área roja de alcance.
- **Fog of War**: Niebla que oculta áreas no exploradas.

### Shaders de Unidades
- **Outline/Silueta**: Borde de color para unidades seleccionadas.
- **Grayscale (agotado)**: Unidad que ya actuó se ve gris.
- **Status effects**: Veneno (verde pulsante), hielo (tinte azul).

### Shaders de Post-proceso
- **Vignette**: Oscurecimiento de bordes.
- **Transiciones de turno**: Wipe entre turnos.

### Mecánicas de Juego
- Sistema de turnos (Player Phase / Enemy Phase).
- Movimiento basado en grid.
- Sistema de combate (daño, stats).
- IA básica de enemigos.

---

## Notas
- Enfoque en **feedback visual y UX** sobre efectos flashy.
- Reutilizar conocimientos de shaders del Devlog de Godot Basics.
- Pendiente: Definir nombre del proyecto y alcance.
