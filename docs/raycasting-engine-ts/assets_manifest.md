# Asset Manifest & Procedural Fallbacks: Raycasting Engine

## Objetivo
Este documento instruye al Agente Desarrollador sobre cómo generar assets en tiempo de ejecución (Run-time Generation) para evitar dependencias de archivos externos (`.png`, `.jpg`) durante la fase de prototipo.

## 1. Texturas de Muros (64x64)
El sistema debe implementar una clase estática `TextureGenerator` que devuelva `Uint32Array` para cada tipo de muro.

### Muro 1: Ladrillos Azules (Blue Stone)
*   **Procedimiento**:
    1.  Rellenar con Azul Oscuro (`0xFF0000AA`).
    2.  Dibujar líneas horizontales grises cada 16 píxeles (mortero).
    3.  Dibujar líneas verticales alternadas (offset 8px) para formar ladrillos.
    4.  Añadir ruido aleatorio (+-10 al canal azul) para textura.

### Muro 2: Madera (Wood)
*   **Procedimiento**:
    1.  Rellenar con Marrón (`0xFF004488`).
    2.  Dibujar líneas verticales onduladas (Seno) más oscuras.

### Muro 3: Bandera/Águila
*   **Procedimiento**:
    1.  Igual que Ladrillo Azul.
    2.  En el centro (32,32), dibujar un círculo rojo o franja roja vertical.

## 2. Sprites & Objetos

### Generación via Canvas 2D
Para sprites, usa un `OffscreenCanvas` temporal, dibuja con `ctx` y extrae el `ImageData`.

| Objeto | Fallback Drawing (Canvas API) |
| :--- | :--- |
| **Barrel** | Rectángulo Marrón (`rect(20,20, 24, 40)`) + Aros negros. |
| **Guard** | Círculo Marrón (Cabeza) + Rectángulo Azul (Cuerpo). Píxeles "gordos". |
| **Key** | Círculo Dorado + Línea. |
| **Light** | Círculo Blanco con `shadowBlur` (brillo). |

## 3. UI Assets (Status Bar)

### Face (Cara del Héroe)
No intentes dibujar una cara realista.
*   **Base**: Círculo color carne (`#FFCCAA`).
*   **Ojos**: Dos píxeles negros. Moverlos 1px a la izq/der cada segundo (Idle animation).
*   **Sangre**: Si `health < 50`, dibujar píxeles rojos aleatorios sobre la cara.

### Fonts (Números)
No cargar `.ttf`.
*   Crear una matriz de bits de 3x5 o 5x7 para los números 0-9.
*   Pintarlos pixel a pixel en el buffer de la UI.
