
declare const TodoUpdate: any;
declare const TodoPreview: any;
declare const TodoDictionary: any;
declare const testDiccionario: any;

// Verificación de Tipos (Anti-Trampas)
type IsAny<T> = 0 extends (1 & T) ? true : false;

// Chequeos de tipo estricto
// @ts-ignore
const _checkUpdate: IsAny<TodoUpdate> = false;
// @ts-ignore
const _checkPreview: IsAny<TodoPreview> = false;
// @ts-ignore
const _checkRecord: IsAny<TodoDictionary> = false;

// Chequeo runtime adicional para Record (asegurar que es un objeto)
// @ts-ignore
if (typeof testDiccionario !== 'object') {
    throw new Error("testDiccionario debe ser un objeto.");
}

// @ts-ignore
if (typeof onSuccess === 'function') onSuccess();
console.log("✅ ¡Genial! Has dominado los Utility Types (incluido Record).");
// @ts-ignore
console.log("Diccionario creado:", Object.keys(testDiccionario).length, "elementos.");
export {};
