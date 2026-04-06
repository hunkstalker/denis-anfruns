# Part 7: Network Interpolation (Suavizando el Navegador)

## Objetivo Didáctico
El servidor Node.js envía actualizaciones a 20Hz (cada 50ms) para ahorrar ancho de banda.
Si el navegador pinta solo cuando llega el mensaje, el juego irá a saltos (20 FPS lógicos).
Necesitamos inventar frames intermedios.

**Meta**: Ver a los rivales moverse como mantequilla a 60 FPS aunque la red vaya a 20 FPS.

## 1. El Buffer de Estado
```typescript
type Snapshot = { time: number, players: PlayerData[] };
const serverBuffer: Snapshot[] = [];

socket.onmessage = (msg) => {
    const snap = parseBinary(msg.data);
    snap.time = Date.now(); // O timestamp del server
    serverBuffer.push(snap);
    if (serverBuffer.length > 10) serverBuffer.shift(); // Limpieza
};
```

## 2. Interpolación en el Render
Buscamos dos snapshots: uno "inmediatamente antes" y otro "inmediatamente después" del tiempo actual de renderizado (retrasado 100ms).

```typescript
function getInterpolatedState(renderTime: number) {
    // Encontrar Snap A y Snap B tal que: A.time < renderTime < B.time
    const snapshotA = ...;
    const snapshotB = ...;
    
    const total = snapshotB.time - snapshotA.time;
    const current = renderTime - snapshotA.time;
    const t = current / total; // 0.0 a 1.0 (Progreso)
    
    // Lerp
    return lerp(snapshotA.pos, snapshotB.pos, t);
}
```
