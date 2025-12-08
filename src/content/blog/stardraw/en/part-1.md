---
title: 'StarDraw ✨'
description: 'Starting to develop StarDraw, a project to master React and create my first public project.'
pubDate: '2025-11-22 20:28'
tags: ['react', 'konva', 'zustand', 'stardraw', 'excalidraw']
series: 'StarDraw'
lang: 'en'
heroImage: '/assets/stardraw/hero-stardraw.png'
---

## StarDraw: Project Kickoff

The main goal of this project is to learn how to build an application from scratch using modern technologies. The idea was born from my curiosity to master technologies like <span class='text-[--tangerine]'>React</span> and <span class='text-[--tangerine]'>TypeScript</span>. I needed a project that would require me to work with components since, professionally, I've only worked with <span class='text-[--tangerine]'>Power Apps</span>, fixing style bugs in production projects, and developing my own site in <span class='text-[--tangerine]'>Astro</span>. Finally, I need to fill my portfolio with a project, so if this one succeeds, it could be my first public work.

I'm not just looking to clone features, but <span class='text-[--tangerine]'>to understand the "why" behind each technical decision</span>, how it works, and add some ideas that make my tool more useful than the original.

For these things, I've started using <span class='text-[--tangerine]'>Gemini 3</span> to recommend technologies and design patterns, asking for documentation and examples with links to the sources. For example, it recommended <span class='text-[--tangerine]'>Zustand</span> for global state management, a technology I knew existed but hadn't tried. It also recommended <span class='text-[--tangerine]'>React Konva</span> for canvas handling, a technology I had no idea existed, but I've seen it will solve the creation of most of the tools I need for the project.

### The Idea

While learning, the idea is to build an Excalidraw clone but customized to my taste, both in design and functionality, with some extras since I miss certain features in the original tool.

- Better color control in dark mode.
- Save/export directly a PNG/JPG image of any selected canvas element.
- Grid snapping for elements.
- More typography options for text.
- Better text size management.
- Better text color management.
- Support for node diagrams or databases.

Important parts I want to keep are the <span class='text-[--tangerine]'>"local first" philosophy</span> and the ability to export projects in a format that can later be loaded and continue editing.

### Tech Stack

#### 1. React 19 + Vite + TypeScript
I haven't worked much on projects from scratch with React, but from everything I've read so far, I know it's a mature technology and that's why I chose it, plus I need to learn it along with TypeScript.
I have to add that I'm a performance enthusiast and I think alternatives like <span class='text-[--tangerine]'>Svelte</span> or <span class='text-[--tangerine]'>Solid</span> would be better in that regard. But since these technologies don't have as long a track record and have gaps in terms of available libraries, it seemed sensible to start with React.

#### 2. Konva (React Konva)
Here I was guided a lot by Gemini 3, which recommended using <span class='text-[--tangerine]'>Konva</span> for Canvas handling. According to it, "working directly with the browser's Canvas API is verbose and complex to maintain. Konva offers us an object-oriented abstraction (layers, groups, shapes) and `react-konva` allows us to handle it declaratively, integrating perfectly with React's lifecycle."

Well, I'll trust it. At some point I want to get my hands on Canvas even if it's for some small nonsense. I want to know the differences between what Canvas offers or a library like Konva.

#### 3. Zustand
This was pretty clear to me. It's a lightweight and widely used library for global states. It's not the only option, but it seems to be one of the simplest and easiest to use.

#### 4. Auxiliary Tools
More recommendations from Gemini 3.
- **<span class='text-[--tangerine]'>SortableJS</span>**: To allow reordering layers or UI elements easily with D&D (not Dungeons & Dragons, Drag & Drop).
- **<span class='text-[--tangerine]'>Tailwind CSS</span>**: A somewhat unnecessary recommendation, I already planned to use it. For now in this project my goal is not to master CSS. On the other hand, I also think it has surpassed **Bootstrap** which I got tired of using during my study years.

### First Development Steps

I started the project by creating the base for `react-konva` and the main tools panel interface. For icons, I used <span class='text-[--tangerine]'>lucide-react</span>. Nothing out of the ordinary for now, just a few Button elements and Tailwind styling. The second thing I wanted to tackle is dark mode for visual comfort while working on the project, so I also added a button to toggle the theme.

Ignore the slider and the dot background, this screenshot and the header one are from the version at the time of writing this article, so I've already given you a little spoiler 😁

![image](/assets/stardraw/panel-herramientas.png)

What impressed me the most at the beginning was everything that `react-konva` covers. It makes developing the tools I need for the project much easier.

So I already had the folder structure defined, dependencies installed, and a canvas with a tools panel that had a working button that toggled between light and dark mode. Step by step.