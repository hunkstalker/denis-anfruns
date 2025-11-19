import { defineCollection, z } from 'astro:content';

const privacy = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    lastUpdated: z.string(),
  }),
});

export const collections = { privacy };
