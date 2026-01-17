# Estructura del Proyecto Godot - Capítulo 3

## Archivos creados en este capítulo

| Archivo | Ruta en Godot | Descripción |
|---------|---------------|-------------|
| [enemy.gd](./_scripts/enemy.gd) | `res://scripts/enemy.gd` | Script del enemigo básico |

## Estructura completa al finalizar el capítulo

```text
res://
├── scenes/
│   ├── player.tscn
│   ├── world.tscn
│   ├── bullet.tscn
│   └── enemy.tscn           ← [NUEVO] Escena del enemigo
├── scripts/
│   ├── player.gd
│   ├── bullet.gd
│   └── enemy.gd             ← [NUEVO]
└── sprites/
    ├── plane_128.png
    ├── shot-atlas.png
    └── enemy_128.png        ← [NUEVO] Sprite enemigo
```

## Nodos del Enemigo (enemy.tscn)

```text
Enemy (Area2D)
├── CollisionShape2D
└── Sprite2D (texture: enemy_128.png)
```
