import { defineCollection, z } from 'astro:content';

const privacy = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    lastUpdated: z.string(),
  }),
});

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    shortDescription: z.string(),
    technologies: z.array(z.string()),
    image: z.string(),
    github: z.string().optional(),
    demo: z.string().optional(),
    featured: z.boolean(),
    date: z.string(),
    category: z.string(),
  }),
});

export const collections = { privacy, projects };
