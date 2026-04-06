# Setup Guide: Raycasting Engine (TypeScript)

## 1. Entorno de Desarrollo (Tooling)
Para garantizar un entorno moderno y rápido, usaremos **Vite** como bundler y dev-server.

### Inicialización
El agente debe ejecutar:
```bash
npm create vite@latest raycasting-engine -- --template vanilla-ts
cd raycasting-engine
npm install
```

### Configuración TypeScript (`tsconfig.json`)
Es vital activar el modo estricto para que el código del devlog (que asume tipos seguros) funcione bien.
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "strict": true, // IMPRESCINDIBLE
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
```

## 2. Estructura de Carpetas
```text
src/
├── app.ts          # Entry point (Main Loop)
├── engine/         # El Core del Motor
│   ├── Camera.ts
│   ├── Map.ts
│   ├── Raycaster.ts
│   └── TextureManager.ts
├── game/           # Lógica Específica (Wolf3D Clone)
│   ├── Player.ts
│   └── Entities/
└── assets/         # Texturas e imágenes
    ├── textures/   # Paredes (64x64)
    └── sprites/    # Objetos y Enemigos
```

## 3. Boilerplate HTML (`index.html`)
El canvas debe estar preparado para el escalado pixelado (Crisp edges).
```html
<style>
  body { margin: 0; background: #333; display: flex; justify-content: center; align-items: center; height: 100vh; }
  canvas { 
    image-rendering: pixelated; /* CRÍTICO para el look retro */
    width: 640px; /* Escalado x2 */
    height: 400px;
  }
</style>
<body>
  <canvas id="screen" width="320" height="200"></canvas>
  <script type="module" src="/src/app.ts"></script>
</body>
```

## 4. Notas Técnicas para el Agente
*   **Math**: No usar librerías externas (`gl-matrix`, `three.js`). Toda la matemática vectorial debe implementarse manualmente (`Vector2` class propia) con fines didácticos.
*   **Performance**: Usar `requestAnimationFrame` y evitar `new Object` dentro del bucle principal.
