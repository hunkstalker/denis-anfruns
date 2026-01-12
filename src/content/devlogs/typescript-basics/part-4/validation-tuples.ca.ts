declare const usuario: any;

try {
    // @ts-ignore
    if (typeof usuario === 'undefined') {
        console.error("❌ No trobo la variable 'usuario'.");
    } else if (!Array.isArray(usuario)) {
        console.error("❌ 'usuario' ha de ser un Array (que actua com Tupla).");
    } else if (usuario.length !== 3) {
        console.error("❌ La tupla 'usuario' ha de tenir exactament 3 elements: [Nom, Edat, Admin]");
    } else if (typeof usuario[0] !== 'string') {
        console.error("❌ El primer element (Nom) ha de ser un string.");
    } else if (typeof usuario[1] !== 'number') {
        console.error("❌ El segon element (Edat) ha de ser un número.");
    } else if (typeof usuario[2] !== 'boolean') {
        console.error("❌ El tercer element (Admin) ha de ser un boolean (true/false).");
    } else {
        console.log("✅ Tupla perfecta! Has combinat tipus en ordre estricte. 👮");
        console.log("👤 Usuari:", usuario);
        // @ts-ignore
        if (typeof onSuccess === 'function') onSuccess();
    }
} catch (e) {
    console.error("Error validant:", e);
}
export {};
