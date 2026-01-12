declare const acierto: any;
declare const fallo: any;

try {
    // 1. Comprobar existencia
    // @ts-ignore
    if (typeof acierto === 'undefined' || typeof fallo === 'undefined') {
        throw new Error("Debes crear las variables 'acierto' y 'fallo'.");
    }

    // 2. Comprobar tipos runtime
    // @ts-ignore
    if (acierto.datos !== 42 || typeof fallo.datos !== 'string') {
            throw new Error("Los valores de 'acierto' o 'fallo' no son los esperados.");
    }

    // @ts-ignore
    if (typeof onSuccess === 'function') onSuccess();
    console.log("✅ ¡Perfecto! Dominas los interfaces genéricos.");
    console.log("Objetos creados correctamente:");
    // @ts-ignore
    console.log(JSON.stringify({ acierto, fallo }, null, 2));

} catch (e: any) {
    console.error(e.message);
}
export {};
