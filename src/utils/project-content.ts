import { getCollection } from 'astro:content'

export async function getProjects() {
	const projects = await getCollection('projects', ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true
	})
	return projects
}
