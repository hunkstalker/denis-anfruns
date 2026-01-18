# Estructura del Proyecto Godot - Capítulo 1

## Archivos creados en este capítulo

| Archivo | Ruta en Godot | Descripción |
|---------|---------------|-------------|
| [player.gd](./scripts/player.gd) | `res://scripts/player.gd` | Movimiento básico del jugador con CharacterBody2D |

## Estructura completa al finalizar el capítulo

```text
res://
├── scenes/
│   ├── player.tscn          ← Escena del jugador (CharacterBody2D + CollisionShape2D + Sprite2D)
│   └── level.tscn           ← Escena principal del mundo (Node2D + Camera2D + player instance)
├── scripts/
│   └── player.gd            ← Script de movimiento
└── sprites/
    └── player.png        ← Sprite de la nave
```

## Nodos del Player (player.tscn)

```text
Player (CharacterBody2D)
├── CollisionShape2D (CircleShape2D, radius=40)
└── Sprite2D (texture: plane_128.png)
```

## Nodos del Level (level.tscn)

```text
Level (Node2D)
├── Camera2D (Anchor Mode: Fixed Top Left)
└── player (instancia de player.tscn, posición: 400, 300)
```
