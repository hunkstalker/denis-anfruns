declare const jocPreferit: { titol: string; any: number } | undefined;
declare const onSuccess: () => void;

// --- VALIDACIÓ OCULTA ---
try {
    if (typeof jocPreferit === 'undefined') {
        throw new Error("❌ No has definit la variable 'jocPreferit'");
    }
    
    const j = jocPreferit;
    
    if (j.titol !== "The Legend of Zelda") {
        throw new Error("❌ El títol no coincideix. Ha de ser 'The Legend of Zelda'");
    }
    if (j.any !== 1986) {
        throw new Error("❌ L'any no coincideix. Ha de ser 1986");
    }
    
    console.log("✅ Excel·lent! Has completat l'exercici correctament. 🏆");
    onSuccess();
} catch (error: any) {
    console.error(error.message);
}

export {};
