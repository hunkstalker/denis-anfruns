
// --- Tipos ---

interface ConsoleHandler {
	log: (...args: unknown[]) => void
	error: (...args: unknown[]) => void
	warn: (...args: unknown[]) => void
}

// --- Helpers Generales ---

/**
 * Genera una URI de Monaco consistente para un archivo dado.
 * Usa `monaco.Uri.file` para asegurar compatibilidad y formato correcto (file:///).
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getFileUri = (monaco: any, filename: string) => {
	return monaco.Uri.file(filename)
}

/**
 * Sincroniza el estado de los archivos de React con los Modelos de Monaco.
 * Crea modelos si no existen y actualiza su contenido si ha cambiado.
 * Nota: No maneja la eliminación, eso se hace al confirmar borrar/renombrar.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const syncModels = (monaco: any, currentFiles: Record<string, string>) => {
	Object.entries(currentFiles).forEach(([filename, content]) => {
		const uri = getFileUri(monaco, filename)
		let model = monaco.editor.getModel(uri)
		if (!model) {
			model = monaco.editor.createModel(content, 'typescript', uri)
		}
		// Solo actualizamos si es diferente para evitar flashes o problemas de cursor
		if (model.getValue() !== content) {
			model.setValue(content)
		}
	})
}

// --- Lógica de Ejecución (Dividida por SRP) ---

/**
 * Paso 1: Transpilación.
 * Usa el Worker de TypeScript de Monaco para convertir todos los archivos .ts a .js.
 * Retorna un diccionario { "archivo.ts": "código JS..." }.
 */
export const transpileFiles = async (
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	monaco: any,
	files: Record<string, string>,
	activeFile: string
): Promise<Record<string, string>> => {
	const worker = await monaco.languages.typescript.getTypeScriptWorker()
	const modules: Record<string, string> = {}
	
	// Obtenemos el cliente del worker usando cualquier URI válida
	const dummyUri = getFileUri(monaco, activeFile)
	const client = await worker(dummyUri)

	for (const [filename, content] of Object.entries(files)) {
		const uri = getFileUri(monaco, filename)
		// Aseguramos que el modelo exista
		if (!monaco.editor.getModel(uri)) {
			monaco.editor.createModel(content, 'typescript', uri)
		}
		
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const result: any = await client.getEmitOutput(uri.toString())
		if (result.outputFiles[0]) {
			modules[filename] = result.outputFiles[0].text
		}
	}

	return modules
}

/**
 * Paso 2: Construcción del Runtime CommonJS.
 * Crea una cadena de código JS que simula un entorno CommonJS simple (require, exports).
 * Envuelve cada módulo y ejecuta el archivo activo como punto de entrada.
 */
export const createCommonJSRuntime = (modules: Record<string, string>, entryPoint: string): string => {
	return `
		const modules = ${JSON.stringify(modules)};
		const moduleCache = {};

		function require(path) {
			// Normalizar ruta: './types' -> 'types.ts'
			let cleanPath = path.replace('./', '');
			if (!cleanPath.endsWith('.ts')) cleanPath += '.ts';
			
			if (moduleCache[cleanPath]) return moduleCache[cleanPath].exports;

			if (!modules[cleanPath]) {
				throw new Error('Module not found: ' + cleanPath);
			}

			const module = { exports: {} };
			moduleCache[cleanPath] = module;

			// Ejecutar el wrapper del módulo
			// Inyectamos 'customConsole' que pasaremos al constructor de Function
			const wrapper = new Function('exports', 'require', 'module', 'console', modules[cleanPath]);
			wrapper(module.exports, require, module, customConsole);

			return module.exports;
		}

		// Ejecutar Punto de Entrada
		require('${entryPoint}');
	`
}

/**
 * Paso 3: Ejecución.
 * Crea una Function a partir del código runtime y la ejecuta, inyectando la consola personalizada.
 * Maneja errores de ejecución.
 */
export const executeRuntime = (runtimeCode: string, consoleHandler: ConsoleHandler) => {
	try {
		// Creamos la función final que recibe 'customConsole'
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const runtimeFunc = new Function('customConsole', runtimeCode)
		runtimeFunc(consoleHandler)
	} catch (err: unknown) {
		consoleHandler.error('Error de Ejecución:', err instanceof Error ? err.message : String(err))
	}
}
