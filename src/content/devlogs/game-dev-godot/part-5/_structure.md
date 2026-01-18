# Estructura del Proyecto (Parte 5)

## Scripts (`scripts/`)
| Archivo | Descripción |
| :--- | :--- |
| `enemy_wave.gd` | [NUEVO] Enemigo con patrón de oscilación. |
| `enemy_orbital.gd` | [NUEVO] Enemigo con patrón circular. |
| `enemy_plane.gd` | Lógica de enemigo (movimiento lineal). |
| `player.gd` | Controlador del jugador. |
| `bullet.gd` | Lógica de la bala. |

## Escenas (`scenes/`)
| Archivo | Descripción |
| :--- | :--- |
| `enemy_wave.tscn` | [NUEVO] Escena del helicóptero de onda. |
| `enemy_orbital.tscn` | [NUEVO] Escena del helicóptero orbital. |
| `enemy_plane.tscn` | Escena del enemigo avión. |
| `player.tscn` | Escena del jugador. |
| `bullet.tscn` | Escena del proyectil. |
| `level.tscn` | Nivel principal. |

## Sprites (`sprites/`)
| Archivo | Descripción |
| :--- | :--- |
| `enemy_chopper.png` | [NUEVO] Sprite del helicóptero. |
| `player.png` | Sprite de la nave del jugador. |
| `shot-atlas.png` | Atlas de la bala. |
| `enemy_plane.png` | Sprite del enemigo avión. |

## Shaders (`shaders/`)
| Archivo | Descripción |
| :--- | :--- |
| `enemy_plane.gdshader` | Efecto Hit Flash. |

## Estructura de Nodos (Helicópteros)

```text
EnemyWave / EnemyOrbital (Area2D)
├── Sprite2D (enemy_chopper.png + ShaderMaterial)
└── CollisionShape2D (Capsule)
```