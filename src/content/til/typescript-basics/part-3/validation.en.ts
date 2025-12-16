declare const favoriteGame: { title: string; year: number } | undefined;
declare const onSuccess: () => void;

// --- HIDDEN VALIDATION ---
try {
    if (typeof favoriteGame === 'undefined') {
        throw new Error("❌ You haven't defined the variable 'favoriteGame'");
    }
    
    const g = favoriteGame;
    
    if (g.title !== "The Legend of Zelda") {
        throw new Error("❌ The title does not match. It must be 'The Legend of Zelda'");
    }
    if (g.year !== 1986) {
        throw new Error("❌ The year does not match. It must be 1986");
    }
    
    console.log("✅ Excellent! You have completed the exercise correctly. 🏆");
    onSuccess();
} catch (error: any) {
    console.error(error.message);
}

export {};
