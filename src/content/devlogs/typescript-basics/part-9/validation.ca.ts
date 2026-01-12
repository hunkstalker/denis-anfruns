declare const code: string;

try {
    // @ts-ignore
    if (!/extends\s+object/.test(code)) {
            throw new Error("⚠️ Has d'usar 'extends object' (minúscula) per bloquejar primitius.");
    }

    // Check if returns intersection (roughly)
    // @ts-ignore
    const res = fusionar({a:1}, {b:2});
    if (res.a !== 1 || res.b !== 2) throw new Error("La lògica de fusió s'ha trencat.");

    // @ts-ignore
    if (typeof onSuccess === 'function') onSuccess();
    console.log("✅ Exercici Superat! Has creat una funció robusta.");
    console.log("🔒 Has bloquejat exitosament el pas de tipus primitius.");

} catch (e: any) {
    console.error(e.message);
}
export {};
