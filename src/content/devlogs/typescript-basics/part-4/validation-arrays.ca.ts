declare const paises: any;

try {
    // @ts-ignore
    if (typeof paises === 'undefined') {
        console.error("❌ No trobo la variable 'paises'. assegura't de declarar-la amb 'const paises = ...'");
    } else if (!Array.isArray(paises)) {
        console.error("❌ 'paises' ha de ser un Array (usa [])");
    } else if (paises.some((p: any) => typeof p !== 'string')) {
        console.error("❌ Tots els elements de 'paises' han de ser de tipus string (text).");
    } else {
        console.log("✅ Genial! Tens un array de strings vàlid.");
        console.log("🌍 Contingut:", paises);
        // @ts-ignore
        if (typeof onSuccess === 'function') onSuccess();
    }
} catch (e) {
    console.error("Error validant:", e);
}
export {};
