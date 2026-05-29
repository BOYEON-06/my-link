"use client"

import React, { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { db } from "@/lib/firebase"
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  doc, 
  getDoc,
  updateDoc,
  increment,
  where,
  getDocs
} from "firebase/firestore"
import { Link } from "@/data/link"
import { Card } from "@/components/ui/card"
import { Loader2, Link as LinkIcon, AlertCircle } from "lucide-react"

interface UserProfile {
  displayName?: string
  photoURL?: string
  bio?: string
}

export default function PublicProfilePage() {
  const params = useParams()
  const username = params.username as string
  
  const [links, setLinks] = useState<Link[]>([])
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [targetUid, setTargetUid] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!username) return

    const resolveUsername = async () => {
      try {
        // 1. username 필드가 일치하는 사용자 찾기
        const usersRef = collection(db, "users")
        const q = query(usersRef, where("username", "==", username))
        const querySnapshot = await getDocs(q)
        
        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0]
          const uid = userDoc.id
          setTargetUid(uid)
          setProfile(userDoc.data() as UserProfile)

          // 2. 해당 사용자의 링크 목록 실시간 감시
          const linksQ = query(
            collection(db, "users", uid, "links"),
            orderBy("createdAt", "desc")
          )

          const unsubscribe = onSnapshot(linksQ, (snapshot) => {
            const linksData: Link[] = []
            snapshot.forEach((doc) => {
              linksData.push({ id: doc.id, ...doc.data() } as Link)
            })
            setLinks(linksData.filter(l => l.isActive !== false))
            setLoading(false)
          }, (err) => {
            console.error("Error fetching links:", err)
            setError(true)
            setLoading(false)
          })

          return unsubscribe
        } else {
          setError(true)
          setLoading(false)
        }
      } catch (err) {
        console.error("Error resolving username:", err)
        setError(true)
        setLoading(false)
      }
    }

    let unsubscribe: (() => void) | undefined
    resolveUsername().then(unsub => {
      if (unsub) unsubscribe = unsub
    })

    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [username])

  const handleLinkClick = async (linkId: string) => {
    if (!targetUid) return
    try {
      const linkRef = doc(db, "users", targetUid, "links", linkId)
      await updateDoc(linkRef, {
        clickCount: increment(1)
      })
    } catch (err) {
      console.error("Error updating click count:", err)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary opacity-50" />
      </div>
    )
  }

  if (error || (links.length === 0 && !profile)) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center bg-background px-6 text-center">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h1 className="text-xl font-bold">프로필을 찾을 수 없습니다</h1>
        <p className="text-muted-foreground mt-2 text-sm">올바른 주소인지 확인해 주세요.</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-svh flex-col items-center bg-background px-6 py-20">
      <div className="w-full max-w-md flex flex-col gap-10">
        
        {/* Public Header */}
        <div className="flex flex-col items-center text-center">
           <div className="h-32 w-32 rounded-full bg-primary/10 mb-8 overflow-hidden shadow-2xl shadow-primary/20 p-1.5 border-4 border-primary ring-8 ring-primary/5">
             <img 
               src={profile?.photoURL || `https://api.dicebear.com/9.x/notionists/svg?seed=${targetUid || username}`} 
               alt="Profile" 
               className="w-full h-full object-cover rounded-full" 
             />
           </div>
           <h1 className="text-3xl font-black tracking-tighter text-foreground">
             {profile?.displayName || "My Profile"}
           </h1>
           {profile?.bio && (
             <p className="text-sm font-semibold text-muted-foreground mt-4 max-w-[280px] leading-relaxed">
               {profile.bio}
             </p>
           )}
        </div>

        {/* Public Links List */}
        <div className="flex flex-col gap-5">
          {links.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleLinkClick(link.id)}
              className="block outline-none group"
            >
              <Card 
                className={`relative flex flex-col items-center justify-center w-full min-h-[140px] p-6 transition-all duration-500 rounded-3xl border-2 bg-card hover:translate-y-[-4px] active:scale-[0.98]
                  ${link.isHighlighted 
                    ? 'border-primary shadow-xl shadow-primary/20 bg-primary/5' 
                    : 'border-muted hover:border-primary/50 shadow-sm hover:shadow-xl hover:shadow-primary/5'}
                `}
              >
                <div className="w-14 h-14 rounded-2xl bg-white dark:bg-muted/30 p-3 flex items-center justify-center border border-muted group-hover:border-primary/30 shadow-inner transition-colors mb-3">
                  {link.faviconUrl ? (
                    <img src={link.faviconUrl} alt="" className="w-full h-full object-contain" />
                  ) : (
                    <LinkIcon className="h-6 w-6 text-primary opacity-40" />
                  )}
                </div>
                <div className="text-center w-full">
                  <span className="font-black text-foreground text-lg group-hover:text-primary transition-colors tracking-tight">
                    {link.title}
                  </span>
                </div>
                <div className="absolute right-6 top-6 opacity-0 group-hover:opacity-100 transition-all duration-300">
                   <div className="h-2 w-2 rounded-full bg-primary animate-ping" />
                </div>
              </Card>
            </a>
          ))}
        </div>
        
        {/* Branding Footer */}
        <div className="mt-12 text-center pb-12">
            <a 
              href="/" 
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-black text-[12px] uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-xl shadow-primary/20"
            >
              <LinkIcon className="h-4 w-4 stroke-[3px]" />
              Create your MyLink
            </a>
        </div>
      </div>
    </div>
  )
}
