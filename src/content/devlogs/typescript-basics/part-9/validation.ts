declare const code: string;

try {
    // @ts-ignore
    if (!/extends\s+object/.test(code)) {
            throw new Error("⚠️ Debes usar 'extends object' (minúscula) para bloquear primitivos.");
    }

    // Check if returns intersection (roughly)
    // @ts-ignore
    const res = fusionar({a:1}, {b:2});
    if (res.a !== 1 || res.b !== 2) throw new Error("La lógica de fusión se ha roto.");

    // @ts-ignore
    if (typeof onSuccess === 'function') onSuccess();
    console.log("✅ ¡Ejercicio Superado! Has creado una función robusta.");
    console.log("🔒 Has bloqueado exitosamente el paso de tipos primitivos.");

} catch (e: any) {
    console.error(e.message);
}
export {};
