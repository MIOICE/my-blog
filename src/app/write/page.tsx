'use client'

import { useWriteStore } from './stores/write-store'
import { usePreviewStore } from './stores/preview-store'
import { WriteEditor } from './components/editor'
import { WriteSidebar } from './components/sidebar'
import { WriteActions } from './components/actions'
import { WritePreview } from './components/preview'
import { useEffect } from 'react'
import Link from 'next/link'
import { useAuthStore } from '@/hooks/use-auth'

export default function WritePage() {
	const { form, cover, reset } = useWriteStore()
	const { isAuth } = useAuthStore()
	useEffect(() => reset(), [])
	const { isPreview, closePreview } = usePreviewStore()

	const coverPreviewUrl = cover ? (cover.type === 'url' ? cover.url : cover.previewUrl) : null
	if (!isAuth) return <div className='mx-auto grid min-h-[60vh] max-w-xl place-items-center px-6 text-center'><div><h1 className='font-serif text-3xl'>需要管理权限</h1><p className='mt-4 text-sm leading-7 text-[#7b8884]'>请从页脚“管理”入口导入 PEM 私钥后再进入写作页。</p><Link href='/' className='mt-6 inline-block rounded-full bg-[#657e76] px-5 py-2 text-sm text-white'>返回首页</Link></div></div>

	return isPreview ? (
		<WritePreview form={form} coverPreviewUrl={coverPreviewUrl} onClose={closePreview} />
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
