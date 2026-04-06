# Setup Guide: SNES Mode 7 Racer (Web)

## 1. Inicialización (Vite)
El framework más rápido y ligero.
```bash
npm create vite@latest snes-racer-web -- --template vanilla-ts
cd snes-racer-web
npm install socket.io-client
npm install --save-dev @types/node
```

## 2. Server Setup (Backend)
Crear una carpeta `server/` separada (o dentro, si es monorepo).
```bash
mkdir server
cd server
npm init -y
npm install socket.io
```

## 3. Configuración del Canvas (Crisp Pixels)
En `style.css`:
```css
canvas {
    image-rendering: pixelated; /* Standard */
    image-rendering: crisp-edges; /* Firefox */
    width: 100%;
    height: 100%;
    object-fit: contain; /* Letterboxing automático */
    background: #000;
}
```

## 4. Estructura de Proyecto Sugerida
```text
src/
├── engine/
│   ├── PPU.ts          # VideoBuffer & Render Loop
│   ├── Mode7.ts        # Matematicas de proyección
│   └── Rasterizer.ts   # Sprites
├── game/
│   ├── Kart.ts
│   └── Track.ts
├── net/
│   └── Client.ts       # Socket.io wrapper
└── main.ts             # Entry point
```
