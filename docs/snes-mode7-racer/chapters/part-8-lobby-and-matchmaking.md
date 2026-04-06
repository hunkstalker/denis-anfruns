# Part 8: Lobby & Matchmaking (Infraestructura)

## Objetivo Didáctico
Convertir la demo técnica en un producto usable. Nadie quiere conectarse por consola de comandos.
Crearemos la "Envoltura" del juego: Menús de conexión, sala de espera (Lobby) y gestión de ciclo de vida de la sesión.

**Meta Final del Capítulo**: Poder abrir el juego, poner un nombre, unirse a una IP, ver a otros jugadores en la lista, y empezar la carrera todos a la vez.

---

## 1. El Lobby (Sala de Espera)
Antes de cargar el circuito (Fase pesada), los jugadores se reúnen en una escena ligera.

### Estructura de Datos
```gdscript
var players = {
    1: { "name": "Host", "ready": false, "skin": 0 },
    23482: { "name": "Invitado", "ready": true, "skin": 2 }
}
```
*   Uso de RPCs para actualizar esta lista: `rpc("register_player", info)`.
*   UI: Lista dinámica (`VBoxContainer`) mostrando nombres y estado "Listo".

## 2. El Proceso de Conexión (Handshake)
1.  **Join**: Cliente conecta y envía `request_join(name)`.
2.  **Validación**: Servidor chequea si hay hueco (max 8 players) y si la partida no ha empezado.
3.  **Sync**: Servidor envía el estado actual del lobby al nuevo cliente.
4.  **Broadcast**: Servidor avisa a los demás: "Ha entrado Pepe".

## 3. Sincronización de Inicio (Game Start)
No queremos que uno empiece a correr antes de que el otro haya cargado el mapa.
1.  Host pulsa "Start Game".
2.  Servidor envía RPC `load_level("Track1")`.
3.  Clientes cargan escena y pausan (`get_tree().paused = true`).
4.  Clientes envían RPC `level_loaded()` al servidor.
5.  Cuando el Servidor tiene confirmación de TODOS:
    *   Envía RPC `start_countdown()`.
    *   Todos ven el 3, 2, 1... sincronizado.

## 4. Gestión de Desconexiones
¿Qué pasa si el Host se va? ¿O un jugador se cae?
*   Señal `peer_disconnected`.
*   Limpieza de nodos (borrar el kart del jugador desconectado).
*   Migración de Host (Host Migration) es tema avanzado, pero implementaremos al menos un "Game Over: Host Left" elegante.

## 5. Tarea para el Lector (Graduación)
*   Empaquetar el juego (`Export`) a .exe / .html5.
*   Subirlo a Itch.io.
*   Jugar una carrera real con un amigo a través de Internet (usando Port Forwarding o ZeroTier).
*   **Celebrarlo**: ¡Has construido un Mario Kart Online desde cero!
