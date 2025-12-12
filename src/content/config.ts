import { defineCollection, z } from 'astro:content';

const privacy = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    lastUpdated: z.string(),
  }),
});

const blog = defineCollection({
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
    seriesTitle: z.string().optional(),
    new: z.boolean().default(false),
    lang: z.enum(['es', 'en', 'ca']).default('es'),
    draft: z.boolean().default(false),
  })
})

const til = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    pubDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]).optional(),
    lang: z.enum(['es', 'en', 'ca']).default('es'),
    draft: z.boolean().default(false),
  })
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
  })
})

export const collections = { privacy, blog, til, projects }
