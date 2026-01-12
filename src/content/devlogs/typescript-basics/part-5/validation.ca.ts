declare const config: { theme: string, version: number, debug: boolean };

try {
    // Validació de tipus estàtica
    // 1. Verificar Config
    // @ts-ignore
    type _TestConfig = typeof config;
    const testConfig: _TestConfig = { theme: "dark", version: 2, debug: true };
    
    // 2. Verificar Keys
    type _TestKeys = keyof _TestConfig;
    const k1: _TestKeys = "theme";
    const k2: _TestKeys = "version";
    // @ts-expect-error
    const k3: _TestKeys = "fake"; 

    // @ts-ignore
    if (typeof onSuccess === 'function') onSuccess();
    console.log("✅ Exercici completat! Has dominat typeof i keyof.");
    // @ts-ignore
    console.log("🔑 Les claus inferides són:", Object.keys(config).join(" | "));

} catch (e) {
    console.error("Error validant:", e);
}
export {};
