# Part 1: The Magic Shader (La Matemática del Modo 7)

## Objetivo Didáctico
Entender cómo "falsificar" 3D usando solo matemáticas 2D. Recrearemos el chip PPU de la SNES usando un Fragment Shader moderno en Godot.

**Meta Final del Capítulo**: Tener un plano de suelo infinito pixel-perfect que podemos rotar y mover, idéntico al de Mario Kart, corriendo a 6000 FPS.

---

## 1. Teoría: La Transformación Afín
Originalmente, la SNES manipulaba una matriz de transformación `[a, b, c, d]` línea por línea (HDMA). Nosotros usaremos vectores normalizados.

### El Concepto "Scanline"
Una cámara 3D real proyecta rayos. El Modo 7 proyecta **profundidad inversa**:
*   La parte inferior de la pantalla (`UV.y = 1`) está "cerca".
*   La parte superior (`UV.y = 0`) está en el "infinito".
*   La función mágica: `depth = 1.0 / (pixel_y + offset)`.

## 2. Implementación en Godot (Shader)

### Setup de la Escena
1.  Nodo `TextureRect` que ocupa toda la pantalla (`Anchor: Full Rect`).
2.  Textura: Un mapa de pruebas estilo "ajedrez" (tiled) de 1024x1024. `Repeat: Enabled`, `Filter: Nearest` (CRUCIAL para el look retro).
3.  Nuevo `ShaderMaterial` -> `New Shader`.

### El Código GLSL (Paso a Paso)

```glsl
shader_type canvas_item;

// Uniforms: Variables que controlamos desde GDScript (el Player)
uniform vec2 camera_position = vec2(0.0, 0.0);
uniform float camera_angle = 0.0;
uniform float horizon_height : hint_range(0.0, 1.0) = 0.5; // Dónde poner el cielo
uniform float fov_scale = 1.0; 

void fragment() {
    // 1. Coordenadas de Pantalla Normalizadas (0.0 a 1.0)
    vec2 screen_uv = SCREEN_UV;
    
    // Si estamos por encima del horizonte, no dibujamos suelo (o pintamos cielo)
    if (screen_uv.y < horizon_height) {
        COLOR = vec4(0.0, 0.5, 1.0, 1.0); // Cielo azul plano SNES
        return;
    }

    // 2. Linearizar la profundidad (La Magia)
    // Transformamos la Y de pantalla en una distancia Z en el mundo.
    // Cuanto más cerca del horizonte, metemos más distancia.
    float dist = fov_scale / (screen_uv.y - horizon_height);

    // 3. Proyección Inversa
    // Calculamos dónde cae este píxel en el mundo plano 2D (u, v)
    // El '0.5' centra la vista horizontalmente.
    vec2 world_pos;
    float dx = screen_uv.x - 0.5;
    
    // Matriz de Rotación 2D estándar
    float sin_a = sin(camera_angle);
    float cos_a = cos(camera_angle);
    
    // Aplicar rotación y escala por distancia
    world_pos.x = (dx * cos_a - dist * sin_a) + camera_position.x;
    world_pos.y = (dx * sin_a + dist * cos_a) + camera_position.y;

    // 4. Sampling (Con truco de perspectiva)
    // Dividimos por 'dist' para corregir la perspectiva de la textura
    // (Opcional: Si queremos pixelación perfecta, sampleamos world_pos directo)
    COLOR = texture(TEXTURE, world_pos * 0.01); // 0.01 para escalar la textura
}
```

## 3. Pixelación Hardware (The 'Crunchy' Look)
Los shaders modernos interpolan suavemente. Nosotros queremos píxeles "gordos".
*   Usar `texture_filter = nearest` en el Import Settings de la textura.
*   Renderizar el juego a resolucion real baja (ej. `320x240`) y escalar la ventana (`Window Override`).
*   Configuración del proyecto: `rendering/2d/snap/snap_2d_transforms_to_pixel = true`.

## 4. Tarea para el Lector
*   Crear un script `CameraDriver.gd` que modifique los uniforms `camera_position` y `camera_angle` con las flechas del teclado.
*   ¡Felicidades! Tienes un simulador de vuelo.
