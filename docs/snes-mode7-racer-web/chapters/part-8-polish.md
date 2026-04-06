# Part 8: Matchmaking & Polish (Web Publisihing)

## Objetivo Didáctico
La ventaja de la Web es que la UI es HTML. No necesitamos dibujar fuentes pixeladas a mano en el Canvas si no queremos. Podemos poner un `div` flotante precioso.

**Meta**: Un juego "Full Stack": Frontend (Game), Overlay (UI), Backend (Node). Desplegado en internet.

## 1. UI como Capa HTML
```html
<div id="game-container">
    <canvas id="screen"></canvas>
    
    <!-- HUD Overlay -->
    <div id="ui-layer">
        <div id="lap-counter">LAP 1/3</div>
        <div id="rank">1st</div>
    </div>
    
    <!-- Lobby Screen (Oculto al inicio) -->
    <div id="lobby-screen">
        <input type="text" id="username" placeholder="Tu Nombre">
        <button id="btn-join">JOIN GAME</button>
    </div>
</div>
```
CSS Grid para posicionar todo estilo "Retro CRT".

## 2. Deploy
*   **Frontend**: `npm run build` (Vite) -> Dist folder -> Netlify/Vercel.
*   **Backend**: Glitch / Render / Railway (Node.js hosting).
*   Enseñar a configurar la variable `env.VITE_SERVER_URL` para que el cliente sepa dónde conectarse en prod.
