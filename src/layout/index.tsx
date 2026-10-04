'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { PropsWithChildren, useState } from 'react'
import { Toaster } from 'sonner'
import { useAuthStore } from '@/hooks/use-auth'
import ProfileEditor from '@/components/profile-editor'
import { useConfigStore } from '@/app/(home)/stores/config-store'

export default function Layout({ children }: PropsWithChildren) {
	const pathname = usePathname()
	const { isAuth } = useAuthStore()
	const { siteContent } = useConfigStore()
	const [profileOpen, setProfileOpen] = useState(false)
	const nav = [
		{ href: '/', label: '首页' },
		{ href: '/blog', label: '文章' }
	]
	return (
		<div className='relative min-h-screen overflow-x-hidden bg-[#f5f4ef] text-[#34413d]'>
			<Toaster position='bottom-right' richColors />
			<div className='pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(164,190,180,.24),transparent_32%),radial-gradient(circle_at_85%_75%,rgba(213,198,174,.22),transparent_34%)]' />
			<header className='sticky top-0 z-40 border-b border-black/5 bg-[#f5f4ef]/80 backdrop-blur-xl'>
				<div className='mx-auto flex max-w-6xl items-center justify-between px-6 py-4'>
					<Link href='/' className='flex items-center gap-3 font-medium tracking-[.08em]'>
						<span className='grid size-9 place-items-center rounded-full border border-[#7f9c94]/30 bg-white/60 font-serif text-sm'>知</span>
						<span>{siteContent.meta.title}</span>
					</Link>
					<nav className='flex items-center gap-1 rounded-full border border-black/5 bg-white/45 p-1 text-sm'>
						{nav.map(item => <Link key={item.href} href={item.href} className={`rounded-full px-4 py-2 transition ${pathname === item.href ? 'bg-white text-[#35413e] shadow-sm' : 'text-[#7b8884] hover:text-[#35413e]'}`}>{item.label}</Link>)}
						{isAuth && <Link href='/write' className='rounded-full bg-[#657e76] px-4 py-2 text-white'>写文章</Link>}
					</nav>
				</div>
			</header>
			<main className='relative z-10 min-h-[calc(100vh-150px)]'>{children}</main>
			<footer className='relative z-10 mx-auto flex max-w-6xl items-center justify-between border-t border-black/5 px-6 py-8 text-xs text-[#8a9692]'>
				<span>记录理解，也记录变化。</span>
				<button onClick={() => setProfileOpen(true)} className='hover:text-[#35413e]'>{isAuth ? '编辑资料' : '管理'}</button>
			</footer>
			<ProfileEditor open={profileOpen} onClose={() => setProfileOpen(false)} />
		</div>
	)
}
