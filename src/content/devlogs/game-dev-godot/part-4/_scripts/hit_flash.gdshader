shader_type canvas_item;

uniform bool flash_active = false;

void fragment() {
    vec4 color_original = texture(TEXTURE, UV);
    
    if (flash_active) {
        COLOR = vec4(1.0, 1.0, 1.0, color_original.a);
    } else {
        COLOR = color_original;
    }
}
