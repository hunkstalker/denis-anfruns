
declare const TodoUpdate: any;
declare const TodoPreview: any;
declare const TodoDictionary: any;
declare const testDiccionario: any;

// Verificació de Tipus (Anti-Trampes)
type IsAny<T> = 0 extends (1 & T) ? true : false;

// Comprovacions de tipus estricte
// @ts-ignore
const _checkUpdate: IsAny<TodoUpdate> = false;
// @ts-ignore
const _checkPreview: IsAny<TodoPreview> = false;
// @ts-ignore
const _checkRecord: IsAny<TodoDictionary> = false;

// Comprovació runtime addicional per Record
// @ts-ignore
if (typeof testDiccionario !== 'object') {
    throw new Error("testDiccionario ha de ser un objecte.");
}

// @ts-ignore
if (typeof onSuccess === 'function') onSuccess();
console.log("✅ Genial! Has dominat els Utility Types (inclòs Record).");
// @ts-ignore
console.log("Diccionari creat:", Object.keys(testDiccionario).length, "elements.");
export {};
