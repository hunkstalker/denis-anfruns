# Asset Manifest & Fallbacks: SNES Mode 7 Racer

## Objetivo
Permitir la construcción del "Vertical Slice" sin importar ni un solo archivo `.png` externo. Usaremos los nodos de generación procedimental de Godot.

## 1. El Circuito (Track Texture)
La textura del Modo 7 debe ser de 1024x1024.
*   **Nodo**: `SubViewport` (Render Target).
*   **Generación**:
    1.  Añadir un `ColorRect` (Asfalto Gris Oscuro) de fondo.
    2.  Usar un `Line2D` con ancho 128px para dibujar el circuito (loop cerrado). "Pintar" sobre el fondo.
    3.  Usar `TextureRect` con `NoiseTexture2D` (FastNoiseLite) verde para el césped en una capa inferior.
    4.  **Resultado**: El `ViewportTexture` de este SubViewport será la entrada para el Shader Mode 7.

## 2. Karts (Sprites)
En lugar de `Sprite2D` con textura, usaremos una escena compuesta por Nodos de dibujo vectorial.
*   **Nodo Raíz**: `Node2D` (contenedor del visual).
*   **Cuerpo**: `Polygon2D`. Dibujar una forma de "Flecha gorda" o coche estilizado.
    *   Color: `Export var body_color`. (P1=Rojo, CPU=Azul).
*   **Ruedas**: 4 `ColorRect` negros en las esquinas.
*   **Sombra**: `Polygon2D` negro semitransparente (`modulate.a = 0.5`) debajo del cuerpo.
*   **Animación de Giro**: Como no tenemos frames de rotación, simplemente rotaremos el nodo visual (aunque en SNES real no se hacía así, para el prototipo es válido).

## 3. Props (Árboles/Monedas)
*   **Árbol**: `Polygon2D` verde (triángulo) + `ColorRect` marrón (tronco).
*   **Moneda**: `Polygon2D` amarillo (rombo) animando su escala X (`sin(time)`) para simular giro.

## 4. UI Elements
*   **Panel**: `StyleBoxFlat` con `border_width = 4`, `bg_color = Black`.
*   **Iconos**: Usar Emojis Unicode en `Label` o formas básicas.
    *   Cara: `Label` con texto ":)".
    *   Ready: `ColorRect` Verde.
