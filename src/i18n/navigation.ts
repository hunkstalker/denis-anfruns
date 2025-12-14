export interface NavItem {
	key: string
	path: string
	enabled: boolean
	children?: readonly NavItem[]
}

export const navItems: readonly NavItem[] = [
  { key: 'nav.home', path: '/', enabled: true },
  { 
    key: 'nav.blog', 
    path: '/blog/', 
    enabled: true,
    children: [
      { key: 'blog.series', path: '/devlog/', enabled: true },
      { key: 'blog.til', path: '/til/', enabled: true },
    ]
  },
  { key: 'nav.projects', path: '/projects/', enabled: false },
  { key: 'nav.about', path: '/about/', enabled: true },
]