declare const paises: any;

try {
    // @ts-ignore
    if (typeof paises === 'undefined') {
        console.error("❌ Cannot find variable 'paises'. Make sure to declare it with 'const paises = ...'");
    } else if (!Array.isArray(paises)) {
        console.error("❌ 'paises' must be an Array (use [])");
    } else if (paises.some((p: any) => typeof p !== 'string')) {
        console.error("❌ All elements in 'paises' must be of type string (text).");
    } else {
        console.log("✅ Great! You have a valid array of strings.");
        console.log("🌍 Content:", paises);
        // @ts-ignore
        if (typeof onSuccess === 'function') onSuccess();
    }
} catch (e) {
    console.error("Validation error:", e);
}
export {};
