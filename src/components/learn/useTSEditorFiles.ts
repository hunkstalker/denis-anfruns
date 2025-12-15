import { useState, useCallback, useRef } from 'react'

/**
 * Hook personalizado para manejar la gestión de archivos del editor.
 * Encapsula la lógica de estado para:
 * - Lista de archivos y su contenido.
 * - Archivo activo.
 * - Creación y renombrado de archivos.
 * - Eliminación de archivos.
 */
export const useTSEditorFiles = (initialFiles: Record<string, string>) => {
	// Estado principal de los archivos { "main.ts": "código..." }
	const [localFiles, setLocalFiles] = useState<Record<string, string>>(initialFiles)
	
	// Archivo seleccionado actualmente en el editor
	const [activeFile, setActiveFile] = useState<string>(Object.keys(initialFiles)[0])

	// Estados para la interfaz de creación de archivos
	const [isCreatingFile, setIsCreatingFile] = useState(false)
	const [newFileName, setNewFileName] = useState('')

	// Estados para la interfaz de renombrado
	const [renamingFile, setRenamingFile] = useState<string | null>(null)
	const [renameValue, setRenameValue] = useState('')

	// Referencia para indicar si se debe disparar una validación externa (useEffect en el componente)
	const shouldValidateRef = useRef(false)

	// --- Acciones de Creación ---

	const startCreating = useCallback(() => {
		setIsCreatingFile(true)
		setNewFileName('')
	}, [])

	const cancelCreating = useCallback(() => {
		setIsCreatingFile(false)
		setNewFileName('')
	}, [])

	/**
	 * Confirma la creación de un nuevo archivo.
	 * Valida duplicados y añade la extensión .ts si falta.
	 * Retorna la URL del error si falla, o null si tiene éxito.
	 */
	const confirmCreate = useCallback(() => {
		const filename = newFileName.trim()
		if (!filename) {
			cancelCreating()
			return null
		}

		const cleanName = filename.endsWith('.ts') ? filename : `${filename}.ts`

		// Validación: No permitir duplicados
		if (localFiles[cleanName]) {
			return '¡Ese archivo ya existe!'
		}

		shouldValidateRef.current = true
		setLocalFiles(prev => ({
			...prev,
			[cleanName]: '// Nuevo archivo'
		}))
		setActiveFile(cleanName)
		cancelCreating()
		return null
	}, [newFileName, localFiles, cancelCreating])

	// --- Acciones de Renombrado ---

	const startRenaming = useCallback((filename: string) => {
		setRenamingFile(filename)
		setRenameValue(filename)
	}, [])

	const cancelRenaming = useCallback(() => {
		setRenamingFile(null)
		setRenameValue('')
	}, [])

	/**
	 * Confirma el renombrado de un archivo.
	 * Maneja la actualización del estado y la eliminación de la clave antigua.
	 */
	const confirmRename = useCallback(() => {
		if (!renamingFile) return null

		const newName = renameValue.trim()
		const oldName = renamingFile

		if (!newName || newName === oldName) {
			cancelRenaming()
			return null
		}

		const cleanNewName = newName.endsWith('.ts') ? newName : `${newName}.ts`

		if (localFiles[cleanNewName]) {
			return '¡Ese nombre ya existe!'
		}

		const content = localFiles[oldName]

		shouldValidateRef.current = true
		setLocalFiles(prev => {
			const newFiles = { ...prev }
			newFiles[cleanNewName] = content
			delete newFiles[oldName]
			return newFiles
		})
		
		setActiveFile(cleanNewName)
		cancelRenaming()
		
		// Retornamos información para que el componente padre sepa qué limpiar (modelos de Monaco)
		return { oldName, newName: cleanNewName }
	}, [renamingFile, renameValue, localFiles, cancelRenaming])

	// --- Acciones de Eliminación ---

	const deleteFile = useCallback((filename: string) => {
		if (Object.keys(localFiles).length <= 1) {
			return 'Debes mantener al menos un archivo.'
		}

		shouldValidateRef.current = true
		setLocalFiles(prev => {
			const newFiles = { ...prev }
			delete newFiles[filename]
			return newFiles
		})
		
		// Si borramos el archivo activo, cambiamos al primero disponible
		if (activeFile === filename) {
			// Calculamos el siguiente archivo *antes* de borrarlo del estado real para la UI, 
			// pero aquí usamos una lógica simple: seleccionar el primero de la lista restante.
			// Nota: setLocalFiles es asíncrono, así que leemos de localFiles actual
			const remaining = Object.keys(localFiles).filter(f => f !== filename)
			if (remaining.length > 0) setActiveFile(remaining[0])
		}

		return null // Éxito
	}, [localFiles, activeFile])

	// --- Utilidad para actualizar contenido ---
	const updateFileContent = useCallback((filename: string, content: string) => {
		setLocalFiles(prev => ({
			...prev,
			[filename]: content
		}))
	}, [])

	return {
		localFiles,
		activeFile,
		setActiveFile,
		updateFileContent,
		setLocalFiles, // Expuesto por si se necesita resetear todo desde fuera (useEffect de props)
		
		// Creación
		isCreatingFile,
		newFileName,
		setNewFileName,
		startCreating,
		cancelCreating,
		confirmCreate,

		// Renombrado
		renamingFile,
		renameValue,
		setRenameValue,
		startRenaming,
		cancelRenaming,
		confirmRename,

		// Eliminación
		deleteFile,

		// Validacion
		shouldValidateRef
	}
}
