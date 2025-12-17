import { defineCollection, z } from 'astro:content'
// import { TAGS } from '../data/tags' // Validation too strict for CMS

const privacy = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		lastUpdated: z.string(),
	}),
})

const devlog = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		description: z.string(),
		pubDate: z.coerce.date().optional(),
		updatedDate: z.coerce.date().optional(),
		heroImage: z.string().optional(),
		descriptionHeroImage: z.string().optional(),
		ogImage: z.string().optional(),
		tags: z.array(z.string()).default([]).optional(),
		series: z.string().optional(),
		seriesTitle: z.string().or(z.object({ es: z.string(), en: z.string(), ca: z.string().optional() })).optional(),
		new: z.boolean().default(false),
        end: z.boolean().optional(),
		lang: z.enum(['es', 'en', 'ca']).default('es'),
		draft: z.boolean().default(false),
	}),
})

const til = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string().optional(),
		description: z.string().optional(),
		pubDate: z.coerce.date().optional(),
		tags: z.array(z.string()).default([]).optional(),
		series: z.string().optional(),
		seriesTitle: z.string().or(z.object({ es: z.string(), en: z.string(), ca: z.string().optional() })).optional(),
        seriesDescription: z.string().or(z.object({ es: z.string(), en: z.string(), ca: z.string().optional() })).optional(),
		lang: z.enum(['es', 'en', 'ca']).default('es'),
		new: z.boolean().default(false),
        end: z.boolean().optional(),
		draft: z.boolean().default(false),
		icon: z.enum(['git', 'typescript', 'react', 'astro', 'javascript', 'css', 'powerapps']).optional(),
	}),
})

const projects = defineCollection({
	type: 'content',
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

export const collections = { privacy, devlog, til, projects }
