declare const acierto: any;
declare const fallo: any;

try {
    // 1. Check existence
    // @ts-ignore
    if (typeof acierto === 'undefined' || typeof fallo === 'undefined') {
        throw new Error("You must create variables 'acierto' and 'fallo'.");
    }

    // 2. Check runtime types
    // @ts-ignore
    if (acierto.datos !== 42 || typeof fallo.datos !== 'string') {
            throw new Error("Values of 'acierto' or 'fallo' are not as expected.");
    }

    // @ts-ignore
    if (typeof onSuccess === 'function') onSuccess();
    console.log("✅ Perfect! You master generic interfaces.");
    console.log("Objects created correctly:");
    // @ts-ignore
    console.log(JSON.stringify({ acierto, fallo }, null, 2));

} catch (e: any) {
    console.error(e.message);
}
export {};
