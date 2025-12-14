// Redefine locally to avoid dependency issues with workspace package
export interface FilterConfig {
	keys: string[] | Record<string, string>
	label: string
	badge: string
	color: string
	filterType: string
}

export interface BadgeCreatedDetail {
	filterType: string
	config: FilterConfig
}

export interface SearchInputDetail {
	value: string
	activeFilter: string | null
}

export type BadgeCreatedEvent = CustomEvent<BadgeCreatedDetail>
export type SearchInputEvent = CustomEvent<SearchInputDetail>

declare global {
	interface HTMLElementEventMap {
		badgeCreated: BadgeCreatedEvent
		searchInput: SearchInputEvent
		badgeRemoved: CustomEvent<void>
	}
}
