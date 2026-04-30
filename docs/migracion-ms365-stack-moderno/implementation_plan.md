# DEVLOG: MIGRACIÓN DE MS365 A STACK MODERNO (DASHBOARD INSTANTÁNEO)

## 1. RESUMEN EJECUTIVO Y CONTEXTO DEL PROBLEMA
Sustitución de arquitectura M365 (SharePoint + Power Apps + Power Automate) por un stack moderno basado en código y BDD real.

**El Dolor Corporativo (Pain Points Reales a erradicar):**
- **Power Automate (Rendimiento Absurdo):** Parsear un Excel de 800 registros para filtrar y acabar volcando 501 líneas en SharePoint provoca el colapso del editor web (consumo de 4 GB de RAM en el equipo) y ejecuciones lentísimas de hasta 50 minutos.
- **Power Apps (Inconsistencia de Estado):** Fallos al transformar y mostrar datos eficazmente en tablas. La ejecución de *PowerFx* y el orden de carga de datos en los eventos `OnVisible` resulta poco predecible y errático creando cargas "fantasma" o datos vacíos.

**Objetivo de la Migración:**
- Sustituir la limitación por un backend puro (Supabase/Postgres) de latencia cero.
- Visualización interactiva de +10,000 registros con filtros instantáneos (<100ms) sin bloqueos del navegador.
- **Modelo:** Enrutamiento tipado + Funciones de servidor (RPC).
- **Seguridad:** Row Level Security (RLS) vinculado a Microsoft Entra ID.

**Análisis de Costes (Trade-offs de Negocio):**
- **Licenciamiento Ineficiente:** Las licencias *Premium* de Power Automate / Power Apps (necesarias para sortear límites de llamadas) suponen costes escalonados por usuario o entorno. Un plan *Pro* base de Supabase (~$25/mes) absorbe una carga infinitamente mayor con latencia nula a un coste fijo menor.
- **Transaccionalidad de Emails:** El miedo a "perder el envío de correos gratuito de Automate" desaparece al usar el Auth de MS365. Estando el usuario validado en **Entra ID**, nuestra app puede llamar a la **Microsoft Graph API** (`Mail.Send` o `Mail.Send.Shared`) para escupir notificaciones directamente desde el servidor de correo de la empresa corporativa, manteniendo el rastro de envío original del trabajador a coste **CERO** adicional.

---

## 2. STACK TÉCNICO
- **Framework:** TanStack Start (React + Server SSR + Type-Safe Routing).
- **Base de Datos:** PostgreSQL (Supabase).
- **Frontend:** React + TanStack Table (Lógica) + TanStack Virtual (Scroll).
- **Autenticación:** Supabase Auth (OAuth con Microsoft / SSO Corporativo).

---

## 3. ARQUITECTURA DE DATOS (POSTGRESQL)
### 3.1. Esquema
- Migrar listas de SharePoint a tablas relacionales.
- Crear índices B-Tree en columnas de filtro: `fecha`, `id_proyecto`, `departamento`.

### 3.2. Row Level Security (RLS)
Configurar políticas para que el usuario solo reciba los datos que le pertenecen. El comando SQL para Supabase es el siguiente:

    ALTER TABLE presupuestos ENABLE ROW LEVEL SECURITY;

    CREATE POLICY "Acceso por email corporativo" 
    ON presupuestos 
    FOR SELECT 
    USING (auth.jwt() ->> 'email' = responsable_email);

---

## 4. FRONTEND Y RENDIMIENTO
### 4.1. Estrategia de Carga
1. **Enrutamiento Tipado:** TanStack Router asegura la validez de cada URL y sus parámetros (`searchParams` para filtros) en tiempo de compilación.
2. **Server Functions (RPC):** Llamadas seguras desde el servidor integrado de TanStack Start contra Supabase antes de hidratar el cliente.
3. **Virtualización:** Solo renderizar las ~30 filas visibles del set de 10,000.

### 4.2. Filtros Dinámicos (UX)
- **Filtros en Cliente:** Filtros de TanStack Table instantáneos (0ms de red).
- **URL State:** Sincronizar filtros con `URLSearchParams`.

---

## 5. INTEGRACIÓN CORPORATIVA (M365)
- **SSO:** Configurar App Registration en Azure Portal (Entra ID).
- **Scopes:** `openid`, `email`, `profile`.

---

## 6. TAREAS PARA EL AGENTE DE IA
1. Crear Boilerplate de TanStack Start + Supabase SDK.
2. Generar Script de migración (Excel/SharePoint -> Postgres).
3. Implementar componente de Tabla Virtualizada con `useVirtualizer`.
4. Configurar Auth corporativo con `signInWithOAuth`.

---

## ESTRUCTURA DEL CASO DE ESTUDIO (SYSTEM DESIGN PAPER)

*Enfoque principal: Documento de Arquitectura y Toma de Decisiones Técnicas (Trade-offs).*
*Este no es un devlog de "curso paso a paso", sino un "Case Study" profesional para el portfolio, que acompaña a una Demo funcional, explicando cómo y por qué se ideó el producto desde cero.*

- [ ] **Capítulo 1: La Trampa de SharePoint (El Cuello de Botella)**
  - *Enfoque*: Por qué SharePoint Lists y Power Apps colapsan al manejar filtros multi-paramétricos en grandes volúmenes de datos. Planteamiento del salto arquitectónico hacia Postgres y TanStack Start.
  - *Densidad esperada*: Media (Diseño de arquitectura).
- [ ] **Capítulo 2: Migración Densa y Estructurado en Postgres**
  - *Enfoque*: Setup de Supabase. Definición del esquema con alto rendimiento mediante índices en columnas críticas (`B-Tree`). Script de ingesta local.
  - *Densidad esperada*: Corta/Media (SQL puro y utilidades).
- [ ] **Capítulo 3: Entra ID (SSO) y Row Level Security**
  - *Enfoque*: El núcleo de la seguridad. Configuración de Azure App Registration. Masterclass sobre protección desde la propia BDD con políticas RLS (Row Level Security) usando claims del token JWT para restringir datos sin validaciones en Frontend.
  - *Densidad esperada*: Alta (Seguridad Corporativa e integraciones pesadas).
- [ ] **Capítulo 4: La Elección Full-Stack (TanStack Start vs Alternativas)**
  - *Metodología*: Análisis de Trade-offs y Patrones de Arquitectura.
  - *Enfoque*: 
    - **El Desafío**: Requisito de SSR y llamadas seguras atómicas sin introducir la rigidez y mutaciones constantes de Next.js App Router.
    - **La Decisión Técnica**: Elección de TanStack Start motivada por su enrutamiento dictatorial 100% tipado en tiempo de compilación.
    - **Resolución**: Creación de *Server RPCs* (Remote Procedure Calls) que blindan el SDK de Supabase en el servidor, devolviendo solo los datos puros a la UI sin filtraciones.
  - *Perfil de Lectura*: Senior / Tech Lead (Evaluación de Stack).
- [ ] **Capítulo 5: Resolución del Cuello de Botella del DOM (Virtualización)**
  - *Metodología*: Auditoría de Rendimiento (Benchmarking) y UX Estratégica.
  - *Enfoque*: 
    - **El Desafío**: El navegador Chrome claudica (reflows infinitos) intentando pintar 10.000 filas de facturas o presupuestos que requiere el negocio.
    - **La Decisión Técnica**: Romper la tabla estándar. Adoptar TanStack Table para el control de estado *headless* y TanStack Virtual para el reciclaje visual limitado a 30 nodos en pantalla.
    - **Resolución**: Conexión bidireccional entre la tabla virtualizada y la URL del navegador. Resultado: enlaces compartibles entre directivos con los filtros aplicados en tiempo real a 60fps estables.
  - *Perfil de Lectura*: Frontend Architect / Performance Engineer.
