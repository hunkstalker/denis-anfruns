# Part 6: Server Authority (El Servidor es Dios)

## Objetivo Didáctico
Entramos en la expansión Multiplayer. El objetivo es convertir nuestro juego local en online. Pero no de cualquier manera (P2P inseguro), sino profesional.
Aprenderemos a separar la lógica en **Cliente** (Input) y **Servidor** (Simulación) para evitar trampas.

**Meta Final del Capítulo**: Dos instancias del juego corriendo; una actúa como servidor y otra como cliente. El cliente se mueve, pero es el servidor quien realmente controla la física.

---

## 1. Arquitectura de Red en Godot

### High-Level Multiplayer API
Usaremos la API nativa de Godot (`ENetMultiplayerPeer`).
*   **Puerto**: 8910 (Un clásico).
*   **Protocolo**: UDP (Rápido, ideal para realtime).

### Concepto: Authority
En Godot, cada nodo tiene una "autoridad multiplayer" (el ID del peer que lo posee).
*   **Servidor (ID 1)**: Tiene autoridad sobre TODOS los Karts en cuanto a posición final.
*   **Cliente (ID X)**: Solo tiene autoridad sobre su propio nodo `PlayerInput`.

## 2. Implementación Autoritativa

### Paso 1: Separar Input de Física
Refactorizar `KartController`:
*   Antes: `_physics_process` leía `Input.get_axis()` directamente.
*   Ahora: `_physics_process` lee una variable `current_input` que viene de la red.

### Paso 2: RPCs (Remote Procedure Calls)
Cómo habla el cliente al servidor.
1.  El Cliente captura teclas (`W`, `A`, `D`) cada frame.
2.  Envía un paquete al servidor: `rpc_id(1, "send_input", { throttle: 1.0, steer: -0.5, timestamp: t })`.
3.  El Servidor recibe el input, lo valida (anti-cheat básico) y lo aplica a su simulación física del coche de ese jugador.

### Paso 3: Sincronización de Estado (State Sync)
Cómo habla el servidor a los clientes (para decirles dónde están realmente).
*   Usar `MultiplayerSynchronizer`.
*   Propiedades vigiladas: `position`, `rotation`, `velocity`.
*   Frecuencia: `60 Hz` (o menos si queremos optimizar ancho de banda, ej. 20Hz + interpolación).

### El Problema del Lag (Preview del Cap 7)
Al implementar esto "a pelo", notarás que al pulsar `W`, el coche tarda 100-200ms en reaccionar (ping ida y vuelta). Esto es **Lag de Input**. Es injugable para un juego arcade.
En este capítulo aceptaremos este lag para entender la arquitectura. En el siguiente, lo destruiremos.

## 4. Tarea para el Lector
*   Crear un menú simple con dos botones: "Host" y "Join".
*   Lograr que al pulsar Host se abra una ventana, y al pulsar Join en otra, aparezcan dos karts.
*   Verificar que si cierras el servidor, el cliente deja de moverse (prueba de autoridad).
