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
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    tags: z.array(z.string()).default(['general']),
    series: z.string().optional(),
    new: z.boolean().default(false),
    lang: z.enum(['es', 'en', 'ca']).default('es'),
    draft: z.boolean().default(false),
  })
})

export const collections = { privacy, blog }
