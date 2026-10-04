'use client'

import { useMarkdownRender } from '@/hooks/use-markdown-render'
import Link from 'next/link'
import { useAuthStore } from '@/hooks/use-auth'

type Props = { markdown:string; title:string; tags:string[]; date:string; summary?:string; cover?:string; slug?:string }
export function BlogPreview({ markdown, title, tags, date, summary, cover, slug }: Props) {
	const { content, toc, loading } = useMarkdownRender(markdown)
	const { isAuth } = useAuthStore()
	if (loading) return <div className='grid min-h-[60vh] place-items-center text-sm text-[#8a9692]'>渲染中…</div>
	return <div className='mx-auto grid max-w-6xl gap-14 px-6 py-16 lg:grid-cols-[minmax(0,820px)_220px] lg:py-24'>
		<article className='min-w-0'>
			<header className='border-b border-[#7f9c94]/20 pb-10'>
				<div className='flex items-center justify-between gap-4'><p className='text-xs uppercase tracking-[.22em] text-[#8a9692]'>{date}</p>{isAuth && slug && <Link href={`/write/${slug}`} className='text-xs text-[#657e76] hover:underline'>编辑文章</Link>}</div>
				<h1 className='mt-5 max-w-3xl font-serif text-4xl leading-tight sm:text-5xl'>{title}</h1>
				{summary && <p className='mt-6 max-w-2xl text-lg leading-8 text-[#6f7d78]'>{summary}</p>}
				<div className='mt-6 flex flex-wrap gap-2'>{tags.map(tag => <span key={tag} className='rounded-full border border-[#7f9c94]/20 px-3 py-1 text-xs text-[#7d8b86]'>#{tag}</span>)}</div>
			</header>
			{cover && <img src={cover} alt='' className='mt-10 max-h-[480px] w-full rounded-[28px] object-cover' />}
			<div className='prose mt-12 max-w-none'>{content}</div>
		</article>
		{toc.length > 0 && <aside className='hidden lg:block'><div className='sticky top-28 border-l border-[#7f9c94]/20 pl-5'><p className='mb-4 text-xs uppercase tracking-[.2em] text-[#98a39f]'>目录</p><nav className='space-y-3 text-sm text-[#74817c]'>{toc.map(item => <a key={item.id} href={`#${item.id}`} className={`block hover:text-[#35413e] ${item.level>2 ? 'pl-3 text-xs' : ''}`}>{item.text}</a>)}</nav></div></aside>}
	</div>
}
