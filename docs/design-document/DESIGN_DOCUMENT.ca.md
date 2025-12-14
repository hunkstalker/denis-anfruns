# Document de Disseny

Aquest document descriu els principis bàsics d'UI/UX i els tokens de disseny del projecte. Aquestes regles garanteixen consistència, escalabilitat i una sensació prèmium en tot el lloc.

## 1. Sistema d'Espaiat (Ritme)

Utilitzem una quadrícula estàndard basada en 4px. L'espaiat no és arbitrari; segueix una escala matemàtica estricta per crear ritme visual.

### Buits de Quadrícula (Gaps)

Per a llistes i quadrícules de targetes, fem servir una **escala d'espaiat responsiva**.

- **Regla**: `grid gap-4 sm:gap-6 lg:gap-8`
- **Per què**: A mesura que creix la pantalla, el contingut necessita més "aire" (espai negatiu) per no veure's atapeït.
  - Mòbil: `16px` (gap-4)
  - Tauleta: `24px` (gap-6)
  - Escriptori: `32px` (gap-8)

### Farciment de Targetes (Breathing Room)

L'espaiat intern dins de les targetes també ha d'escalar.

- **Regla**: `p-4 sm:p-6`
- **Per què**: Les targetes més grans a l'escriptori se senten "buides" si el farciment és massa ajustat. Augmentar el farciment manté l'equilibri de densitat visual.

## 2. Components de Targeta

Les targetes (DevLogs, TILs) s'han de sentir com a germanes de la mateixa família de disseny.

- **Radi de la Vora**: `rounded-xl sm:rounded-2xl`
  - Comença més suau en pantalles petites, augmenta la rodonesa en dissenys més grans per a una sensació moderna i amigable.
- **Ombres**: `shadow-sm hover:shadow-md`
  - La subtilitat és clau. Fes servir ombres inicials petites que creixen en interactuar per donar feedback de profunditat.
- **Vores**: Vores fines i subtils que s'enfosqueixen lleugerament en passar el ratolí.
  - Clar: `border-zinc-200 hover:border-black/15`
  - Fosc: `border-zinc-700/50 hover:border-white/15`
- **Transicions**: `transition-shadow duration-300`
  - Suavitza sempre els canvis d'estat. Els salts bruscos se senten "barats".

## 3. Tipografia i Enllaços

La jerarquia del text guia l'ull de l'usuari.

- **Enllaços**: Dos tipus d'interaccions.
  - **Enllaços en línia**: Decoració de text estàndard o canvi de color.
  - **Enllaços d'Acció**: "Llegir més", "Veure tot".
    - **Estil**: Fes servir `text-[--tangerine-hover]`.
    - **Icona**: Aparella sempre amb una icona de fletxa (`ArrowUpRight` o `ArrowLink`).
    - **Interacció**: La fletxa s'ha d'animar en passar el ratolí (`group-hover:translate-x-1`). Aquest petit moviment assenyala "clicable/accionable".

## 4. Animacions (La Sensació "Prèmium")

El moviment ha de tenir un propòsit, no ser decoratiu.

- **Entrada Esglaonada (Cascada)**:
  - Les llistes no han d'aparèixer totes alhora. Fes servir un retard esglaonat (`index * 0.1s`).
  - **Direcció**: Lliscament cap amunt (`y: 20 -> y: 0`) i aparèixer (fade in).
  - **Sincronització**: Si apareixen diverses llistes una al costat de l'altra (ex. Feed del Blog + Sidebar), han de començar alhora ($t=0$).

- **Disseny Màgic (Magic Layout)**:
  - En filtrar o reordenar, els elements s'han de _lliscar_ a les seves noves posicions, no saltar. Fes servir la propietat `layout` de `framer-motion`.

## 5. Internacionalització (i18n)

- **Regla d'Or**: **RES de text "hardcoded"**.
  - Cada cadena visible ha de venir de `src/i18n/ui.ts`.
  - Els components han d'acceptar etiquetes a través de props (ex. `labels={{ readNote: t(...) }}`) per romandre purs i agnòstics a l'idioma.

---

_Adhereix-te a aquestes regles per a tots els components futurs per mantenir la integritat del disseny del lloc._
