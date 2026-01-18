---
title: Estructura del Proyecto - Parte 2
description: Estructura de archivos y nodos al finalizar la Parte 2.
---

# Estructura del Proyecto Godot - Capítulo 2

## Archivos del Proyecto (Parte 2)

| Archivo | Tipo | Descripción |
| :--- | :--- | :--- |
| `scenes/bullet.tscn` | Escena | [NUEVO] El proyectil (Area2D). |
| `scripts/bullet.gd` | Script | [NUEVO] Lógica de la bala (movimiento y limpieza). |
| `scenes/player.tscn` | Escena | La nave del jugador (Actualizada con Muzzle). |
| `scripts/player.gd` | Script | Controlador actualizado con disparo. |
| `scenes/level.tscn` | Escena | Nivel principal. |

## Estructura completa al finalizar el capítulo

```text
res://
├── scenes/
│   ├── player.tscn
│   ├── level.tscn
│   └── bullet.tscn          ← [NUEVO] Escena de la bala
├── scripts/
│   ├── player.gd            ← Actualizado
│   └── bullet.gd            ← [NUEVO]
└── sprites/
    ├── plane_128.png
    └── shot-atlas.png       ← [NUEVO] Atlas de la bala (3 frame)
```

## Nodos de la Bala (bullet.tscn)

```text
Bullet (Area2D)
├── CollisionShape2D (Rectangle/Capsule)
├── AnimatedSprite2D (frames: shot-atlas.png)
└── VisibleOnScreenNotifier2D
```

## Cambios en el Player (player.tscn)

```text
Player (CharacterBody2D)
├── ...
└── Muzzle (Marker2D)        ← [NUEVO] Marcador para la salida del cañón
```
