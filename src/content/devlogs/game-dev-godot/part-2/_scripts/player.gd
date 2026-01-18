extends CharacterBody2D

@export var speed = 400
@export var fire_rate = 0.125
var bullet_scene = preload("res://scenes/bullet.tscn")

var can_shoot = true          # ¿El arma está lista?
var shoot_timer = 0.0         # Contador de tiempo

func _physics_process(delta):
	# 1. Movimiento
	var direction = Input.get_vector("move_left", "move_right", "move_up", "move_down")
	velocity = direction * speed
	move_and_slide()

	# 2. Lógica del Cooldown
	if not can_shoot:
		shoot_timer -= delta  # Restamos el tiempo que ha pasado
		if shoot_timer <= 0.0:
			can_shoot = true  # ¡Recargada!

	# 3. Gatillo (ahora comprobamos "can_shoot")
	if Input.is_action_pressed("shoot")  and can_shoot:
		shoot()

func shoot():
	# 1. Bloqueamos el arma
	can_shoot = false
	shoot_timer = fire_rate
	
	# 2. Instanciamos
	var bala = bullet_scene.instantiate()
	# 3. SOLUCIÓN AL CANGURO:
	# En lugar de add_child(bala), la damos en adopción al PADRE (el Mundo)
	get_parent().add_child(bala)
	# 4. Importante: Como ahora es independiente, debemos decirle "Ves a donde estoy yo"
	bala.global_position = $Muzzle.global_position
