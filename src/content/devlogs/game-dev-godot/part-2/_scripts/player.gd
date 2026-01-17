extends CharacterBody2D

@export var speed = 400
@export var fire_rate = 0.125

var bullet_scene = preload("res://scenes/bullet.tscn")

var can_shoot = true
var shoot_timer = 0.0

func _physics_process(delta: float) -> void:
	# Movimiento
	var direction = Input.get_vector("move_left", "move_right", "move_up", "move_down")
	velocity = direction * speed
	move_and_slide()
	
	# Sistema de Cooldown (Robust)
	if not can_shoot:
		shoot_timer -= delta
		if shoot_timer <= 0.0:
			can_shoot = true

	# Disparo
	if Input.is_action_pressed("shoot") and can_shoot:
		shoot()

func shoot():
	can_shoot = false
	shoot_timer = fire_rate
	
	var bala = bullet_scene.instantiate()
	get_parent().add_child(bala)
	
	bala.global_position = $Muzzle.global_position
