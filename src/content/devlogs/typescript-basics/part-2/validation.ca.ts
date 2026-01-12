declare const onSuccess: () => void;

// Si el codi de l'usuari s'executa fins aquí és que TypeScript no ha fallat.
// Així que podem donar-ho per vàlid directament.
console.log("✅ Genial! Ara funciona correctament. 🎉");
onSuccess();

export {};
