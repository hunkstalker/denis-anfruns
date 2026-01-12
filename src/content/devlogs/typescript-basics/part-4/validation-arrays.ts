declare const paises: any;

try {
    // @ts-ignore
    if (typeof paises === 'undefined') {
        console.error("❌ No encuentro la variable 'paises'. asegúrate de declararla con 'const paises = ...'");
    } else if (!Array.isArray(paises)) {
        console.error("❌ 'paises' debe ser un Array (usa [])");
    } else if (paises.some((p: any) => typeof p !== 'string')) {
        console.error("❌ Todos los elementos de 'paises' deben ser de tipo string (texto).");
    } else {
        console.log("✅ ¡Genial! Tienes un array de strings válido.");
        console.log("🌍 Contenido:", paises);
        // @ts-ignore
        if (typeof onSuccess === 'function') onSuccess();
    }
} catch (e) {
    console.error("Error validando:", e);
}
export {};
