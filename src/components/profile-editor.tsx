'use client'

import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { useAuthStore } from '@/hooks/use-auth'
import { useConfigStore, type SiteContent } from '@/app/(home)/stores/config-store'
import { pushSiteContent } from '@/app/(home)/services/push-site-content'
import type { FileItem } from '@/app/(home)/types'

export default function ProfileEditor({ open, onClose }: { open:boolean; onClose:()=>void }) {
	const { isAuth, setPrivateKey } = useAuthStore()
	const { siteContent, setSiteContent } = useConfigStore()
	const [form,setForm] = useState<SiteContent>(siteContent)
	const [avatar,setAvatar] = useState<FileItem|null>(null)
	const [saving,setSaving] = useState(false)
	const keyRef = useRef<HTMLInputElement>(null)
	useEffect(() => { if(open){setForm(structuredClone(siteContent));setAvatar(null)} },[open,siteContent])
	if(!open) return null
	const save = async () => {
		setSaving(true)
		try {
			const next = avatar?.type === 'file' ? {...form,meta:{...form.meta,avatar:'/images/avatar.png'}} : form
			await pushSiteContent(next,avatar)
			setSiteContent(next); toast.success('个人资料已保存'); onClose()
		} catch(e:any){toast.error(e?.message||'保存失败')} finally {setSaving(false)}
	}
	const chooseKey = async (file?:File) => { if(!file)return; setPrivateKey(await file.text()); await save() }
	const updateSocial = (index:number,key:'label'|'value',value:string) => setForm({...form,socialButtons:form.socialButtons.map((item,i)=>i===index?{...item,[key]:value}:item)})
	const moveSocial = (index:number,direction:-1|1) => {
		const target = index + direction
		if (target < 0 || target >= form.socialButtons.length) return
		const next = [...form.socialButtons]
		;[next[index],next[target]] = [next[target],next[index]]
		setForm({...form,socialButtons:next.map((item,order)=>({...item,order:order+1}))})
	}
	return <div className='fixed inset-0 z-50 grid place-items-center bg-[#26312e]/25 p-4 backdrop-blur-sm' onMouseDown={e=>e.target===e.currentTarget&&onClose()}>
		<div className='max-h-[90vh] w-full max-w-2xl overflow-auto rounded-[28px] border border-white/70 bg-[#faf9f5] p-6 shadow-2xl sm:p-8'>
			<div className='flex items-center justify-between'><div><p className='text-xs uppercase tracking-[.2em] text-[#8a9692]'>Profile</p><h2 className='mt-2 font-serif text-2xl'>编辑个人资料</h2></div><button onClick={onClose} className='text-sm text-[#7d8b86]'>关闭</button></div>
			<div className='mt-8 grid gap-6 sm:grid-cols-[120px_1fr]'>
				<label className='cursor-pointer'><img src={avatar?.type==='file'?avatar.previewUrl:(form.meta.avatar||'/images/avatar.svg')} alt='' className='size-24 rounded-full object-cover'/><span className='mt-2 block text-xs text-[#657e76]'>更换头像</span><input type='file' accept='image/*' className='hidden' onChange={e=>{const file=e.target.files?.[0];if(file)setAvatar({type:'file',file,previewUrl:URL.createObjectURL(file)})}}/></label>
				<div className='space-y-4'>
					<div className='grid gap-4 sm:grid-cols-2'><label className='text-xs text-[#74817c]'>站点名<input className='mt-2 w-full rounded-xl border border-black/10 bg-white/60 px-3 py-2 text-sm' value={form.meta.title} onChange={e=>setForm({...form,meta:{...form.meta,title:e.target.value}})}/></label><label className='text-xs text-[#74817c]'>昵称<input className='mt-2 w-full rounded-xl border border-black/10 bg-white/60 px-3 py-2 text-sm' value={form.meta.username} onChange={e=>setForm({...form,meta:{...form.meta,username:e.target.value}})}/></label></div>
					<label className='block text-xs text-[#74817c]'>简介<textarea rows={4} className='mt-2 w-full rounded-xl border border-black/10 bg-white/60 px-3 py-2 text-sm leading-6' value={form.meta.description} onChange={e=>setForm({...form,meta:{...form.meta,description:e.target.value}})}/></label>
				</div>
			</div>
			<div className='mt-8 border-t border-black/5 pt-6'><div className='flex items-center justify-between'><h3 className='text-sm font-medium'>社交链接</h3><button onClick={()=>setForm({...form,socialButtons:[...form.socialButtons,{id:crypto.randomUUID(),type:'link',value:'',label:'新链接',order:form.socialButtons.length+1}]})} className='text-xs text-[#657e76]'>＋ 添加</button></div>
				<div className='mt-4 space-y-3'>{form.socialButtons.map((item,index)=><div key={item.id} className='grid grid-cols-[1fr_2fr_auto] gap-2'><input aria-label='链接名称' className='rounded-xl border border-black/10 bg-white/60 px-3 py-2 text-sm' value={item.label} onChange={e=>updateSocial(index,'label',e.target.value)}/><input aria-label='链接地址' className='rounded-xl border border-black/10 bg-white/60 px-3 py-2 text-sm' value={item.value} onChange={e=>updateSocial(index,'value',e.target.value)}/><div className='flex items-center'><button aria-label='上移' disabled={index===0} onClick={()=>moveSocial(index,-1)} className='px-1 text-xs disabled:opacity-20'>↑</button><button aria-label='下移' disabled={index===form.socialButtons.length-1} onClick={()=>moveSocial(index,1)} className='px-1 text-xs disabled:opacity-20'>↓</button><button onClick={()=>setForm({...form,socialButtons:form.socialButtons.filter((_,i)=>i!==index).map((link,order)=>({...link,order:order+1}))})} className='px-2 text-xs text-[#a07870]'>删除</button></div></div>)}</div>
			</div>
			<div className='mt-8 flex justify-end gap-3'><button onClick={onClose} className='rounded-full border border-black/10 px-5 py-2 text-sm'>取消</button><button disabled={saving} onClick={()=>isAuth?save():keyRef.current?.click()} className='rounded-full bg-[#657e76] px-5 py-2 text-sm text-white disabled:opacity-50'>{saving?'保存中…':isAuth?'保存':'导入密钥并保存'}</button></div>
			<input ref={keyRef} type='file' accept='.pem' className='hidden' onChange={e=>chooseKey(e.target.files?.[0])}/>
		</div>
	</div>
}
