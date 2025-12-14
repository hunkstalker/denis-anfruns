import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const root = path.join(__dirname, '../content')
const langs = ['es', 'en', 'ca']

const write = (filePath, content) => {
	fs.mkdirSync(path.dirname(filePath), { recursive: true })
	fs.writeFileSync(filePath, content)
	console.log('Created:', filePath)
}

// --- DATA SOURCE: High Quality Translated Content ---
const tilData = [
	{
		slug: 'power-fx-delegation-sharepoint',
		dates: { es: '2025-01-15', en: '2025-02-10', ca: '2025-01-20' },
		content: {
			es: {
				title: 'Delegación Power FX en SharePoint',
				desc: 'Cómo manejar grandes listas y evitar el límite de 500/2000 items.',
				body: 'Al trabajar con SharePoint, funciones como `Search` o `Filter` pueden no ser delegables. Usa colecciones previas o Vistas indexadas.',
			},
			en: {
				title: 'Power FX Delegation in SharePoint',
				desc: 'Handling large lists and avoiding the 500/2000 item limit.',
				body: 'When working with SharePoint, functions like `Search` or `Filter` might not delegate. Use pre-collections or Indexed Views.',
			},
			ca: {
				title: 'Delegació Power FX a SharePoint',
				desc: 'Com gestionar grans llistes i evitar el límit de 500/2000 elements.',
				body: 'En treballar amb SharePoint, funcions com `Search` o `Filter` poden no ser delegables. Usa col·leccions prèvies o Vistes indexades.',
			},
		},
		code: `Filter(Accounts, 'Created On' >= Date(2025,1,1))`,
	},
	{
		slug: 'power-apps-patch-concurrency',
		dates: { es: '2025-02-05', en: '2025-03-12', ca: '2025-02-08' },
		content: {
			es: {
				title: 'Función Patch y Concurrencia',
				desc: 'Actualizar registros evitando conflictos de edición.',
				body: 'Usa `If-Match` en headers o la configuración de concurrencia de la lista para evitar sobrescrituras accidentales.',
			},
			en: {
				title: 'Patch Function & Concurrency',
				desc: 'Updating records while avoiding edit conflicts.',
				body: 'Use `If-Match` headers or list concurrency settings to prevent accidental overwrites.',
			},
			ca: {
				title: 'Funció Patch icurrència',
				desc: "Actualitzar registres evitant conflictes d'edició.",
				body: 'Usa `If-Match` en headers o la configuració de concurrència de la llista per evitar sobreescriptures accidentals.',
			},
		},
		code: `Patch(Orders, ThisItem, { Status: "Approved" })`,
	},
	{
		slug: 'sharepoint-rest-vs-graph',
		dates: { es: '2025-03-20', en: '2025-04-15', ca: '2025-03-22' },
		content: {
			es: {
				title: 'API REST SharePoint vs Graph',
				desc: 'Comparativa de rendimiento y capacidades en Power Platform.',
				body: 'Graph es el futuro, pero la API REST de SharePoint sigue siendo más rápida y completa para manipulación de listas específicas.',
			},
			en: {
				title: 'SharePoint REST API vs Graph',
				desc: 'Performance and capability comparison in Power Platform.',
				body: 'Graph is the future, but SharePoint REST API remains faster and more complete for specific list manipulation.',
			},
			ca: {
				title: 'API REST SharePoint vs Graph',
				desc: 'Comparativa de rendiment i capacitats a Power Platform.',
				body: "Graph és el futur, però l'API REST de SharePoint continua sent més ràpida i completa per a manipulació de llistes específiques.",
			},
		},
		code: `_api/web/lists/getbytitle('Documents')/items`,
	},
	{
		slug: 'canvas-apps-performance-collections',
		dates: { es: '2025-04-10', en: '2025-05-05', ca: '2025-04-12' },
		content: {
			es: {
				title: 'Rendimiento con Collections',
				desc: 'Caché local para reducir llamadas de red en Canvas Apps.',
				body: 'Carga tus datos estáticos en `App.OnStart` usando `ClearCollect` para una experiencia instantánea.',
			},
			en: {
				title: 'Performance with Collections',
				desc: 'Local caching to reduce network calls in Canvas Apps.',
				body: 'Load your static data on `App.OnStart` using `ClearCollect` for an instant experience.',
			},
			ca: {
				title: 'Rendiment amb Collections',
				desc: 'Caché local per reduir trucades de xarxa en Canvas Apps.',
				body: 'Carrega les teves dades estàtiques a `App.OnStart` usant `ClearCollect` per a una experiència instantània.',
			},
		},
		code: `ClearCollect(LocalMenus, SharePointMenus)`,
	},
	{
		slug: 'complex-formulas-with',
		dates: { es: '2025-05-25', en: '2025-06-18', ca: '2025-05-28' },
		content: {
			es: {
				title: 'Simplificando fórmulas con With',
				desc: 'Mejora la legibilidad y evita cálculos repetidos.',
				body: 'La función `With` permite definir variables locales dentro de una fórmula, haciendo el código más limpio y rápido.',
			},
			en: {
				title: 'Simplifying formulas with With',
				desc: 'Improve readability and avoid repeated calculations.',
				body: 'The `With` function allows defining local variables within a formula, making code cleaner and faster.',
			},
			ca: {
				title: 'Simplificant fórmules amb With',
				desc: 'Millora la llegibilitat i evita càlculs repetits.',
				body: "La funció `With` permet definir variables locals dins d'una fórmula, fent el codi més net i ràpid.",
			},
		},
		code: `With({ profit: Price - Cost }, If(profit > 0, "Gain", "Loss"))`,
	},
	{
		slug: 'custom-connectors-oauth2',
		dates: { es: '2025-06-30', en: '2025-07-12', ca: '2025-07-02' },
		content: {
			es: {
				title: 'Conectores Personalizados OAuth2',
				desc: 'Autenticación segura contra APIs externas.',
				body: 'Configura correctamente el `Redirect URL` en tu proveedor de identidad (Azure AD, Google) para permitir el flujo OAuth.',
			},
			en: {
				title: 'Custom Connectors OAuth2',
				desc: 'Secure authentication against external APIs.',
				body: 'Correctly configure the `Redirect URL` in your identity provider (Azure AD, Google) to allow the OAuth flow.',
			},
			ca: {
				title: 'Connectors Personalitzats OAuth2',
				desc: 'Autenticació segura contra APIs externes.',
				body: "Configura correctament la `Redirect URL` al teu proveïdor d'identitat (Azure AD, Google) per permetre el flux OAuth.",
			},
		},
		code: `https://global.consent.azure-apim.net/redirect`,
	},
	{
		slug: 'sharepoint-threshold-views',
		dates: { es: '2025-07-15', en: '2025-08-20', ca: '2025-07-18' },
		content: {
			es: {
				title: 'Superando el límite de 5000 items',
				desc: 'Uso de columnas indexadas y vistas filtradas.',
				body: 'No intentes cargar todo. Indexa las columnas que usas en el `Filter` y crea vistas de SharePoint que ya vengan filtradas.',
			},
			en: {
				title: 'Overcoming the 5000 item limit',
				desc: 'Using indexed columns and filtered views.',
				body: 'Do not try to load everything. Index the columns used in `Filter` and create SharePoint views that are already filtered.',
			},
			ca: {
				title: 'Superant el límit de 5000 elements',
				desc: 'Ús de columnes indexades i vistes filtrades.',
				body: 'No intentis carregar-ho tot. Indexa les columnes que uses al `Filter` i crea vistes de SharePoint que ja vinguin filtrades.',
			},
		},
		code: `View: "Active Items" (Filtered by Status='Active')`,
	},
	{
		slug: 'responsive-containers-flex',
		dates: { es: '2025-08-01', en: '2025-09-10', ca: '2025-08-05' },
		content: {
			es: {
				title: 'Contenedores Flexibles Responsivos',
				desc: 'Diseño adaptable sin coordenadas X/Y absolutas.',
				body: 'Abandona el posicionamiento absoluto. Usa contenedores horizontales y verticales con `JustifyContent` y `AlignItems`.',
			},
			en: {
				title: 'Responsive Flexible Containers',
				desc: 'Adaptive design without absolute X/Y coordinates.',
				body: 'Ditch absolute positioning. Use horizontal and vertical containers with `JustifyContent` and `AlignItems`.',
			},
			ca: {
				title: 'Contenidors Flexibles Responsius',
				desc: 'Disseny adaptable sense coordenades X/Y absolutes.',
				body: 'Abandona el posicionament absolut. Usa contenidors horitzontals i verticals amb `JustifyContent` i `AlignItems`.',
			},
		},
		code: `Parent.Width > 600`,
	},
]

// 1. GENERATE TILS
tilData.forEach((item) => {
	langs.forEach((lang) => {
		const directory = path.join(root, 'til', item.slug)
		const data = item.content[lang]

		const fileContent = `---
title: "${data.title}"
description: "${data.desc}"
pubDate: "${item.dates[lang]}"
tags: ["power-platform", "sharepoint", "power-fx"]
lang: "${lang}"
draft: true
---

# ${data.title}

${data.body}

\`\`\`powerfx
${item.code}
\`\`\`

Esta es una nota rápida sobre una lección aprendida.
`
		write(path.join(directory, `${lang}.mdx`), fileContent)
	})
})

// 2. GENERATE DEVLOGS (Improved quality)
const blogRoot = path.join(root, 'blog')
const series = [
	{
		id: 'legacy-migration',
		title: { es: 'Migración Legacy', en: 'Legacy Migration', ca: 'Migració Legacy' },
		desc: 'Moving from VB6 to .NET Core',
	},
	{
		id: 'future-architecture',
		title: { es: 'Arquitectura Futura', en: 'Future Architecture', ca: 'Arquitectura Futura' },
		desc: 'Microservices vs Monolith',
	},
]

series.forEach((currSeries) => {
	for (let part = 1; part <= 3; part++) {
		const folder = path.join(blogRoot, currSeries.id, `part-${part}`)

		// Ensure folder has meta.json (using ES for metadata usually)
		write(
			path.join(folder, 'meta.json'),
			JSON.stringify(
				{
					pubDate: `2023-0${part}-15`,
					tags: ['devlog', 'architecture'],
					heroImage: '/placeholder-social.jpg',
					series: currSeries.id,
					seriesTitle: currSeries.title.en, // Fallback or localized logic in component handles title
				},
				null,
				2,
			),
		)

		langs.forEach((lang) => {
			const title = `${currSeries.title[lang]} - Part ${part}`
			const mdx = `---
title: "${title}"
description: "${currSeries.desc} (${lang})"
pubDate: "2023-0${part}-15"
tags: ["devlog"]
series: "${currSeries.id}"
seriesTitle: "${currSeries.title[lang]}"
lang: "${lang}"
draft: true
heroImage: "/placeholder-social.jpg"
---

# ${title}

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 

## Technical Details (${lang})

We decided to use **Vertical Slice Architecture** because...
`
			write(path.join(folder, `${lang}.mdx`), mdx)
		})
	}
})

// 3. GENERATE PROJECTS (Improved quality)
const projectsRoot = path.join(root, 'projects')
const projectList = [
	{ slug: 'ai-canvas', title: 'AI Canvas', tags: ['react', 'ai'] },
	{ slug: 'crypto-tracker', title: 'Crypto Tracker', tags: ['web3', 'svelte'] },
	{ slug: 'portfolio-v1', title: 'Old Portfolio', tags: ['html', 'css'] },
	{ slug: 'task-manager', title: 'Task Master', tags: ['vue', 'firebase'] },
]

projectList.forEach((proj, i) => {
	const projDir = path.join(projectsRoot, proj.slug)
	langs.forEach((lang) => {
		const mdx = `---
title: "${proj.title} ${lang.toUpperCase()}"
description: "High performance ${proj.title} implementation in ${lang}."
pubDate: "2024-0${i + 1}-10"
tags: ${JSON.stringify(proj.tags)}
lang: "${lang}"
draft: true
heroImage: "/placeholder-social.jpg"
---

# ${proj.title}

Detailed case study of the **${proj.title}** project.

## Challenges
Implementation details for ${lang} user base.
`
		// Projects usually follow same structure: slug/lang.mdx or slug.mdx
		// Based on blog, slug/lang.mdx is safest for i18n
		write(path.join(projDir, `${lang}.mdx`), mdx)
	})
})
