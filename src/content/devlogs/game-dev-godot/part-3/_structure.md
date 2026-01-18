# Estructura del Proyecto Godot - Capítulo 3

## Archivos creados en este capítulo

| Archivo | Ruta en Godot | Descripción |
|---------|---------------|-------------|
| [enemy_plane.gd](./_scripts/enemy_plane.gd) | `res://scripts/enemy_plane.gd` | Script del enemigo básico (avión) |

## Estructura completa al finalizar el capítulo

```text
res://
├── scenes/
│   ├── player.tscn
│   ├── world.tscn
│   ├── bullet.tscn
│   └── enemy_plane.tscn     ← [NUEVO] Escena del enemigo
├── scripts/
│   ├── player.gd
│   ├── bullet.gd
│   └── enemy_plane.gd       ← [NUEVO]
└── sprites/
    ├── plane_128.png
    ├── shot-atlas.png
    └── enemy_128.png        ← [NUEVO] Sprite enemigo
```

## Nodos del Enemigo (enemy_plane.tscn)

```text
EnemyPlane (Area2D)
├── CollisionShape2D
└── Sprite2D (texture: enemy_128.png)
```
