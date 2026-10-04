'use client'

import { useParams } from 'next/navigation'
import { useWriteStore } from '../stores/write-store'
import { usePreviewStore } from '../stores/preview-store'
import { useLoadBlog } from '../hooks/use-load-blog'
import { WriteEditor } from '../components/editor'
import { WriteSidebar } from '../components/sidebar'
import { WriteActions } from '../components/actions'
import { WritePreview } from '../components/preview'
import Link from 'next/link'
import { useAuthStore } from '@/hooks/use-auth'

export default function EditBlogPage() {
	const params = useParams() as { slug?: string }
	const slug = params?.slug || ''
	const { isAuth } = useAuthStore()

	const { form, cover } = useWriteStore()
	const { isPreview, closePreview } = usePreviewStore()
	const { loading } = useLoadBlog(slug)

	const coverPreviewUrl = cover ? (cover.type === 'url' ? cover.url : cover.previewUrl) : null
	if (!isAuth) return <div className='mx-auto grid min-h-[60vh] max-w-xl place-items-center px-6 text-center'><div><h1 className='font-serif text-3xl'>需要管理权限</h1><p className='mt-4 text-sm leading-7 text-[#7b8884]'>请从页脚“管理”入口导入 PEM 私钥后再编辑文章。</p><Link href='/' className='mt-6 inline-block rounded-full bg-[#657e76] px-5 py-2 text-sm text-white'>返回首页</Link></div></div>

	if (loading) {
		return <div className='text-secondary flex h-screen items-center justify-center text-sm'>加载中...</div>
	}

	if (!slug) {
		return <div className='flex h-screen items-center justify-center text-sm text-red-500'>无效的博客 ID</div>
	}

	return isPreview ? (
		<WritePreview form={form} coverPreviewUrl={coverPreviewUrl} onClose={closePreview} slug={slug} />
	) : (
		<>
			<div className='mx-auto flex h-full max-w-6xl flex-col gap-6 px-6 pt-10 pb-32 lg:flex-row'>
				<WriteEditor />
				<WriteSidebar />
			</div>

			<WriteActions />
		</>
	)
}
