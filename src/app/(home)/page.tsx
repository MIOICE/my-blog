'use client'

import Link from 'next/link'
import dayjs from 'dayjs'
import { useBlogIndex } from '@/hooks/use-blog-index'
import { useConfigStore } from './stores/config-store'

export default function Home() {
	const { siteContent } = useConfigStore()
	const { items, loading } = useBlogIndex()
	const latest = [...items].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5)
	const avatar = siteContent.meta.avatar || '/images/avatar.svg'
	return (
		<div className='mx-auto grid max-w-6xl gap-16 px-6 py-20 lg:grid-cols-[320px_1fr] lg:py-28'>
			<aside className='lg:sticky lg:top-32 lg:self-start'>
				<img src={avatar} alt={siteContent.meta.username} className='size-24 rounded-full border border-white/80 object-cover shadow-[0_24px_60px_-30px_rgba(71,91,84,.5)]' />
				<p className='mt-8 text-xs uppercase tracking-[.24em] text-[#8a9692]'>{siteContent.meta.title}</p>
				<h1 className='mt-3 font-serif text-4xl leading-tight text-[#2f3b37]'>{siteContent.meta.username}</h1>
				<p className='mt-6 text-[15px] leading-8 text-[#697772]'>{siteContent.meta.description}</p>
				<div className='mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[#657e76]'>
					{[...siteContent.socialButtons].sort((a,b) => a.order-b.order).map(link => <a key={link.id} href={link.value} target={link.value.startsWith('http') ? '_blank' : undefined} rel='noreferrer' className='border-b border-[#7f9c94]/30 pb-1 hover:border-[#657e76]'>{link.label || link.type}</a>)}
				</div>
			</aside>
			<section>
				<div className='flex items-end justify-between border-b border-[#7f9c94]/20 pb-5'>
					<div><p className='text-xs uppercase tracking-[.24em] text-[#8a9692]'>Latest writing</p><h2 className='mt-2 font-serif text-3xl'>最近文章</h2></div>
					<Link href='/blog' className='text-sm text-[#657e76]'>查看全部 →</Link>
				</div>
				<div className='divide-y divide-[#7f9c94]/15'>
					{loading && <p className='py-12 text-sm text-[#8a9692]'>正在读取文章…</p>}
					{latest.map(item => <Link key={item.slug} href={`/blog/${item.slug}`} className='group grid gap-3 py-8 sm:grid-cols-[110px_1fr]'>
						<time className='text-sm text-[#98a39f]'>{dayjs(item.date).format('YYYY.MM.DD')}</time>
						<div><h3 className='text-xl font-medium transition group-hover:text-[#657e76]'>{item.title}</h3>{item.summary && <p className='mt-3 line-clamp-2 leading-7 text-[#73807b]'>{item.summary}</p>}<p className='mt-4 text-xs tracking-wide text-[#93a09b]'>{item.category || '未分类'} · {item.tags.join(' / ')}</p></div>
					</Link>)}
					{!loading && latest.length === 0 && <p className='py-12 text-sm text-[#8a9692]'>还没有公开文章。</p>}
				</div>
			</section>
		</div>
	)
}
