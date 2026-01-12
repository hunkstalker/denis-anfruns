declare const code: string;

try {
    // @ts-ignore
    if (!/extends\s+object/.test(code)) {
            throw new Error("⚠️ You must use 'extends object' (lowercase) to block primitives.");
    }

    // Check if returns intersection (roughly)
    // @ts-ignore
    const res = merge({a:1}, {b:2});
    if (res.a !== 1 || res.b !== 2) throw new Error("The merge logic is broken.");

    // @ts-ignore
    if (typeof onSuccess === 'function') onSuccess();
    console.log("✅ Exercise Passed! You have created a robust function.");
    console.log("🔒 You have successfully blocked primitive types.");

} catch (e: any) {
    console.error(e.message);
}
export {};
