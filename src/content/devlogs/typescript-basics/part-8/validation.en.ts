declare const envolver: any;

try {
    // 1. Verify if function exists
    // @ts-ignore
    if (typeof envolver !== 'function') throw new Error("You haven't created the 'envolver' function");

    // 2. Runtime logic verification
    // @ts-ignore
    const testNum = envolver(123);
    // @ts-ignore
    const testStr = envolver("test");

    if (!Array.isArray(testNum) || testNum[0] !== 123) {
         throw new Error("envolver(123) should return [123]");
    }
    if (!Array.isArray(testStr) || testStr[0] !== "test") {
         throw new Error("envolver('test') should return ['test']");
    }

    // 3. Extra checks
    if (testNum.length !== 1) throw new Error("The returned array must have exactly 1 element");

    // @ts-ignore
    if (typeof onSuccess === 'function') onSuccess();
    console.log("✅ Excellent! You have created your first Generic.");
} catch (e: any) {
    console.error(e.message);
}
export {};
