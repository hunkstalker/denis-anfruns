# Part 3: Arcade Drifting (Físicas de Karts Retro)

## Objetivo Didáctico
Olvidar la física realista. No queremos simular suspensiones ni torque de motor. Queremos simular la **sensación** de Mario Kart: agarre instantáneo, derrapes exagerados y control total.
Programaremos un controlador de personaje 2D "falso" que opera sobre vectores matemáticos puros para lograr ese gameplay "snappy".

**Meta Final del Capítulo**: Un Kart que se siente divertido de conducir, que derrapa con un saltito (Hop) y deja marcas en el suelo (aunque el suelo sea falso).

---

## 1. El Modelo Físico (Kinematic vs Dynamic)
Usaremos `CharacterBody2D` pero ignoraremos la gravedad.
Nuestro estado se define por:
*   `velocity` (Vector2): Hacia dónde nos movemos.
*   `rotation` (float): Hacia dónde miramos.
*   **La Regla de Oro del Drift**: En la vida real, miramos hacia donde vamos (casi). En el Drift, "desacoplamos" la dirección de la mirada de la dirección del movimiento.

## 2. Implementación del `KartController`

### Variables de Configuración (Tweakables)
Para conseguir el "feel" perfecto, necesitamos exponer muchas variables al inspector:
```gdscript
@export_group("Handling")
@export var acceleration = 800.0
@export var max_speed = 1200.0
@export var friction = 400.0
@export var turn_speed = 2.5 # Radianes/segundo
@export var drift_hop_force = 100.0 # El saltito visual
```

### La Máquina de Estados (State Machine)
El Kart tiene dos estados fundamentales: `GRIP` (Agarre) y `DRIFT` (Derrape).

#### Estado GRIP (Conducción Normal)
1.  **Acelerar**: Aplicar fuerza en la dirección `Vector2.UP.rotated(rotation)`.
2.  **Girar**: Cambiar `rotation` con Input Eje X.
3.  **Fricción Lateral (Agarre Infinito)**:
    En una física realista, si giras a 100km/h derrapas. En arcade NO.
    *   Hacemos que `velocity` gire instantáneamente con el coche.
    *   `velocity = velocity.length() * Vector2.UP.rotated(rotation)`

#### Estado DRIFT (La Clave de la Diversión)
Se activa al pulsar "Salto" (R) mientras giras.
1.  **El Hop (Salto)**:
    *   Visualmente desplazamos el sprite en Y local (`sprite.position.y -= jump_height`).
    *   No afecta la física 2D, es puro "juice".
2.  **Desacoplamiento**:
    *   Seguimos rotando el coche, pero el vector `velocity` **no rota con nosotros** instantáneamente.
    *   Aplicamos una fuerza de "interercia" que empuja el vector velocidad hacia nuestra nueva dirección poco a poco (Lerp).
    *   Esto crea el arco de derrape.

### Código Core (`_physics_process`)

```gdscript
func _physics_process(delta):
    # 1. Inputs
    var turn_input = Input.get_axis("ui_left", "ui_right")
    var gas_input = Input.get_action_strength("ui_up")
    
    # 2. Rotación
    rotation += turn_input * turn_speed * delta
    
    # 3. Aceleración
    var forward = Vector2.UP.rotated(rotation)
    if is_drifting:
        # En drift, aceleramos un poco menos o en dirección "promedio"
        pass
    else:
        velocity += forward * gas_input * acceleration * delta
    
    # 4. Fricción y Cap de Velocidad
    velocity = velocity.move_toward(Vector2.ZERO, friction * delta)
    velocity = velocity.limit_length(max_speed)
    
    # 5. La Magia del Drift (Corrección de Velocidad)
    if is_drifting:
        # El vector velocidad "resbala", no sigue al morro del coche inmediatamente
        # Solo corregimos un poquito (factor 0.95 por ejemplo)
        var current_dir = velocity.normalized()
        var target_dir = Vector2.UP.rotated(rotation)
        var drift_factor = 2.0 * delta # Ajustar para lo "resbaloso" que se sienta
        var new_dir = current_dir.lerp(target_dir, drift_factor).normalized()
        velocity = new_dir * velocity.length()
    else:
        # Grip total: Si nos movemos, nos movemos hacia donde miramos (casi)
        if velocity.length() > 10:
            velocity = Vector2.UP.rotated(rotation) * velocity.length()

    move_and_slide()
```

## 3. Feedback Visual (Juice)
Sin esto, el código anterior se siente "seco".
*   **Partículas de Humo**: Emitir `GPUParticles2D` en las ruedas traseras solo cuando `is_drifting == true`.
*   **Inclinación del Sprite (Banking)**:
    Si giramos a la derecha, rotamos el sprite ligeramente (no el cuerpo físico) visualmente para simular peso.
    `sprite.rotation = lerp(sprite.rotation, -turn_input * 0.2, 5 * delta)`

## 4. Tarea para el Lector
*   Implementar el script.
*   Ajustar las variables hasta que se sienta bien (Game Feel).
*   Añadir el sonido de "Skid" cuando entras en drift.
