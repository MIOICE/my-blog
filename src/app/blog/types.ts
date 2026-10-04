export type BlogIndexItem = {
	slug: string
	title: string
	tags: string[]
	date: string
	summary?: string
	cover?: string
	hidden?: boolean
	category?: string
	source?: 'obsidian' | 'web'
}

export type BlogConfig = {
	title?: string
	tags?: string[]
	date?: string
	summary?: string
	cover?: string
	hidden?: boolean
	category?: string
	source?: 'obsidian' | 'web'
}

