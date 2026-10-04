'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import dayjs from 'dayjs'
import { BlogPreview } from '@/components/blog-preview'
import { loadBlog, type BlogConfig } from '@/lib/load-blog'
import { useReadArticles } from '@/hooks/use-read-articles'

export default function Page() {
	const params = useParams() as { id?: string | string[] }
	const slug = Array.isArray(params?.id) ? params.id[0] : params?.id || ''
	const { markAsRead } = useReadArticles()
	const [blog,setBlog] = useState<{config:BlogConfig;markdown:string;cover?:string}|null>(null)
	const [error,setError] = useState<string|null>(null)
	useEffect(() => { let active=true; if(slug) loadBlog(slug).then(data => {if(active){setBlog(data);markAsRead(slug)}}).catch(e => active&&setError(e?.message||'加载失败')); return()=>{active=false} },[slug,markAsRead])
	const date = useMemo(() => dayjs(blog?.config.date).format('YYYY年 M月 D日'),[blog?.config.date])
	if(error) return <div className='grid min-h-[60vh] place-items-center text-sm text-red-500'>{error}</div>
	if(!blog) return <div className='grid min-h-[60vh] place-items-center text-sm text-[#8a9692]'>加载中…</div>
	return <BlogPreview markdown={blog.markdown} title={blog.config.title||slug} tags={blog.config.tags||[]} date={date} summary={blog.config.summary} cover={blog.cover} slug={slug}/>
}
