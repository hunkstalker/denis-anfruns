declare const config: { theme: string, version: number, debug: boolean };

try {
    // Static type validation
    // 1. Verify Config
    // @ts-ignore
    type _TestConfig = typeof config;
    const testConfig: _TestConfig = { theme: "dark", version: 2, debug: true };
    
    // 2. Verify Keys
    type _TestKeys = keyof _TestConfig;
    const k1: _TestKeys = "theme";
    const k2: _TestKeys = "version";
    // @ts-expect-error
    const k3: _TestKeys = "fake"; 

    // @ts-ignore
    if (typeof onSuccess === 'function') onSuccess();
    console.log("✅ Exercise completed! You mastered typeof and keyof.");
    // @ts-ignore
    console.log("🔑 Inferred keys are:", Object.keys(config).join(" | "));

} catch (e) {
    console.error("Validation error:", e);
}
export {};
