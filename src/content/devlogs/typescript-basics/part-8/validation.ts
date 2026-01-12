declare const envolver: any;

try {
    // 1. Verificar si existe la función
    // @ts-ignore
    if (typeof envolver !== 'function') throw new Error("No has creado la función 'envolver'");

    // 2. Verificar lógica en tiempo de ejecución
    // @ts-ignore
    const testNum = envolver(123);
    // @ts-ignore
    const testStr = envolver("test");

    if (!Array.isArray(testNum) || testNum[0] !== 123) {
         throw new Error("envolver(123) debería devolver [123]");
    }
    if (!Array.isArray(testStr) || testStr[0] !== "test") {
         throw new Error("envolver('test') debería devolver ['test']");
    }

    // 3. Verificaciones extra de trampa (evitar que devuelva el mismo array si se le pasa array)
    if (testNum.length !== 1) throw new Error("El array devuelto debe tener exactamente 1 elemento");

    // @ts-ignore
    if (typeof onSuccess === 'function') onSuccess();
    console.log("✅ ¡Excelente! Has creado tu primer Generic.");
} catch (e: any) {
    console.error(e.message);
}
export {};
