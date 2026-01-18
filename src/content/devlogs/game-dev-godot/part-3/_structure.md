---
title: Estructura del Proyecto - Parte 3
description: Estructura de archivos y nodos al finalizar la Parte 3.
---

# Estructura del Proyecto (Parte 3)

| Archivo | Tipo | Descripción |
| :--- | :--- | :--- |
| `scenes/enemy_plane.tscn` | Escena | [NUEVO] El enemigo básico (Area2D). |
| `scripts/enemy_plane.gd` | Script | [NUEVO] Lógica del enemigo (movimiento, señales, muerte). |
| `scenes/player.tscn` | Escena | La nave del jugador (Sin cambios). |
| `scripts/player.gd` | Script | Controlador del jugador (Sin cambios). |
| `scenes/bullet.tscn` | Escena | El proyectil (Sin cambios). |
| `scripts/bullet.gd` | Script | Lógica de la bala (Sin cambios). |
| `scenes/level.tscn` | Escena | Nivel principal donde probamos el juego. |

## Estructura de Nodos (EnemyPlane)

```text
EnemyPlane (Area2D)
├── Sprite2D (enemy_128.png)
└── CollisionShape2D (Circle/Rect)
```
