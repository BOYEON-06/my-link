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
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Loader2, Pencil, Trash2, X, Check, LogIn, Link as LinkIcon } from "lucide-react"
import { db, auth } from "@/lib/firebase"
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot,
  Timestamp,
  doc,
  updateDoc,
  deleteDoc,
  setDoc,
  getDoc
} from "firebase/firestore"
import { onAuthStateChanged, User, signInWithPopup as firebaseSignInWithPopup, GoogleAuthProvider as FirebaseGoogleAuthProvider } from "firebase/auth"

export default function Page() {
  const [user, setUser] = useState<User | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [links, setLinks] = useState<Link[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [username, setUsername] = useState<string | null>(null)
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  
  // 추가 폼 상태
  const [newTitle, setNewTitle] = useState("")
  const [newUrl, setNewUrl] = useState("")
  const [errors, setErrors] = useState<{ title?: string; url?: string }>({})

  // 수정 상태 관리
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [editUrl, setEditUrl] = useState("")
  const [editErrors, setEditErrors] = useState<{ title?: string; url?: string }>({})

  // 삭제 확인 모달 상태
  const [deletingLink, setDeletingLink] = useState<Link | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Auth 상태 모니터링
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser)
      if (currentUser) {
        // 구글 이메일에서 username 추출 (예: grace15379@gmail.com -> grace15379)
        const extractedUsername = currentUser.email?.split('@')[0] || "user"
        setUsername(extractedUsername)

        // Firestore에 사용자 정보 저장/업데이트 (프로필 정보 동기화)
        const userRef = doc(db, "users", currentUser.uid)
        await setDoc(userRef, {
          username: extractedUsername,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL,
          email: currentUser.email,
          updatedAt: Timestamp.now()
        }, { merge: true })
      }
      setAuthLoading(false)
    })
    return () => unsubscribe()
  }, [])

  // Firestore에서 실시간으로 링크 목록 불러오기 (개인화된 경로 사용)
  useEffect(() => {
    if (!user) {
      setLinks([])
      setIsLoading(false)
      return
    }

    const q = query(
      collection(db, "users", user.uid, "links"),
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
  }, [user])

  const handleLogin = async () => {
    if (isLoggingIn) return
    
    setIsLoggingIn(true)
    const provider = new FirebaseGoogleAuthProvider()
    try {
      await firebaseSignInWithPopup(auth, provider)
    } catch (error: any) {
      if (error.code !== "auth/popup-closed-by-user" && error.code !== "auth/cancelled-popup-request") {
        console.error("Login Error:", error)
      }
    } finally {
      setIsLoggingIn(false)
    }
  }

  const resetForm = () => {
    setNewTitle("")
    setNewUrl("")
    setErrors({})
  }

  const handleOpenChange = (open: boolean) => {
    setIsDialogOpen(open)
    if (!open) resetForm()
  }

  const validateUrl = (url: string) => {
    if (!url.trim()) return "URL을 입력해주세요."
    let targetUrl = url.trim()
    if (!/^https?:\/\//i.test(targetUrl)) targetUrl = "https://" + targetUrl
    
    // 경로에 @가 포함된 URL(예: velog.io/@username)도 허용하도록 정규식 수정
    const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-@?=&]*)*\/?$/
    
    if (!urlPattern.test(targetUrl)) return "올바른 URL 형식이 아닙니다 (예: velog.io/@username)."
    try {
      new URL(targetUrl)
      return null
    } catch {
      return "유효한 URL이 아닙니다."
    }
  }

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    const newErrors: { title?: string; url?: string } = {}
    if (!newTitle.trim()) newErrors.title = "타이틀을 입력해주세요."
    else if (newTitle.trim().length > 40) newErrors.title = "타이틀은 40자를 넘을 수 없습니다."
    const urlError = validateUrl(newUrl)
    if (urlError) newErrors.url = urlError

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      let finalUrl = newUrl.trim()
      if (!/^https?:\/\//i.test(finalUrl)) finalUrl = "https://" + finalUrl
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
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      }

      await addDoc(collection(db, "users", user.uid, "links"), newLinkData)
      resetForm()
      setIsDialogOpen(false)
    } catch(err) {
      console.error("Error adding link: ", err)
      setErrors({ url: "링크 저장 중 오류가 발생했습니다." })
    }
  }

  const startEditing = (link: Link) => {
    setEditingId(link.id)
    setEditTitle(link.title)
    setEditUrl(link.url)
    setEditErrors({})
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditTitle("")
    setEditUrl("")
    setEditErrors({})
  }

  const handleUpdateLink = async (id: string) => {
    if (!user) return
    const errors: { title?: string; url?: string } = {}
    if (!editTitle.trim()) errors.title = "타이틀을 입력해주세요."
    else if (editTitle.trim().length > 40) errors.title = "타이틀은 40자를 넘을 수 없습니다."
    const urlError = validateUrl(editUrl)
    if (urlError) errors.url = urlError

    if (Object.keys(errors).length > 0) {
      setEditErrors(errors)
      return
    }

    try {
      let finalUrl = editUrl.trim()
      if (!/^https?:\/\//i.test(finalUrl)) finalUrl = "https://" + finalUrl
      const domain = new URL(finalUrl).hostname
      const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`
      
      const linkRef = doc(db, "users", user.uid, "links", id)
      await updateDoc(linkRef, {
        title: editTitle.trim(),
        url: finalUrl,
        faviconUrl: faviconUrl,
        updatedAt: Timestamp.now()
      })
      setEditingId(null)
    } catch (err) {
      console.error("Error updating link: ", err)
      setEditErrors({ url: "수정 중 오류가 발생했습니다." })
    }
  }

  const handleDeleteLink = async () => {
    if (!user || !deletingLink) return
    setIsDeleting(true)
    try {
      await deleteDoc(doc(db, "users", user.uid, "links", deletingLink.id))
      setDeletingLink(null)
    } catch (err) {
      console.error("Error deleting link: ", err)
    } finally {
      setIsDeleting(false)
    }
  }

  if (authLoading) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary opacity-50" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center bg-background px-6 py-16 text-center">
        <div className="max-w-md w-full flex flex-col items-center gap-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl whitespace-nowrap">
              모든 링크를 <span className="text-primary">하나의 페이지</span>에
            </h1>
            <p className="text-lg text-muted-foreground font-medium">
              나만의 프로필 페이지를 만들고 전 세계와 공유하세요. 무료로 시작할 수 있습니다.
            </p>
          </div>
          
          <Card className="p-8 w-full border-none shadow-2xl shadow-primary/20 bg-primary/5 ring-1 ring-primary/20">
            <div className="flex flex-col items-center gap-6">
              <div className="p-5 bg-primary rounded-full text-primary-foreground shadow-lg shadow-primary/40">
                <LogIn className="h-10 w-10 stroke-[3px]" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black tracking-tight">지금 바로 시작하세요</h3>
                <p className="text-sm text-muted-foreground font-medium">
                  링크를 관리하고 프로필을 편집하려면 구글 로그인이 필요합니다.
                </p>
              </div>
              <Button onClick={handleLogin} size="lg" className="w-full rounded-2xl py-8 text-xl font-black shadow-xl shadow-primary/40 bg-primary text-primary-foreground hover:scale-105 transition-all border-none">
                구글로 로그인하기
              </Button>
            </div>
          </Card>
          
          <div className="grid grid-cols-2 gap-4 w-full text-left">
            <div className="p-5 rounded-2xl bg-card border-2 border-primary/10 shadow-sm">
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Easy Setup</span>
              <p className="mt-2 font-bold leading-tight">30초면 완성하는<br/>나만의 프로필</p>
            </div>
            <div className="p-5 rounded-2xl bg-card border-2 border-primary/10 shadow-sm">
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Real-time</span>
              <p className="mt-2 font-bold leading-tight">실시간으로 반영되는<br/>미리보기</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const publicUrl = username ? `/${username}/mylink-folder` : null

  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col items-center bg-background px-6 py-12">
      <div className="w-full max-w-md flex flex-col gap-8">
        
        {/* Profile Section */}
        <div className="flex flex-col items-center">
           <div className="h-24 w-24 rounded-full bg-primary/10 mb-4 overflow-hidden shadow-xl shadow-primary/20 flex items-center justify-center p-1 border-2 border-primary ring-4 ring-primary/10">
             <img src={user.photoURL || `https://api.dicebear.com/9.x/notionists/svg?seed=${user.uid}`} alt="Profile" className="w-full h-full object-cover rounded-full" />
           </div>
           <h1 className="text-2xl font-black tracking-tight text-foreground">{user.displayName || "@user"}</h1>
           
           {publicUrl && (
             <a 
               href={publicUrl} 
               target="_blank" 
               className="text-[11px] font-black text-primary-foreground mt-4 hover:scale-105 transition-transform flex items-center gap-1.5 bg-primary px-5 py-2 rounded-full shadow-lg shadow-primary/30"
             >
               <LinkIcon className="h-3 w-3" />
               MYLINK.COM{publicUrl.toUpperCase()}
             </a>
           )}
        </div>

        {/* Add Link Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
          <DialogTrigger
            render={
              <Button size="lg" className="w-full rounded-2xl py-8 text-lg font-black shadow-xl shadow-primary/20 hover:scale-[1.01] transition-all bg-primary text-primary-foreground border-none">
                <Plus className="mr-2 h-6 w-6 stroke-[3px]" /> 새 링크 추가하기
              </Button>
            }
          />
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>새 링크 추가</DialogTitle>
              <DialogDescription>나만의 멋진 링크를 리스트에 추가해 보세요.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddLink} className="flex flex-col gap-6 py-4" noValidate>
              <div className="grid gap-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="title" className="font-bold">타이틀</Label>
                  <span className={`text-[10px] font-bold ${newTitle.length > 40 ? "text-red-500" : "text-muted-foreground"}`}>
                    {newTitle.length}/40
                  </span>
                </div>
                <Input 
                  id="title" 
                  placeholder="예: 내 인스타그램, 포트폴리오" 
                  value={newTitle}
                  onChange={(e) => {
                    setNewTitle(e.target.value)
                    if (errors.title) setErrors(prev => ({ ...prev, title: undefined }))
                  }}
                  autoComplete="off"
                  className={`h-12 rounded-xl border-2 focus-visible:ring-primary ${errors.title ? "border-red-500" : "border-muted"}`}
                />
                {errors.title && <p className="text-xs font-bold text-red-500 ml-1">{errors.title}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="url" className="font-bold">URL</Label>
                <Input 
                  id="url" 
                  placeholder="velog.io/@username" 
                  value={newUrl}
                  onChange={(e) => {
                    setNewUrl(e.target.value)
                    if (errors.url) setErrors(prev => ({ ...prev, url: undefined }))
                  }}
                  autoComplete="off"
                  className={`h-12 rounded-xl border-2 focus-visible:ring-primary ${errors.url ? "border-red-500" : "border-muted"}`}
                />
                {errors.url && <p className="text-xs font-bold text-red-500 ml-1">{errors.url}</p>}
              </div>
              <DialogFooter>
                <Button type="submit" className="w-full rounded-xl py-6 font-bold text-lg">
                  링크 저장하기
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Links Section */}
        <div className="flex flex-col gap-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <Loader2 className="h-10 w-10 animate-spin mb-4 opacity-50" />
              <p className="text-sm font-bold">나의 링크 목록을 가져오고 있습니다...</p>
            </div>
          ) : links.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed border-muted rounded-3xl bg-muted/10">
              <p className="text-sm font-bold text-muted-foreground">아직 등록된 링크가 없네요.<br/>위 버튼을 눌러 첫 링크를 만들어보세요!</p>
            </div>
          ) : (
            links.map((link) => {
              const isEditing = editingId === link.id;
              
              return (
                <div key={link.id} className="relative group">
                  <Card 
                    className={`flex items-center w-full min-h-[80px] transition-all duration-300 overflow-hidden rounded-2xl border-2 bg-card
                      ${link.isHighlighted ? 'border-primary shadow-xl shadow-primary/10' : 'border-muted hover:border-primary/30'}
                      ${isEditing ? 'ring-4 ring-primary/20 border-primary' : ''}
                    `}
                  >
                    {isEditing ? (
                      /* Inline Editing UI */
                      <div className="flex flex-col w-full p-5 gap-4 animate-in fade-in zoom-in-95 duration-200">
                        <div className="grid gap-2">
                          <Input 
                            size={1}
                            placeholder="타이틀" 
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className={`h-10 rounded-lg ${editErrors.title ? "border-red-500" : "border-muted"}`}
                          />
                          {editErrors.title && <p className="text-[10px] text-red-500 font-bold ml-1">{editErrors.title}</p>}
                        </div>
                        <div className="grid gap-2">
                          <Input 
                            size={1}
                            placeholder="URL" 
                            value={editUrl}
                            onChange={(e) => setEditUrl(e.target.value)}
                            className={`h-10 rounded-lg ${editErrors.url ? "border-red-500" : ""}`}
                          />
                          {editErrors.url && <p className="text-[10px] text-red-500 font-bold ml-1">{editErrors.url}</p>}
                        </div>
                        <div className="flex justify-end gap-3 pt-1">
                          <Button size="sm" variant="ghost" onClick={cancelEditing} className="h-9 px-4 rounded-lg font-bold">
                            <X className="h-4 w-4 mr-2" /> 취소
                          </Button>
                          <Button size="sm" onClick={() => handleUpdateLink(link.id)} className="h-9 px-4 rounded-lg font-bold">
                            <Check className="h-4 w-4 mr-2" /> 저장
                          </Button>
                        </div>
                      </div>
                    ) : (
                      /* Standard Link Display UI */
                      <div className="flex items-center w-full pr-24 pl-5 py-4">
                        <div className="shrink-0 mr-4">
                          <div className="w-12 h-12 rounded-xl bg-muted/50 p-2 flex items-center justify-center border border-muted shadow-inner">
                            {link.faviconUrl ? (
                              <img src={link.faviconUrl} alt={link.title} className="w-8 h-8 object-contain" />
                            ) : (
                              <LinkIcon className="h-6 w-6 text-muted-foreground opacity-40" />
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col min-w-0 flex-1">
                          <span className="font-bold text-foreground text-lg truncate pr-2">{link.title}</span>
                          <span className="text-xs text-muted-foreground truncate font-medium opacity-70">{link.url.replace(/^https?:\/\//i, '')}</span>
                        </div>

                        {/* Action Buttons */}
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                          <Button 
                            variant="secondary" 
                            size="icon" 
                            onClick={() => startEditing(link)}
                            className="h-10 w-10 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/10 border-transparent hover:border-primary/20 transition-all"
                            title="수정"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="secondary" 
                            size="icon" 
                            onClick={() => setDeletingLink(link)}
                            className="h-10 w-10 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 border-transparent hover:border-destructive/20 transition-all"
                            title="삭제"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </Card>
                </div>
              )
            })
          )}
        </div>

        {/* Delete Confirmation Modal */}
        <Dialog open={!!deletingLink} onOpenChange={(open) => !open && setDeletingLink(null)}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>링크 삭제</DialogTitle>
              <DialogDescription className="font-medium pt-2">
                정말로 <span className="text-foreground font-bold underline decoration-destructive/30 decoration-4">"{deletingLink?.title}"</span> 링크를 삭제하시겠습니까?<br/>이 작업은 절대로 되돌릴 수 없습니다.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-4 gap-3 sm:gap-0">
              <Button variant="ghost" onClick={() => setDeletingLink(null)} disabled={isDeleting} className="rounded-xl font-bold">
                아니요, 유지할게요
              </Button>
              <Button variant="destructive" onClick={handleDeleteLink} disabled={isDeleting} className="rounded-xl font-bold px-6">
                {isDeleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                네, 삭제할게요
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Footer */}
        <div className="mt-16 text-center pb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-muted/50 border border-muted mb-4">
              <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Live Personal Dashboard</span>
            </div>
            <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">Powered by MyLink System</p>
        </div>
      </div>
    </div>
  )
}
