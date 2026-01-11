export interface ContentItem {
	id: string; // "folder/slug" or "slug"
	filePath: string;
	collection: 'notes' | 'devlogs';
	series?: string;
	title: string;
	new?: boolean;
	draft?: boolean;
	icon?: string; // Icon key from meta.json
	tags?: string[];
	pubDate?: string;
}

// Group Folder type for UI
export interface SeriesFolder {
	id: string; // The series ID
	type: 'folder';
	title: string; // Series title
	collection: 'notes' | 'devlogs';
	icon?: string; // Propagated icon
	children: ContentItem[];
	pubDate?: string; // Latest child date
}

export type GridItem = ContentItem | SeriesFolder;
