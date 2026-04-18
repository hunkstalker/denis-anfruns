import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'
import { TAGS } from './data/tags' // Ruta actualizada de ../data/tags a ./data/tags

const privacy = defineCollection({
	loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/privacy' }),
	schema: z.object({
		title: z.string(),
		lastUpdated: z.string(),
	}),
})

const devlogs = defineCollection({
	loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/devlogs' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		series: z.string().optional(),
		seriesTitle: z.string().or(z.object({ es: z.string(), en: z.string(), ca: z.string().optional() })).optional(),
		seriesDescription: z.string().or(z.object({ es: z.string(), en: z.string(), ca: z.string().optional() })).optional(),
		heroImage: z.string().optional(),
		descriptionHeroImage: z.string().optional(),
		ogImage: z.string().optional(),
		pubDate: z.coerce.date().optional(),
		updatedDate: z.coerce.date().optional(),
		tags: z.array(z.string()).default([]).optional(),
		lang: z.enum(['es', 'en', 'ca']).default('es'),
		icon: z.enum(['git', 'typescript', 'react', 'astro', 'javascript', 'css', 'powerapps', 'vite']).optional(),
		new: z.boolean().default(false),
		end: z.boolean().optional(),
		draft: z.boolean().default(false),
	}),
})

const notes = defineCollection({
	loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/notes' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		pubDate: z.coerce.date().optional(),
		tags: z.array(z.string()).default([]).optional(),
		series: z.string().optional(),
		seriesTitle: z.string().or(z.object({ es: z.string(), en: z.string(), ca: z.string().optional() })).optional(),
		seriesDescription: z.string().or(z.object({ es: z.string(), en: z.string(), ca: z.string().optional() })).optional(),
		lang: z.enum(['es', 'en', 'ca']).default('es'),
		new: z.boolean().default(false),
		end: z.boolean().optional(),
		draft: z.boolean().default(false),
		icon: z.enum(['git', 'typescript', 'react', 'astro', 'javascript', 'css', 'powerapps', 'vite']).optional(),
	}),
})

const projects = defineCollection({
	loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/projects' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		pubDate: z.coerce.date().optional(),
		updatedDate: z.coerce.date().optional(),
		heroImage: z.string().optional(),
		descriptionHeroImage: z.string().optional(),
		ogImage: z.string().optional(),
		tags: z.array(z.string()).default([]).optional(),
		lang: z.enum(['es', 'en', 'ca']).default('es'),
		draft: z.boolean().default(false),
	}),
})

export const collections = { privacy, devlogs, notes, projects }
