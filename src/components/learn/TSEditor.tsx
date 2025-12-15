import Editor, { type OnMount, type BeforeMount } from '@monaco-editor/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import playIcon from '../../icons/play.svg?raw'
import checkIcon from '../../icons/check.svg?raw'
import plusIcon from '../../icons/plus.svg?raw'
import closeIcon from '../../icons/close.svg?raw'
import checkCircleIcon from '../../icons/check-circle.svg?raw'
import errorCircleIcon from '../../icons/error-circle.svg?raw'
import { createCommonJSRuntime, executeRuntime, getFileUri, syncModels, transpileFiles } from './tsEditorUtils'
import { useTSEditorFiles } from './useTSEditorFiles'

interface TSEditorProps {
	// Single file (backwards compatibility)
	initialCode?: string
	// Multi-file support
	files?: Record<string, string>
	height?: string
	showConsole?: boolean
}

const TSEditor = ({
	initialCode,
	files = { 'main.ts': initialCode || '// Start coding...' },
	height = '600px',
	showConsole = false,
}: TSEditorProps) => {
	
	// --- Custom Hook: Gestión de Archivos ---
	const {
		localFiles,
		activeFile,
		setActiveFile,
		setLocalFiles,
		updateFileContent,
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
		// Validación
		shouldValidateRef
	} = useTSEditorFiles(files)

	// Sincronizar props externas si cambian
	useEffect(() => {
		setLocalFiles(files)
	}, [files, setLocalFiles])

	// --- Refs de Monaco ---
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const editorRef = useRef<any>(null)
	const monacoRef = useRef<any>(null)

	// --- Estado UI Local ---
	const [checkResult, setCheckResult] = useState<{
		status: 'idle' | 'success' | 'error'
		errors: Array<{ file: string; line: number; message: string }>
	}>({ status: 'idle', errors: [] })

	const [consoleHeight, setConsoleHeight] = useState(160)
	const [consoleOutput, setConsoleOutput] = useState<string[]>([])
	const [isRunning, setIsRunning] = useState(false)
	// Eliminado: theme state (siempre dark)

	// --- Helpers ---
	const showSystemError = (message: string) => {
		setCheckResult({
			status: 'error',
			errors: [{ file: 'Sistema', line: 0, message }]
		})
	}

	// --- Handlers UI (Conectados al Hook) ---
	const handleConfirmCreateWrapper = () => {
		const error = confirmCreate()
		if (error) showSystemError(error)
	}

	const handleConfirmRenameWrapper = () => {
		const result = confirmRename()
		if (typeof result === 'string') {
			showSystemError(result)
		} else if (result && monacoRef.current) {
			// Limpieza manual de modelos de Monaco al renombrar
			// (El hook ya actualizó el estado React, ahora limpiamos memoria de Monaco)
			const oldModel = monacoRef.current.editor.getModel(getFileUri(monacoRef.current, result.oldName))
			oldModel?.dispose()
		}
	}

	const handleDeleteWrapper = (e: React.MouseEvent, filename: string) => {
		e.stopPropagation()
		const error = deleteFile(filename)
		if (error) {
			showSystemError(error)
		} else if (monacoRef.current) {
			// Limpieza manual de modelos de Monaco
			const model = monacoRef.current.editor.getModel(getFileUri(monacoRef.current, filename))
			model?.dispose()
		}
	}

	// --- Efectos ---

	// Auto-dismiss mensajes de estado
	useEffect(() => {
		if (checkResult.status !== 'idle') {
			const timer = setTimeout(() => {
				setCheckResult({ status: 'idle', errors: [] })
			}, 5000)
			return () => clearTimeout(timer)
		}
	}, [checkResult.status])

	// Sincronizar Modelos de Monaco cuando cambian los archivos locales
	useEffect(() => {
		const monaco = monacoRef.current
		if (!monaco) return
		syncModels(monaco, localFiles)
	}, [localFiles])

	// --- Lógica del Editor (Validación y Ejecución) ---

	const checkCode = useCallback(() => {
		const monaco = monacoRef.current
		if (!monaco) return

		const allErrors: Array<{ file: string; line: number; message: string }> = []

		Object.keys(localFiles).forEach((filename) => {
			const uri = getFileUri(monaco, filename)
			const model = monaco.editor.getModel(uri)
			// Si el modelo no existe (ej. acabamos de crear archivo y syncModels no ha corrido), lo saltamos
			if (!model) return

			const markers = monaco.editor.getModelMarkers({ resource: model.uri })
			const fileErrors = markers
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				.filter((marker: any) => marker.severity === monaco.MarkerSeverity.Error)
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				.map((marker: any) => ({
					file: filename,
					line: marker.startLineNumber,
					message: marker.message,
				}))

			allErrors.push(...fileErrors)
		})

		setCheckResult({
			status: allErrors.length === 0 ? 'success' : 'error',
			errors: allErrors,
		})
	}, [localFiles]) // Dependencia localFiles para recrear la función si cambian claves

	// Auto-validación reactiva (activada por el hook)
	useEffect(() => {
		if (shouldValidateRef.current) {
			// Pequeño timeout para dar tiempo a Monaco a procesar los cambios de modelo (syncModels)
			setTimeout(() => {
				checkCode()
			}, 50)
			shouldValidateRef.current = false
		}
	}, [localFiles, checkCode, shouldValidateRef])


	const runCode = async () => {
		const monaco = monacoRef.current
		if (!monaco) return
		setIsRunning(true)
		setConsoleOutput([])

		const logs: string[] = []
		const updateConsole = () => setConsoleOutput([...logs])
		
		const consoleHandler = {
			log: (...args: unknown[]) => {
				logs.push(args.map(a => {
					if (typeof a === 'object') {
						try { return JSON.stringify(a, null, 2) }
						catch { return String(a) }
					}
					return String(a)
				}).join(' '))
				updateConsole()
			},
			error: (...args: unknown[]) => {
				logs.push('❌ ' + args.map(a => String(a)).join(' '))
				updateConsole()
			},
			warn: (...args: unknown[]) => {
				logs.push('⚠️ ' + args.map(a => String(a)).join(' '))
				updateConsole()
			}
		}

		try {
			// 1. Transpilar (Pure function)
			const modules = await transpileFiles(monaco, localFiles, activeFile)
			
			// 2. Crear Runtime (Pure function)
			const runtimeCode = createCommonJSRuntime(modules, activeFile)
			
			// 3. Ejecutar (Side effect)
			executeRuntime(runtimeCode, consoleHandler)

		} catch (err: unknown) {
			console.error('Error en pipeline de ejecución:', err)
			consoleHandler.error('Error interno:', String(err))
		} finally {
			setIsRunning(false)
		}
	}

	// --- Configuración Monaco ---
	const handleEditorWillMount: BeforeMount = (monaco) => {
		monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
			target: monaco.languages.typescript.ScriptTarget.ES2020,
			allowNonTsExtensions: false,
			moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
			module: monaco.languages.typescript.ModuleKind.CommonJS,
			noEmit: false,
			strict: true,
			baseUrl: '.',
			paths: { '*': ['*'] }
		})
		monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true)
		syncModels(monaco, localFiles)
	}

	const handleEditorDidMount: OnMount = (editor, monaco) => {
		editorRef.current = editor
		monacoRef.current = monaco
	}

	return (
		<div 
			style={{ height }}
			className="prose max-w-full flex flex-col gap-0 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 shadow-xl shadow-zinc-800/45"
		>
			{/* Toolbar (Dark Mode Only) */}
			<div className="flex shrink-0 items-center justify-between border-b border-zinc-800 bg-zinc-900/50 px-2 pt-2">
				<div className="flex gap-1 overflow-x-auto scrollbar-none items-center">
					{Object.keys(localFiles).map((filename) => {
						if (renamingFile === filename) {
							return (
								<div 
									key={filename}
									className="flex items-center rounded-t-lg border-x border-t border-zinc-800 bg-zinc-950 px-2 py-1.5"
								>
									<input
										autoFocus
										type="text"
										value={renameValue}
										onChange={(e) => setRenameValue(e.target.value)}
										onKeyDown={(e) => {
											if (e.key === 'Enter') handleConfirmRenameWrapper()
											if (e.key === 'Escape') cancelRenaming()
										}}
										onBlur={handleConfirmRenameWrapper}
										className="h-5 w-24 bg-transparent text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
										onClick={(e) => e.stopPropagation()}
									/>
								</div>
							)
						}
						
						return (
							<button
								key={filename}
								onClick={() => setActiveFile(filename)}
								onDoubleClick={() => startRenaming(filename)}
								className={`group relative flex items-center gap-2 rounded-t-lg border-x border-t px-4 py-2 text-xs font-medium transition-colors ${
									activeFile === filename
										? 'border-zinc-800 bg-zinc-950 text-zinc-100'
										: 'border-transparent bg-transparent text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
								}`}
							>
								{filename}
								
								<span 
									onClick={(e) => handleDeleteWrapper(e, filename)}
									className="ml-1 inline-flex rounded-full p-0.5 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300 [&_svg]:size-3"
									title="Eliminar archivo"
									dangerouslySetInnerHTML={{ __html: closeIcon }}
								/>
							</button>
						)
					})}

					{/* New File Input or Button */}
					{isCreatingFile ? (
						<div className="flex items-center rounded-t-lg border-x border-t border-zinc-800 bg-zinc-950 px-2 py-1.5">
							<input
								autoFocus
								type="text"
								value={newFileName}
								onChange={(e) => setNewFileName(e.target.value)}
								onKeyDown={(e) => {
									if (e.key === 'Enter') handleConfirmCreateWrapper()
									if (e.key === 'Escape') cancelCreating()
								}}
								onBlur={handleConfirmCreateWrapper}
								placeholder="filename.ts"
								className="h-5 w-24 bg-transparent text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
							/>
						</div>
					) : (
						<button 
							onClick={startCreating}
							className="flex ml-2 h-6 w-6 items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 [&_svg]:size-3.5"
							title="Nuevo Archivo"
							dangerouslySetInnerHTML={{ __html: plusIcon }}
						/>
					)}
				</div>

				<div className="mb-2 flex prose items-center gap-2 pr-2">
					<button
						onClick={checkCode}
						className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-blue-400 [&_svg]:size-3.5"
						title="Verificar tipos"
					>
						<span dangerouslySetInnerHTML={{ __html: checkIcon }} className="flex" />
						Check
					</button>

					{showConsole && (
						<button
							onClick={runCode}
							disabled={isRunning}
							className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-emerald-400 disabled:opacity-50 [&_svg]:size-3.5"
							title="Ejecutar código"
						>
							<span dangerouslySetInnerHTML={{ __html: playIcon }} className="flex" />
							Run
						</button>
					)}
				</div>
			</div>

			<div className="relative flex-1 min-h-0">
				<Editor
					height="100%"
					path={`file:///${activeFile}`}
					defaultLanguage="typescript"
					defaultValue={localFiles[activeFile]}
					theme="vs-dark"
					beforeMount={handleEditorWillMount}
					onMount={handleEditorDidMount}
					onChange={(value) => {
						if (value !== undefined) {
							updateFileContent(activeFile, value)
						}
					}}
					options={{
						minimap: { enabled: false },
						fontSize: 14,
						scrollBeyondLastLine: false,
						automaticLayout: true,
						padding: { top: 16, bottom: 16 },
					}}
				/>
			</div>

			{/* Check Status Bar (Dark Only) */}
			{checkResult.status !== 'idle' && (
				<div
					className={`border-t pl-6 text-xs font-medium flex gap-2 max-h-32 overflow-y-auto ${
						checkResult.status === 'success'
							? 'items-center py-6 border-emerald-900/30 bg-emerald-900/10 text-emerald-300'
							: 'items-center mx-0 py-[0.1rem] border-red-900/30 bg-red-900/10 text-red-300'
					}`}
				>
					<div className={`flex shrink-0 items-center [&_svg]:size-3.5 ${checkResult.status === 'success' ? 'mr-5' : ''}`}>
						{checkResult.status === 'success' ? (
							<span dangerouslySetInnerHTML={{ __html: checkCircleIcon }} className="flex" />
						) : (
							<span dangerouslySetInnerHTML={{ __html: errorCircleIcon }} className="flex" />
						)}
					</div>
					<div className="flex-1 leading-4">
						{checkResult.status === 'success' ? (
							'No se encontraron errores.'
						) : (
							<ul className="list-none space-y-1">
								{checkResult.errors.map((err, i) => (
									<li key={i}>
										<span className="font-mono opacity-70">
											[{err.file}:{err.line}]{' '}
										</span>
										{err.message}
									</li>
								))}
							</ul>
						)}
					</div>
				</div>
			)}

			{showConsole && (
				<>
					{/* Resize Handle (Dark) */}
					<div
						className="group flex h-1.5 w-full cursor-row-resize items-center justify-center bg-zinc-900 hover:bg-zinc-800"
						onMouseDown={(e) => {
							e.preventDefault()
							setCheckResult({ status: 'idle', errors: [] })
							const startY = e.clientY
							const startHeight = consoleHeight
							
							const handleMouseMove = (moveEvent: MouseEvent) => {
								const delta = startY - moveEvent.clientY
								setConsoleHeight(Math.max(100, Math.min(600, startHeight + delta)))
							}
							
							const handleMouseUp = () => {
								document.removeEventListener('mousemove', handleMouseMove)
								document.removeEventListener('mouseup', handleMouseUp)
								document.body.style.cursor = ''
							}
							
							document.addEventListener('mousemove', handleMouseMove)
							document.addEventListener('mouseup', handleMouseUp)
							document.body.style.cursor = 'row-resize'
						}}
					>
						<div className="h-0.5 w-8 rounded-full bg-zinc-700 transition-colors group-hover:bg-zinc-600" />
					</div>

					<div 
						style={{ height: consoleHeight }}
						className="border-t border-zinc-800 bg-zinc-950 p-3 font-mono text-xs flex flex-col"
					>
						<div className="mb-2 flex shrink-0 items-center justify-between opacity-50">
							<span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
								Console
							</span>
							<button
								onClick={() => setConsoleOutput([])}
								disabled={consoleOutput.length === 0}
								className="cursor-pointer text-[10px] text-zinc-500 hover:text-zinc-300 disabled:cursor-not-allowed disabled:opacity-50"
							>
								Clear
							</button>
						</div>

						<div className="flex flex-1 flex-col gap-1 overflow-y-auto text-zinc-300">
							{consoleOutput.length === 0 ? (
								<div className="italic text-zinc-600">
									Waiting for execution...
								</div>
							) : (
								consoleOutput.map((log, i) => (
									<div key={i} className="whitespace-pre-wrap border-b border-zinc-900 pb-1 last:border-0">
										<span className="mr-2 text-emerald-500">➜</span>
										{log}
									</div>
								))
							)}
						</div>
					</div>
				</>
			)}
		</div>
	)
}

export default TSEditor
