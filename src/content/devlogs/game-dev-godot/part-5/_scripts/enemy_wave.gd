extends Area2D

@export var speed = 200
@export var hp = 3
@export var wave_amplitude = 100.0
@export var wave_frequency = 3.0

var is_dying = false
var fall_speed = 0.0
var time = 0.0
var start_y = 0.0

func _ready():
	start_y = position.y
	area_entered.connect(_on_area_entered)

func _process(delta):
	if is_dying:
		fall_speed += 500 * delta
		position.y += fall_speed * delta
		position.x -= speed * 0.5 * delta 
	else:
		time += delta
		position.x -= speed * delta
			
		# La fórmula de la onda
		position.y = start_y + sin(time * wave_frequency) * wave_amplitude
		# 1. start_y hará que parta de la posición original o relativa.
		# 2. usamos el tiempo en sin() como valor de ángulo lo que nos devolverá 
		# valores entre -1 y 1.
		# 3. Lo multiplicamos por la frecuencia para darle velocidad.
		# 4. Al resultado le podemos además multiplicar la amplitud para darle tamaño.
		# **Recuerda** el orden de las operaciones (multiplicación antes que la función).

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
