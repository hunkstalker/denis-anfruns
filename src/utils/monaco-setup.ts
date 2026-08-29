import { loader } from '@monaco-editor/react'

/**
 * Self-host de Monaco.
 * En lugar de cargar desde el CDN de jsDelivr (bloqueado por la CSP),
 * apuntamos el loader al bundle local servido en /monaco/vs por
 * `scripts/copy-monaco.mjs`. Así el editor y sus workers se cargan
 * desde 'self', manteniendo estricta la Content-Security-Policy.
 */
loader.config({
	paths: {
		vs: '/monaco/vs',
	},
})

export {}
