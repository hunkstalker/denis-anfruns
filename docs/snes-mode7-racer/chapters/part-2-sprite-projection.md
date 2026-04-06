# Part 2: Sprite Projection (Objetos en un Mundo Plano)

## Objetivo Didáctico
El shader dibuja el suelo, pero... ¿y los árboles? ¿y los rivales?
No podemos usar nodos 3D normales porque nuestro "mundo" es una ilusión en un `TextureRect`. Tenemos que calcular manualmente dónde y a qué tamaño pintar los sprites 2D para que "encajen" en la perspectiva del shader.

**Meta Final del Capítulo**: Llenar el circuito de monedas y árboles que se agrandan al acercarse (Scaling) y giran con el mundo.

---

## 1. Teoría: World Space a Screen Space
Tenemos la posición del objeto en el mundo (`obj.x, obj.y`) y la cámara (`cam.x, cam.y, cam.angle`). Necesitamos saber en qué píxel `(screen.x, screen.y)` colocarlo.

Es el proceso **inverso** al del shader.
1.  **Traslación Relativa**: `rel_x = obj.x - cam.x`, `rel_y = obj.y - cam.y`.
2.  **Rotación (Des-rotar el mundo)**: Giramos la posición relativa por `-cam.angle` para alinearla con la vista de la cámara.
    *   `local_z = rel_x * sin(a) + rel_y * cos(a)` (Profundidad: Cuán lejos está "hacia adelante").
    *   `local_x = rel_x * cos(a) - rel_y * sin(a)` (Lateral: Cuán a la derecha/izquierda está).

## 2. La Clase `Mode7Object`
Crearemos una clase base para todos los objetos del juego.

```gdscript
class_name Mode7Object extends Sprite2D

@export var world_position: Vector2

func update_projection(cam_pos: Vector2, cam_angle: float, fov_scale: float, horizon_y: float):
    # 1. Transformación Relativa
    var rel = world_position - cam_pos
    var s = sin(-cam_angle)
    var c = cos(-cam_angle)
    
    # Coordenadas locales respecto a la cámara (Z es profunidad hacia adelante)
    var local_z = rel.x * s + rel.y * c
    var local_x = rel.x * c - rel.y * s
    
    # 2. Culling (No dibujar si está detrás de la cámara)
    if local_z <= 1.0: # Near plane
        visible = false
        return
    visible = true
    
    # 3. Proyección a Pantalla (La fórmula inversa al shader)
    # scale = fov / z
    var scale_factor = fov_scale / local_z
    
    # Posición X: Centro de pantalla + offset lateral escalado
    var screen_x = (get_viewport_rect().size.x * 0.5) + (local_x * scale_factor)
    
    # Posición Y: Horizonte + altura escalada (suponiendo que el objeto toca el suelo)
    # Nota: local_z ya está en el denominador, igual que en el shader (1/z)
    var screen_y = horizon_y + scale_factor 
    
    position = Vector2(screen_x, screen_y)
    
    # 4. Escalado del Sprite
    # Cuanto más cerca (menor Z), más grande.
    scale = Vector2(scale_factor, scale_factor) * base_scale
    
    # 5. Z-Index (Sorting)
    # En 2D no hay Z-Buffer real. Usamos z_index para que los objetos cercanos tapen a los lejanos.
    z_index = int(10000.0 / local_z) 
```

## 3. Optimizaciones de Rendimiento
En Python/GDScript puro, hacer esto para 1000 árboles puede ser lento.
*   **Visibilidad**: Solo calcular proyección si `local_z` está dentro de un rango razonable.
*   **Culling Lateral**: Si `screen_x` se sale mucho de la pantalla, también ocultar.
*   **Server**: Cuando hagamos multiplayer, usaremos una versión simplificada de esto (sin sprites) solo para lógica de colisión.

## 4. Tarea para el Lector
*   Crear una escena `Tree.tscn` con un Sprite de pino pixelado.
*   Instanciar 50 pinos en posiciones aleatorias.
*   Conducir entre el bosque y ver cómo la perspectiva "engaña" al ojo perfectamente.
