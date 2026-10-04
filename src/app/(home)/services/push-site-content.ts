import { toBase64Utf8, getRef, createTree, createCommit, updateRef, createBlob, type TreeItem } from '@/lib/github-client'
import { getAuthToken } from '@/lib/auth'
import { GITHUB_CONFIG } from '@/consts'
import { toast } from 'sonner'
import { fileToBase64NoPrefix } from '@/lib/file-utils'
import type { SiteContent } from '../stores/config-store'
import type { FileItem } from '../types'

export async function pushSiteContent(siteContent: SiteContent, avatarItem?: FileItem | null): Promise<void> {
	const token = await getAuthToken()
	toast.info('正在准备个人资料...')
	const refData = await getRef(token, GITHUB_CONFIG.OWNER, GITHUB_CONFIG.REPO, `heads/${GITHUB_CONFIG.BRANCH}`)
	const treeItems: TreeItem[] = []

	if (avatarItem?.type === 'file') {
		const contentBase64 = await fileToBase64NoPrefix(avatarItem.file)
		const blobData = await createBlob(token, GITHUB_CONFIG.OWNER, GITHUB_CONFIG.REPO, contentBase64, 'base64')
		treeItems.push({ path: 'public/images/avatar.png', mode: '100644', type: 'blob', sha: blobData.sha })
	}

	const config = JSON.stringify(siteContent, null, '\t')
	const configBlob = await createBlob(token, GITHUB_CONFIG.OWNER, GITHUB_CONFIG.REPO, toBase64Utf8(config), 'base64')
	treeItems.push({ path: 'src/config/site-content.json', mode: '100644', type: 'blob', sha: configBlob.sha })

	const tree = await createTree(token, GITHUB_CONFIG.OWNER, GITHUB_CONFIG.REPO, treeItems, refData.sha)
	const commit = await createCommit(token, GITHUB_CONFIG.OWNER, GITHUB_CONFIG.REPO, '更新个人资料', tree.sha, [refData.sha])
	await updateRef(token, GITHUB_CONFIG.OWNER, GITHUB_CONFIG.REPO, `heads/${GITHUB_CONFIG.BRANCH}`, commit.sha)
	toast.success('个人资料已保存')
}
