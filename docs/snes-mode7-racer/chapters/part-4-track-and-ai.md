# Part 4: Track & AI (El Circuito y los Rivales)

## Objetivo Didáctico
Un coche en el vacío no es divertido. Necesitamos un circuito y alguien contra quien competir.
Aprenderemos a diseñar pistas para este "falso 3D" y a crear una Inteligencia Artificial competitiva que usa trucos sucios (Rubber Banding) para mantener la emoción, tal como hacían los clásicos.

**Meta Final del Capítulo**: Una carrera a 3 vueltas contra un rival (Luigi Malvado) que toma las curvas decentemente y no se estampa (demasiado).

---

## 1. Diseño del Circuito (La Capa Invisible)
Lo que vemos es el Shader plano. Lo que "toca" el coche es invisible.

### Collision Maps
En lugar de tilemaps complejos, usaremos `StaticBody2D` con `CollisionPolygon2D`.
1.  **Dibujo**: Dibujamos el contorno interior (césped) y los bordes exteriores del asfalto usando polígonos.
2.  **Superficies**:
    *   **Asfalto**: Sin colisión (Area libre).
    *   **Césped/Tierra**: `Area2D` que detecta al jugador y modifica su variable `MAX_SPEED` y `FRICTION` (le frena).
    *   **Muros**: `CollisionPolygon2D` físico (bloquea movimiento).

### Sistema de Checkpoints (Anti-Trampas)
Para contar vueltas y evitar que el jugador tome atajos imposibles.
*   Colocar `Area2D` invisibles cruzando la pista ('Checkpoint 1', 'Checkpoint 2'...).
*   Lógica: `if entered_checkpoint(i) and last_checkpoint == i-1: update_progress()`.

## 2. Inteligencia Artificial (AI Driver)
No usaremos Machine Learning. Usaremos "Steering Behaviors" clásicos.

### Waypoints
Nodos `Marker2D` colocados a mano a lo largo de la línea óptima de carrera.
*   Array: `[Node1, Node2, Node3...]`.

### Lógica de Control (The Follower)
La IA no pulsa teclas. La IA calcula vectores.

1.  **Target**: Obtener posición del siguiente Waypoint.
2.  **Steering**:
    *   Vector deseado: `target_pos - my_pos`.
    *   Error angular: `angle_difference(my_rotation, desired_angle)`.
3.  **Output**:
    *   Si `error > 0.1` -> Girar Derecha.
    *   Si `error < -0.1` -> Girar Izquierda.
    *   Acelerador: Si `abs(error) < 0.5` -> Acelerar a top. Si la curva es cerrada -> Frenar un poco.

```gdscript
func process_ai(delta):
    var target = waypoints[current_idx].global_position
    var direction_to_target = (target - global_position).normalized()
    var forward = Vector2.UP.rotated(rotation)
    
    # Producto Cruz o Angulo para saber si girar izq/der
    var angle_to = forward.angle_to(direction_to_target)
    
    # Input simulado
    turn_input = clamp(angle_to * sensivity, -1, 1)
    
    # Cambiar de waypoint si estamos cerca
    if global_position.distance_to(target) < 100:
        current_idx = (current_idx + 1) % waypoints.size()
```

### Rubber Banding (La Goma Elástica)
Para que la carrera sea siempre tensa (ni muy fácil ni imposible).
*   **Si la IA va ganando por mucho**: Reducir su `max_speed` un 10%.
*   **Si el Jugador deja atrás a la IA**: Aumentar `max_speed` de la IA un 20% (el famoso "catch-up" injusto de Mario Kart).
*   Esto se ajusta dinámicamente cada segundo chequeando la distancia entre jugador y rival.

## 3. Tarea para el Lector
*   Dibujar un circuito "Donut Plains" en Photoshop/Grimp (1024x1024).
*   Trazar las colisiones en Godot.
*   Poner los Waypoints.
*   Ver a la IA completar una vuelta sola sin chocarse.
