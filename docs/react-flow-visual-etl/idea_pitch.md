# IDEA DE PROYECTO: VISUAL NODE ETL (Mini-Automate)

## LA PREMISA
Crear una herramienta web estilo "Visual Scripting de Godot / Unreal Engine Blueprints", donde el usuario pueda conectar nodos mediante cables visuales para orquestar flujos de datos. 
El objetivo es humillar el rendimiento de herramientas como Power Automate al procesar Excels pesados directamente en el poder del navegador o servidor moderno.

## STACK TECNOLÓGICO PROPUESTO
- **Frontend / Lienzo Visual:** React Flow (La mejor librería para arrastrar, soltar y conectar Nodos tipo diagrama).
- **Core Lógico:** TypeScript o Node.js para el motor de ejecución secuencial ("Si un nodo lanza datos, inyéctalos en el siguiente cable").
- **Framework:** TanStack Start o Vite + React puro.

## ALCANCE PRAGMÁTICO: LENGUAJE DE PROGRAMACIÓN VISUAL
En lugar de un simple pipeline de Excels, construiremos el *Core* completo de un **lenguaje de programación visual** (Visual Scripting):

1. **Nodos "Core" (Fundamentos de Programación):**
   - **Variables (Set/Get):** Nodos para declarar estados, asignar variables iniciales y reescribirlas.
   - **Control de Flujo (Bucles y Condicionales):** Componentes para hacer un `For Each` (útil para recorrer las listas) y divisiones de cables de ejecución con `If / Branch`.
   - **Transformadores (Map & Math):** Lógica elemental para parsear objetos JSON y sumar/restar valores.
   - **Herramientas de Debug (Print/Console):** Un nodo esencial de log que alimente directamente a una ventana de consola *in-game* para ver el flujo pasar en vivo.

2. **Nodos de Interacción (Action API Nodes):**
   - Nodos diseñados para replicar y destrozar en rendimiento a tu **Flujo Real de Producción** actual:
     1. **Nodo File Reader (Extract):** Lee un Excel/CSV de golpe y convierte las filas en un array paseable de forma inmediata.
     2. **Nodo Base de Datos (Load/Upsert):** Inyecta el array procesado en Supabase (o BDD local).
     3. **Nodo Emisor de Email (Notify):** Al completar el ciclo de BDD, usa un servicio gratuito (como *Resend* o *SendGrid*) para disparar al vuelo un Log/Resumen con los errores o registros duplicados limpiados.

## VALOR PARA EL PORTFOLIO Y EXCLUSIVIDADES
Es uno de los proyectos arquitectónicos más difíciles y espectaculares que un único Frontend Tech Lead puede presentar. Implica:
- **Manipulación Avanzada:** DOM, Canvas interactivos matemáticos y ruteo de cables.
- **Motor Lógico:** Construcción matemática de estructuras AST (Abstract Syntax Trees) a partir de inputs gráficos.
- **Control de Versiones Nativo (Time Travel):** Para remarcar la superioridad sobre los desastrosos versionados de Power Apps/Automate, la arquitectura guardará el estado de los nodos como objetos puros JSON. Esto permite historiales de "Commits", viajes en el tiempo impecables (Ctrl+Z) y estados inmutables que no existen en los productos de Microsoft.
- **Bifurcación Creador/Usuario (UX Drop-Cards):** Cierre magistral de la experiencia de usuario (UX). Un flujo de nodos guardado se "compila" y se presenta en el Dashboard principal como una simple "Tarjeta Ejecutable". El usuario final no necesita ver los nodos: simplemente arrastra y suelta su Excel encima de la tarjeta y el flujo completo se ejecuta de forma asíncrona en la sombra, notificándole al acabar.
- **Estabilidad Corporativa:** Demuestra cómo resolver problemas de cuellos de botella (RAM y CPU) en sistemas de flujo asíncronos.
