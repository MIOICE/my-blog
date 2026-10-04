'use client'

import Link from 'next/link'
import dayjs from 'dayjs'
import { useMemo, useState } from 'react'
import { useBlogIndex } from '@/hooks/use-blog-index'
import { useAuthStore } from '@/hooks/use-auth'

export default function BlogPage() {
	const { items, loading } = useBlogIndex()
	const { isAuth } = useAuthStore()
	const [query, setQuery] = useState('')
	const [category, setCategory] = useState('全部')
	const categories = useMemo(() => ['全部', ...Array.from(new Set(items.map(i => i.category).filter(Boolean) as string[]))], [items])
	const filtered = useMemo(() => items.filter(item => (category === '全部' || item.category === category) && `${item.title} ${item.summary || ''} ${item.tags.join(' ')}`.toLowerCase().includes(query.toLowerCase())).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()), [items, category, query])
	return <div className='mx-auto max-w-5xl px-6 py-16 lg:py-24'>
		<div className='flex flex-col gap-8 border-b border-[#7f9c94]/20 pb-10 sm:flex-row sm:items-end sm:justify-between'>
			<div><p className='text-xs uppercase tracking-[.24em] text-[#8a9692]'>Archive</p><h1 className='mt-3 font-serif text-4xl'>文章</h1><p className='mt-4 text-[#73807b]'>按时间保存理解，按主题重新相遇。</p></div>
			{isAuth && <Link href='/write' className='self-start rounded-full bg-[#657e76] px-5 py-2.5 text-sm text-white'>写新文章</Link>}
		</div>
		<div className='mt-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between'>
			<div className='flex flex-wrap gap-2'>{categories.map(c => <button key={c} onClick={() => setCategory(c)} className={`rounded-full border px-3 py-1.5 text-xs ${category===c ? 'border-[#657e76] bg-[#657e76] text-white' : 'border-[#7f9c94]/20 bg-white/35 text-[#73807b]'}`}>{c}</button>)}</div>
			<input value={query} onChange={e => setQuery(e.target.value)} placeholder='搜索文章' className='w-full border-b border-[#7f9c94]/25 bg-transparent px-1 py-2 text-sm sm:w-52' />
		</div>
		<div className='mt-10 divide-y divide-[#7f9c94]/15'>
			{loading && <p className='py-12 text-sm text-[#8a9692]'>加载中…</p>}
			{filtered.map(item => <article key={item.slug} className='grid gap-3 py-8 sm:grid-cols-[120px_1fr_auto] sm:items-start'>
				<time className='text-sm text-[#98a39f]'>{dayjs(item.date).format('YYYY.MM.DD')}</time>
				<Link href={`/blog/${item.slug}`}><h2 className='text-xl font-medium hover:text-[#657e76]'>{item.title}</h2>{item.summary && <p className='mt-2 max-w-2xl leading-7 text-[#73807b]'>{item.summary}</p>}<p className='mt-3 text-xs text-[#93a09b]'>{item.category || '未分类'} · {item.tags.join(' / ')}</p></Link>
				{isAuth && <Link href={`/write/${item.slug}`} className='text-xs text-[#73807b] hover:text-[#35413e]'>编辑</Link>}
			</article>)}
			{!loading && filtered.length===0 && <p className='py-16 text-center text-sm text-[#8a9692]'>没有找到文章。</p>}
		</div>
	</div>
}
