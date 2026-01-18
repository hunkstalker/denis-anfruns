# Estructura del Proyecto Godot - Capítulo 2

## Archivos creados en este capítulo

| Archivo | Ruta en Godot | Descripción |
|---------|---------------|-------------|
| [bullet.gd](./_scripts/bullet.gd) | `res://scripts/bullet.gd` | Script de la bala (movimiento y limpieza) |
| [player.gd](./_scripts/player.gd) | `res://scripts/player.gd` | Actualizado para disparar |

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
