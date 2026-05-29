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
           <div className="h-28 w-24 rounded-3xl bg-muted mb-6 overflow-hidden shadow-xl border-4 border-background ring-1 ring-muted">
             <img 
               src={profile?.photoURL || `https://api.dicebear.com/9.x/notionists/svg?seed=${targetUid || username}`} 
               alt="Profile" 
               className="w-full h-full object-cover" 
             />
           </div>
           <h1 className="text-2xl font-black tracking-tight text-foreground">
             {profile?.displayName || "My Profile"}
           </h1>
           {profile?.bio && (
             <p className="text-sm font-medium text-muted-foreground mt-3 max-w-[280px]">
               {profile.bio}
             </p>
           )}
        </div>

        {/* Public Links List */}
        <div className="flex flex-col gap-4">
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
                className={`relative flex items-center w-full min-h-[72px] p-4 transition-all duration-300 rounded-2xl border-2 bg-card hover:scale-[1.02] active:scale-[0.98]
                  ${link.isHighlighted 
                    ? 'border-primary shadow-lg shadow-primary/10' 
                    : 'border-muted hover:border-primary/30'}
                `}
              >
                <div className="shrink-0 mr-4">
                  <div className="w-12 h-12 rounded-xl bg-muted/50 p-2.5 flex items-center justify-center border border-muted group-hover:bg-primary/5 transition-colors">
                    {link.faviconUrl ? (
                      <img src={link.faviconUrl} alt="" className="w-full h-full object-contain" />
                    ) : (
                      <LinkIcon className="h-5 w-5 text-muted-foreground opacity-50" />
                    )}
                  </div>
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="font-bold text-foreground text-lg group-hover:text-primary transition-colors">
                    {link.title}
                  </span>
                </div>
              </Card>
            </a>
          ))}
        </div>
        
        {/* Branding Footer */}
        <div className="mt-10 text-center pb-8">
            <a 
              href="/" 
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-foreground text-background font-black text-[11px] uppercase tracking-widest hover:opacity-90 transition-opacity"
            >
              <LinkIcon className="h-3.5 w-3.5" />
              Create your MyLink
            </a>
        </div>
      </div>
    </div>
  )
}
