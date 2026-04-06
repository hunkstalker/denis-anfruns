# Part 6: WebSocket Server (Node.js)

## Objetivo Didáctico
Abandonamos el navegador un momento para crear el "Cerebro" de la red.
Usaremos `ws` (librería ligera) en Node.js para recibir inputs y enviar estados.

**Meta**: Un servidor que imprime "Jugador Conectado" y retransmite posiciones.

## 1. Setup del Servidor
```bash
npm init -y
npm install ws
```

## 2. El Game Loop del Servidor
El servidor debe correr a 60Hz (o 20Hz) igual que el juego.
```javascript
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

let players = {};

// Physics Loop (Headless)
setInterval(() => {
    for (let id in players) {
        let p = players[id];
        // Aplicar Input acumulado
        if (p.input.up) p.velocity += p.accel;
        // ... Física (Mismo código que en cliente idealmente) ...
    }
    
    // Broadcast Estado (Snapshot)
    const snapshot = JSON.stringify(players);
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(snapshot);
        }
    });
}, 1000 / 60);
```

## 3. Protocolo Binario (Didáctico)
Enviar JSON es fácil pero lento (banda ancha).
Enseñar a usar `ArrayBuffer` es clave.
*   Byte 0: Tipo de mensaje (1=Input, 2=Update).
*   Bytes 1-4: Player ID.
*   Bytes 5-8: Posición X (Float32).
*   etc.
```typescript
// Cliente enviando input binario
const buffer = new ArrayBuffer(5);
const view = new DataView(buffer);
view.setUint8(0, MSG_INPUT);
view.setUint8(1, inputMask); // Bits comprimidos
socket.send(buffer);
```
