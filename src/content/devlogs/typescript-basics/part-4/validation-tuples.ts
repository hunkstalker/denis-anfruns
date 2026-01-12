declare const usuario: any;

try {
    // @ts-ignore
    if (typeof usuario === 'undefined') {
        console.error("❌ No encuentro la variable 'usuario'.");
    } else if (!Array.isArray(usuario)) {
        console.error("❌ 'usuario' debe ser un Array (que actúa como Tupla).");
    } else if (usuario.length !== 3) {
        console.error("❌ La tupla 'usuario' debe tener exactamente 3 elementos: [Nombre, Edad, Admin]");
    } else if (typeof usuario[0] !== 'string') {
        console.error("❌ El primer elemento (Nombre) debe ser un string.");
    } else if (typeof usuario[1] !== 'number') {
        console.error("❌ El segundo elemento (Edad) debe ser un número.");
    } else if (typeof usuario[2] !== 'boolean') {
        console.error("❌ El tercer elemento (Admin) debe ser un boolean (true/false).");
    } else {
        console.log("✅ ¡Tupla perfecta! Has combinado tipos en orden estricto. 👮");
        console.log("👤 Usuario:", usuario);
        // @ts-ignore
        if (typeof onSuccess === 'function') onSuccess();
    }
} catch (e) {
    console.error("Error validando:", e);
}
export {};
