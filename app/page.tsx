"use client"

import React, { useState, useEffect } from "react"
import { Link } from "@/data/link"
import { Card } from "@/components/ui/card"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger, 
  DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Loader2 } from "lucide-react"
import { db } from "@/lib/firebase"
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot,
  Timestamp 
} from "firebase/firestore"

export default function Page() {
  const [links, setLinks] = useState<Link[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  
  // 폼 상태
  const [newTitle, setNewTitle] = useState("")
  const [newUrl, setNewUrl] = useState("")
  
  // 폼 검증 에러 상태
  const [errors, setErrors] = useState<{ title?: string; url?: string }>({})

  // Firestore에서 실시간으로 링크 목록 불러오기
  useEffect(() => {
    const q = query(
      collection(db, "users", "anonymous", "links"),
      orderBy("createdAt", "desc")
    )

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const linksData: Link[] = []
      querySnapshot.forEach((doc) => {
        linksData.push({ id: doc.id, ...doc.data() } as Link)
      })
      setLinks(linksData)
      setIsLoading(false)
    }, (error) => {
      console.error("Error fetching links: ", error)
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const resetForm = () => {
    setNewTitle("")
    setNewUrl("")
    setErrors({})
  }

  // 다이얼로그 상태 변경 핸들러
  const handleOpenChange = (open: boolean) => {
    setIsDialogOpen(open)
    if (!open) {
      resetForm()
    }
  }

  // URL 유효성 검사 함수
  const validateUrl = (url: string) => {
    if (!url.trim()) return "URL을 입력해주세요."
    
    let targetUrl = url.trim()
    if (!/^https?:\/\//i.test(targetUrl)) {
      targetUrl = "https://" + targetUrl
    }

    const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/
    if (!urlPattern.test(targetUrl)) {
      return "올바른 URL 형식이 아닙니다 (예: google.com)."
    }

    try {
      new URL(targetUrl)
      return null
    } catch {
      return "유효한 URL이 아닙니다."
    }
  }

  // 링크 추가 핸들러
  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const newErrors: { title?: string; url?: string } = {}
    
    // 타이틀 검증
    if (!newTitle.trim()) {
      newErrors.title = "타이틀을 입력해주세요."
    } else if (newTitle.trim().length > 40) {
      newErrors.title = "타이틀은 40자를 넘을 수 없습니다."
    }

    // URL 검증
    const urlError = validateUrl(newUrl)
    if (urlError) {
      newErrors.url = urlError
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      let finalUrl = newUrl.trim()
      if (!/^https?:\/\//i.test(finalUrl)) {
        finalUrl = "https://" + finalUrl
      }
      
      const domain = new URL(finalUrl).hostname
      const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`
      
      const newLinkData = {
        title: newTitle.trim(),
        url: finalUrl,
        faviconUrl: faviconUrl,
        order: links.length,
        isActive: true,
        isHighlighted: false,
        clickCount: 0,
        createdAt: Timestamp.now()
      }

      await addDoc(collection(db, "users", "anonymous", "links"), newLinkData)
      
      resetForm()
      setIsDialogOpen(false)
    } catch(err) {
      console.error("Error adding link: ", err)
      setErrors({ url: "링크 저장 중 오류가 발생했습니다." })
    }
  }

  // 활성화된 링크만 필터링하고 order 순으로 정렬
  const sortedActiveLinks = links
    .filter((link) => link.isActive)
    .sort((a, b) => a.order - b.order)

  return (
    <div className="flex min-h-svh flex-col items-center bg-background px-6 py-16">
      <div className="w-full max-w-md flex flex-col gap-6">
        
        {/* Profile Section */}
        <div className="mb-2 flex flex-col items-center">
           <div className="h-24 w-24 rounded-full bg-muted mb-4 overflow-hidden shadow-sm flex items-center justify-center p-0.5 border border-border">
             <img src="https://api.dicebear.com/9.x/notionists/svg?seed=my_username" alt="Profile" className="w-full h-full object-cover rounded-full" />
           </div>
           <h1 className="text-xl font-bold font-sans text-foreground">@my_username</h1>
           <p className="text-sm font-medium text-muted-foreground mt-2">
             Welcome to my link tree!
           </p>
        </div>

        {/* Add Link Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full rounded-xl border-dashed border-2 py-6 text-muted-foreground hover:text-foreground">
              <Plus className="mr-2 h-4 w-4" /> 새 링크 추가
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>새 링크 추가</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddLink} className="flex flex-col gap-5 py-4" noValidate>
              <div className="grid gap-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="title">타이틀</Label>
                  <span className={`text-[10px] font-medium ${newTitle.length > 40 ? "text-red-500" : "text-muted-foreground"}`}>
                    {newTitle.length}/40
                  </span>
                </div>
                <Input 
                  id="title" 
                  placeholder="예: 인스타그램, 블로그" 
                  value={newTitle}
                  onChange={(e) => {
                    setNewTitle(e.target.value)
                    if (errors.title) setErrors(prev => ({ ...prev, title: undefined }))
                  }}
                  autoComplete="off"
                  className={errors.title ? "border-red-500 focus-visible:ring-red-500 bg-red-50/10" : ""}
                />
                {errors.title && <p className="text-xs font-medium text-red-500 animate-in fade-in slide-in-from-top-1">{errors.title}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="url">URL</Label>
                <Input 
                  id="url" 
                  placeholder="velog.io/@my_username" 
                  value={newUrl}
                  onChange={(e) => {
                    setNewUrl(e.target.value)
                    if (errors.url) setErrors(prev => ({ ...prev, url: undefined }))
                  }}
                  autoComplete="off"
                  className={errors.url ? "border-red-500 focus-visible:ring-red-500 bg-red-50/10" : ""}
                />
                {errors.url && <p className="text-xs font-medium text-red-500 animate-in fade-in slide-in-from-top-1">{errors.url}</p>}
              </div>
              <DialogFooter className="mt-2">
                <Button type="submit" className="w-full sm:w-auto">
                  저장하기
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Links Section */}
        <div className="flex flex-col gap-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin mb-2 opacity-50" />
              <p className="text-sm font-medium">링크를 불러오는 중...</p>
            </div>
          ) : sortedActiveLinks.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-muted rounded-xl">
              <p className="text-sm text-muted-foreground">등록된 링크가 없습니다.</p>
            </div>
          ) : (
            sortedActiveLinks.map((link) => {
              const isHighlighted = link.isHighlighted;
              
              return (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block outline-none"
                >
                  <Card 
                    className={`group relative flex items-center w-full min-h-[72px] transition-transform duration-200 overflow-hidden rounded-xl border
                      hover:-translate-y-0.5 hover:shadow-md bg-card
                      ${isHighlighted ? 'animate-bounce-subtle border-primary/40 shadow-sm' : 'border-border shadow-sm'}
                    `}
                  >
                    {/* Shimmer effect inside highlighted card */}
                    {isHighlighted && (
                      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-80 w-[200%] animate-shimmer pointer-events-none" />
                    )}

                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                      {link.faviconUrl ? (
                        <img src={link.faviconUrl} alt={link.title} className="w-10 h-10 rounded-md object-contain shrink-0 bg-transparent p-0.5" />
                      ) : (
                        <div className="w-10 h-10 rounded-md bg-muted shrink-0" />
                      )}
                    </div>
                    
                    <div className="w-full text-center px-16">
                      <span className="font-medium text-foreground">{link.title}</span>
                    </div>
                  </Card>
                </a>
              )
            })
          )}
        </div>
        
        {/* Footer */}
        <div className="mt-12 text-center pb-8">
            <span className="text-[10px] font-semibold text-muted-foreground tracking-widest uppercase">Powered by MyLink</span>
        </div>
      </div>
    </div>
  )
}
