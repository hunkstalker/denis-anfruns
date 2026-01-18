---
title: Estructura del Proyecto - Parte 4
description: Estructura de archivos y nodos al finalizar la Parte 4.
---

# Estructura del Proyecto (Parte 4)

| Archivo | Tipo | Descripción |
| :--- | :--- | :--- |
| `shaders/enemy_plane.gdshader` | Shader | [NUEVO] Efecto Hit Flash para el enemigo. |
| `scripts/enemy_plane.gd` | Script | Actualizado con `hit_flash()`. |
| `scenes/enemy_plane.tscn` | Escena | Actualizado con ShaderMaterial. |
| `scenes/player.tscn` | Escena | La nave del jugador (Sin cambios). |
| `scripts/player.gd` | Script | Controlador del jugador (Sin cambios). |
| `scenes/bullet.tscn` | Escena | El proyectil (Sin cambios). |
| `scripts/bullet.gd` | Script | Lógica de la bala (Sin cambios). |
| `scenes/level.tscn` | Escena | Nivel principal. |
| `sprites/player.png` | Sprite | Sprite de la nave del jugador. |
| `sprites/shot-atlas.png` | Sprite | Atlas de la bala. |
| `sprites/enemy_plane.png` | Sprite | Sprite del enemigo. |

## Estructura de Nodos (EnemyPlane con Shader)

```text
EnemyPlane (Area2D)
├── Sprite2D (enemy_plane.png + ShaderMaterial)
└── CollisionShape2D (Circle/Rect)
```
