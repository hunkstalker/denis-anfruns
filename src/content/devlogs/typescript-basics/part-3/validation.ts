// Declaraciones para que TypeScript no marque error en el editor
// Estas variables existen en el scope global al momento de la ejecución
declare const juegoFavorito: { titulo: string; anio: number } | undefined;
declare const onSuccess: () => void;

// --- VALIDACIÓN OCULTA ---
try {
    if (typeof juegoFavorito === 'undefined') {
        throw new Error("No has definido la variable 'juegoFavorito'");
    }
    
    const j = juegoFavorito;
    
    if (j.titulo !== "The Legend of Zelda") {
        throw new Error("Falla algo del título!");
    }
    if (j.anio !== 1986) {
        throw new Error("Falla algo del año!");
    }
    
    console.log("✅ ¡Excelente! Has completado el ejercicio correctamente. 🏆");
    onSuccess();
} catch (error: any) {
    console.error(error.message);
}

export {};
