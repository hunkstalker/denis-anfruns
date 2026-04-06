# Part 4: Arcade Physics System (TypeScript)

## Objetivo Didáctico
Traslación pura de la física de Godot a TypeScript nativo.
Necesitamos una clase `Vector2` (porque JS no la tiene) y un `PhysicsEngine` que actualice la posición de las entidades.

**Meta**: Un cuadrado que se mueve por la pantalla negra con inercia y drifting.

## 1. La Clase Vector2 (Matemática Básica)
```typescript
class Vector2 {
    x: number;
    y: number;
    constructor(x: number = 0, y: number = 0) { ... }
    add(v: Vector2) { this.x += v.x; this.y += v.y; return this; }
    rotate(angle: number) { ... }
    lerp(v: Vector2, t: number) { ... }
}
```

## 2. Kart Controller (Lógica de Juego)
```typescript
class Kart {
    pos: Vector2;
    vel: Vector2;
    angle: number;
    isDrifting: boolean;

    update(dt: number, input: InputState) {
        // 1. Giro
        if (input.left) this.angle -= TURN_SPEED * dt;
        if (input.right) this.angle += TURN_SPEED * dt;

        // 2. Aceleración (Vector Forward)
        const forward = new Vector2(Math.sin(this.angle), Math.cos(this.angle)); // Ojo: Sin/Cos dependen de tu sist. coord.
        
        if (input.gas) {
            this.vel.add(forward.scale(ACCEL * dt));
        }

        // 3. Fricción
        this.vel.scale(0.98); // Simple damping

        // 4. Drifting (Lerp Velocity)
        if (this.isDrifting) {
            // "Resbalar": Mezclar dirección actual con forward lentamente
        } else {
            // "Grip": Mezclar dirección actual con forward rápidamente
        }

        // 5. Integración
        this.pos.add(this.vel.clone().scale(dt));
    }
}
```

## 3. Tarea para el Lector
*   Implementar colisiones circulares simples (distancia < radio).
*   Evitar que el kart salga del mapa (Clamp coordinates).
