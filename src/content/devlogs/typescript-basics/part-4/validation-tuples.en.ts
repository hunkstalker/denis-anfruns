declare const usuario: any;

try {
    // @ts-ignore
    if (typeof usuario === 'undefined') {
        console.error("❌ Cannot find variable 'usuario'.");
    } else if (!Array.isArray(usuario)) {
        console.error("❌ 'usuario' must be an Array (acting as a Tuple).");
    } else if (usuario.length !== 3) {
        console.error("❌ The tuple 'usuario' must have exactly 3 elements: [Name, Age, Admin]");
    } else if (typeof usuario[0] !== 'string') {
        console.error("❌ The first element (Name) must be a string.");
    } else if (typeof usuario[1] !== 'number') {
        console.error("❌ The second element (Age) must be a number.");
    } else if (typeof usuario[2] !== 'boolean') {
        console.error("❌ The third element (Admin) must be a boolean (true/false).");
    } else {
        console.log("✅ Perfect Tuple! You combined types in strict order. 👮");
        console.log("👤 User:", usuario);
        // @ts-ignore
        if (typeof onSuccess === 'function') onSuccess();
    }
} catch (e) {
    console.error("Validation error:", e);
}
export {};
