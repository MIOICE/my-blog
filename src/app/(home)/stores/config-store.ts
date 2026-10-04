import { create } from 'zustand'
import siteContent from '@/config/site-content.json'

export type SiteContent = typeof siteContent

interface ConfigStore {
	siteContent: SiteContent
	setSiteContent: (content: SiteContent) => void
	resetSiteContent: () => void
}

export const useConfigStore = create<ConfigStore>(set => ({
	siteContent: structuredClone(siteContent),
	setSiteContent: content => set({ siteContent: content }),
	resetSiteContent: () => set({ siteContent: structuredClone(siteContent) })
}))
