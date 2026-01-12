declare const acierto: any;
declare const fallo: any;

try {
    // 1. Comprovar existència
    // @ts-ignore
    if (typeof acierto === 'undefined' || typeof fallo === 'undefined') {
        throw new Error("Has de crear les variables 'acierto' i 'fallo'.");
    }

    // 2. Comprovar tipus runtime
    // @ts-ignore
    if (acierto.datos !== 42 || typeof fallo.datos !== 'string') {
            throw new Error("Els valors de 'acierto' o 'fallo' no són els esperats.");
    }

    // @ts-ignore
    if (typeof onSuccess === 'function') onSuccess();
    console.log("✅ Perfecte! Domines les interfícies genèriques.");
    console.log("Objectes creats correctament:");
    // @ts-ignore
    console.log(JSON.stringify({ acierto, fallo }, null, 2));

} catch (e: any) {
    console.error(e.message);
}
export {};
