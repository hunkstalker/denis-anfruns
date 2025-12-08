---
title: 'StarDraw ✨'
description: 'Inici del desenvolupament de StarDraw, un projecte per dominar React i crear el meu primer projecte públic.'
pubDate: '2025-11-22 20:28'
tags: ['react', 'konva', 'zustand', 'stardraw', 'excalidraw']
series: 'StarDraw'
lang: 'ca'
heroImage: '/assets/stardraw/hero-stardraw.png'
---

## StarDraw: Inici del projecte

L'objectiu principal d'aquest projecte és aprendre a crear una aplicació des de zero utilitzant tecnologies modernes. La idea va néixer de la curiositat de dominar tecnologies com <span class='text-[--tangerine]'>React</span> i <span class='text-[--tangerine]'>TypeScript</span>. Necessitava un projecte que em requerís l'ús de components ja que fins al moment a nivell professional només he treballat amb <span class='text-[--tangerine]'>Power Apps</span>, en la solució d'errors d'estils en projectes ja en producció i en el meu propi lloc desenvolupat en <span class='text-[--tangerine]'>Astro</span>. Finalment necessito omplir el meu portfoli amb algun projecte així que si aquest projecte té èxit podria ser el primer.

No busco només clonar funcionalitats, sinó <span class='text-[--tangerine]'>entendre el "per què" darrere de cada decisió tècnica</span>, com funciona i aportar algunes idees que facin la meva eina més útil que l'original.

Per a aquestes coses he començat a usar <span class='text-[--tangerine]'>Gemini 3</span> perquè em recomani tecnologies i patrons de disseny demanant-li la respectiva documentació i exemples amb enllaços per consultar les fonts. Per exemple, em va recomanar <span class='text-[--tangerine]'>Zustand</span> per al maneig d'estat global, tecnologia que sabia de la seva existència però que no havia provat. També em va recomanar <span class='text-[--tangerine]'>React Konva</span> per al maneig del canvas, tecnologia que en aquest cas no tenia ni idea de la seva existència, però he vist que em solucionarà la creació de la majoria de les eines que necessito per al projecte.

### La idea

Mentre aprenc, la idea és construir un clon d'Excalidraw però personalitzat al meu gust, tant en disseny com en funcionalitats, amb alguns extres donat que trobo a faltar coses a l'eina original.

- Millor control dels colors en mode fosc.
- Desar/exportar directament una imatge PNG/JPG de qualsevol element seleccionat del canvas.
- Ajust de quadrícula per als elements.
- Més opcions de tipografia per als textos.
- Millor gestió de mides de text.
- Millor gestió de colors de text.
- Suport per a diagrames tipus de nodes o bases de dades.

Parts importants que vull mantenir són la <span class='text-[--tangerine]'>filosofia "local first"</span> i la possibilitat d'exportar els projectes en un format que més tard es pugui carregar i continuar editant.

### Stack Tecnològic

#### 1. React 19 + Vite + TypeScript
No he treballat gaire en projectes des de zero amb React, però per tot el que tinc llegit fins ara sé que és una tecnologia madura i per això l'he triat, a més que tinc la necessitat d'aprendre'l juntament amb TypeScript.
He d'afegir que sóc un fanàtic del rendiment i crec que alternatives com <span class='text-[--tangerine]'>Svelte</span> o <span class='text-[--tangerine]'>Solid</span> serien millors en aquest sentit. Però en no ser tecnologies amb tant recorregut i que tenen mancances respecte a la quantitat de biblioteques disponibles, m'ha semblat sensat començar amb React.

#### 2. Konva (React Konva)
Aquí em vaig deixar guiar molt per Gemini 3, que em va recomanar usar <span class='text-[--tangerine]'>Konva</span> per al maneig del Canvas. Segons em va dir, "treballar directament amb l'API de Canvas del navegador és verbós i complex de mantenir. Konva ens ofereix una abstracció orientada a objectes (capes, grups, formes) i `react-konva` ens permet manejar-lo de forma declarativa, integrant-se perfectament amb el cicle de vida de React."

Bé, em refiaré. Igualment en algun moment vull ficar les urpes al Canvas encara que sigui per a alguna petita ximpleria. Vull conèixer les diferències entre el que ofereix Canvas o una biblioteca com Konva.

#### 3. Zustand
Això ho vaig tenir bastant clar. És una biblioteca lleugera i molt utilitzada per als estats globals. No és l'única opció, però em sembla que és una de les més simples i fàcils d'usar.

#### 4. Eines Auxiliars
Més recomanacions de Gemini 3.
- **<span class='text-[--tangerine]'>SortableJS</span>**: Per permetre reordenar capes o elements de la UI fàcilment amb D&D (Dungeons & Dragons no, Drag & Drop).
- **<span class='text-[--tangerine]'>Tailwind CSS</span>**: Una recomanació una mica innecessària, ja tenia pensat utilitzar-la. Per ara en aquest projecte el meu objectiu no és dominar CSS. D'altra banda a més crec que s'ha imposat a **Bootstrap** el qual ja em vaig cansar d'usar en els meus anys d'estudi.

### Primers passos del desenvolupament

Vaig començar el projecte creant la base per a `react-konva` i la interfície principal del panell d'eines. Per als icones vaig utilitzar <span class='text-[--tangerine]'>lucide-react</span>. Res de l'altre món per ara, només uns pocs elements Button i estils amb Tailwind. El segon que vaig voler abordar és el mode fosc per comoditat visual per treballar en el projecte, per la qual cosa també vaig afegir un botó per canviar el tema.

Ignoreu l'slider i el fons de punts, aquesta captura i la de la capçalera és de la versió en el moment d'escriure aquest article, així que ja us he fet un petit spoiler 😁

![image](/assets/stardraw/panel-herramientas.png)

El que més em va impressionar a l'inici és tot el que cobreix `react-konva`. Facilita molt el desenvolupament de les eines que necessito per al projecte.

Així que ja tenia l'estructura de carpetes definida, dependències instal·lades i un canvas amb un panell d'eines en el qual hi havia un botó funcional que canviava entre el mode clar i fosc. Pas a pas.