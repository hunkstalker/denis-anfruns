---
title: Estructura del Proyecto - Parte 1
description: Estructura de archivos y nodos al finalizar la Parte 1.
---

# Estructura del Proyecto (Parte 1)

| Archivo | Tipo | Descripción |
| :--- | :--- | :--- |
| `scenes/player.tscn` | Escena | La nave del jugador (CharacterBody2D). |
| `scripts/player.gd` | Script | Movimiento básico del jugador. |
| `scenes/level.tscn` | Escena | Nivel principal con cámara. |
| `sprites/player.png` | Sprite | Sprite de la nave del jugador. |

## Estructura de Nodos (Player)

```text
Player (CharacterBody2D)
├── CollisionShape2D (CircleShape2D)
└── Sprite2D (player.png)
```

## Estructura de Nodos (Level)

```text
Level (Node2D)
├── Camera2D (Anchor Mode: Fixed Top Left)
└── Player (instancia de player.tscn)
```
