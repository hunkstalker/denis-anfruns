# Part 7: Latency Hiding (Magia contra el Lag)

## Objetivo Didáctico
Hacer que el juego online se sienta tan rápido como el local (Zero Latency Feel).
Este es el capítulo más complejo técnicamente del curso. Implementaremos los algoritmos que usan juegos como *Rocket League* o *Overwatch* para luchar contra las leyes de la física (velocidad de la luz).

**Meta Final del Capítulo**: Conducir el kart con respuesta instantánea, incluso simulando 200ms de latencia artificial, sin que se note tirones.

---

## 1. Predicción del Cliente (Client-Side Prediction)
Solución al input lag: **"Muévete ahora, pide perdón después"**.

### Algoritmo
1.  Cuando el jugador pulsa `W`:
    *   No esperar al servidor.
    *   Ejecutar la física localmente y mover el sprite YA.
    *   Guardar este "Input + Estado Resultante" en un buffer (historial).
2.  Enviar el Input al Servidor igualmente.

### El Problema de la Desincronización
El cliente predice, pero puede equivocarse (ej. chocó con otro jugador que aún no veía).
El servidor manda la "Verdad" (`position = 100`) pero el cliente ya predijo (`position = 105`).
Si simplemente sobrescribimos `pos = 100`, el jugador verá un salto hacia atrás ("Rubber banding").

## 2. Reconciliación del Servidor (Server Reconciliation)
Cómo corregir el error suavemente (o bruscamente si es necesario).

### Algoritmo de Re-simulación
Cuando llega un paquete del servidor ("En el tick 50 estabas en X"):
1.  Comparar con nuestro historial del tick 50.
2.  ¿Coinciden? (Diferencia < 0.1): Genial, predicción correcta. Descartar historial antiguo.
3.  **¿Difieren? (Error de predicción)**:
    *   Resetear la posición del coche a la del servidor (Tick 50).
    *   **Re-aplicar** todos los inputs guardados desde el Tick 51 hasta el actual (Tick 60) instantáneamente en un bucle.
    *   Resultado: El coche se corrige a la posición válida "presente" instantáneamente.

## 3. Interpolación de Entidades (Rivales Suaves)
Los otros coches no los predecimos (no sabemos qué pulsará el rival). Solo recibimos sus posiciones a saltos (ticks).
*   Si pintamos directo: Temblores y teleportaciones.
*   **Solución**: Buffer de Interpolación.
    *   Renderizamos a los rivales ~100ms en el pasado.
    *   Si estamos en tiempo `T`, interpolamos entre el paquete recibido en `T-100` y `T-50`.
    *   `global_position = pos_antigua.lerp(pos_nueva, factor_tiempo)`
    *   Efecto: Movimiento mantequilla, aunque ligeramente retrasado (imperceptible en carreras).

## 4. Tarea para el Lector
*   Implementar el buffer circular de inputs e historia de estado.
*   Añadir una opción de "Fake Lag" (retrasar paquetes 200ms) para probar la robustez del sistema.
*   Verificar que el coche se conduce suave incluso con lag.
