---
title: Estructura del Proyecto - Parte 2
description: Estructura de archivos y nodos al finalizar la Parte 2.
---

# Estructura del Proyecto (Parte 2)

| Archivo | Tipo | Descripción |
| :--- | :--- | :--- |
| `scenes/bullet.tscn` | Escena | [NUEVO] El proyectil (Area2D). |
| `scripts/bullet.gd` | Script | [NUEVO] Lógica de la bala (movimiento y limpieza). |
| `scenes/player.tscn` | Escena | La nave del jugador (Actualizada con Muzzle). |
| `scripts/player.gd` | Script | Controlador actualizado con disparo. |
| `scenes/level.tscn` | Escena | Nivel principal. |
| `sprites/player.png` | Sprite | Sprite de la nave del jugador. |
| `sprites/shot-atlas.png` | Sprite | [NUEVO] Atlas de la bala (3 frames). |

## Estructura de Nodos (Bullet)

```text
Bullet (Area2D)
├── CollisionShape2D (Rectangle/Capsule)
├── AnimatedSprite2D (frames: shot-atlas.png)
└── VisibleOnScreenNotifier2D
```

## Cambios en Player

```text
Player (CharacterBody2D)
├── ...
└── Muzzle (Marker2D) ← [NUEVO]
```
