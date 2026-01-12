declare const envolver: any;

try {
    // 1. Verificar si existeix la funció
    // @ts-ignore
    if (typeof envolver !== 'function') throw new Error("No has creat la funció 'envolver'");

    // 2. Verificar lògica en temps d'execució
    // @ts-ignore
    const testNum = envolver(123);
    // @ts-ignore
    const testStr = envolver("test");

    if (!Array.isArray(testNum) || testNum[0] !== 123) {
         throw new Error("envolver(123) hauria de retornar [123]");
    }
    if (!Array.isArray(testStr) || testStr[0] !== "test") {
         throw new Error("envolver('test') hauria de retornar ['test']");
    }

    // 3. Verificacions extra
    if (testNum.length !== 1) throw new Error("L'array retornat ha de tenir exactament 1 element");

    // @ts-ignore
    if (typeof onSuccess === 'function') onSuccess();
    console.log("✅ Excel·lent! Has creat el teu primer Generic.");
} catch (e: any) {
    console.error(e.message);
}
export {};
