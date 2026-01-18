extends Area2D

# Exportamos la velocidad para que la podamos ajustar en el editor
@export var speed = 150
@export var hp = 3

var is_dying = false
var fall_speed = 0.0

# Ignoramos por ahora _ready()
func _ready() -> void:
	area_entered.connect(_on_area_entered)

# Añadimos el movimiento en _process
func _process(delta) -> void:
	if is_dying:
		fall_speed += 500 * delta
		position.y += fall_speed * delta
		position.x -= speed * 0.5 * delta
	else:
		position.x -= speed * delta

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
