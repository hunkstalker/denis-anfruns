export {}

declare global {
	interface Window {
		pagefind: Pagefind
	}
}

export interface Pagefind {
	search(query: string): Promise<PagefindSearch>
	options(options: Record<string, unknown>): void
	init(): Promise<void>
}

export interface PagefindSearch {
	results: PagefindResult[]
}

export interface PagefindResult {
	id: string
	data: () => Promise<PagefindData>
	score: number
	words: number[]
}

export interface PagefindData {
	url: string
	content: string
	word_count: number
	filters: Record<string, string[]>
	meta: Record<string, string> & { title: string; description: string }
	anchors: PagefindAnchor[]
	raw_content?: string
	raw_url?: string
	excerpt: string
	sub_results: PagefindSubResult[]
	language: string
}

export interface PagefindAnchor {
	element: string
	id: string
	text: string
	location: number
}

export interface PagefindSubResult {
	title: string
	url: string
	excerpt: string
	anchor?: PagefindAnchor
}
