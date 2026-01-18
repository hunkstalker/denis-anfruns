extends Area2D

@export var hp = 3
@export var orbit_radius = 100.0
@export var orbit_speed = 2.0

var is_dying = false
var time = 0.0
var velocity = Vector2.ZERO
var center = Vector2.ZERO

func _ready():
	center = position  # Guardamos la posición (X, Y) inicial como centro
	area_entered.connect(_on_area_entered)

func _process(delta):
	if is_dying:
		# 3. FASE MUERTE: Usamos la inercia calculada
		# Ya no calculamos 'cos/sin'. Usamos la última 'velocity' conocida 
		# para seguir moviéndonos en esa dirección, y le sumamos gravedad.
		velocity.y += 1000 * delta
		position += velocity * delta
	else:
		# 1. FASE VIVA: Guardamos posición antes de movernos
		var prev_pos = position
		time += delta

		# 2. MOVIMIENTO CIRCULAR
		position.x = center.x + cos(time * orbit_speed) * orbit_radius
		position.y = center.y + sin(time * orbit_speed) * orbit_radius

		# CÁLCULO DE INERCIA (Para usarla cuando muera)
		# Como movemos 'position' a mano, Godot no sabe a qué velocidad vamos.
		# La calculamos nosotros: Velocidad = Espacio / Tiempo
		velocity = (position - prev_pos) / delta

func _on_area_entered(area):
	if is_dying:
		return
	
	hp -= 1
	area.queue_free()
	hit_flash()

	if hp <= 0:
		die()

func die():
	is_dying = true
	$CollisionShape2D.set_deferred("disabled", true)
	await get_tree().create_timer(1.0).timeout
	queue_free()

func hit_flash():
	var sprite = $Sprite2D
	var shader_material = sprite.material

	if shader_material is ShaderMaterial:
		shader_material.set_shader_parameter("flash_active", true)
		await get_tree().create_timer(0.1).timeout
		shader_material.set_shader_parameter("flash_active", false)
