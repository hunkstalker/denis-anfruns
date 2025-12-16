declare const onSuccess: () => void;

// Si el código del usuario se ejecuta hasta aquí es que TypeScript no ha fallado.
// Así que podemos darlo por válido directamente.
console.log("✅ ¡Genial! Ahora funciona correctamente. 🎉");
onSuccess();

export {};