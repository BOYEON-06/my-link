"use client"

import { auth, db } from "@/lib/firebase"
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  User 
} from "firebase/auth"
import { collection, query, onSnapshot } from "firebase/firestore"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu"
import { 
  LogOut, 
  User as UserIcon, 
  Link as LinkIcon, 
  ExternalLink, 
  Copy, 
  Moon, 
  Sun, 
  BarChart3,
  Settings
} from "lucide-react"
import { useTheme } from "next-themes"

export function Header() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [totalClicks, setTotalClicks] = useState(0)
  const { setTheme, theme } = useTheme()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  // 유저의 전체 클릭 수 합계 추적
  useEffect(() => {
    if (!user) return

    const q = query(collection(db, "users", user.uid, "links"))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let clicks = 0
      snapshot.forEach((doc) => {
        clicks += doc.data().clickCount || 0
      })
      setTotalClicks(clicks)
    })
    return () => unsubscribe()
  }, [user])

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider()
    try {
      await signInWithPopup(auth, provider)
    } catch (error) {
      console.error("Login Error:", error)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error("Logout Error:", error)
    }
  }

  const getUsername = () => user?.email?.split('@')[0] || user?.uid
  const getPublicUrl = () => `/${getUsername()}/mylink-folder`

  const copyProfileLink = () => {
    if (!user) return
    const url = `${window.location.origin}${getPublicUrl()}`
    navigator.clipboard.writeText(url)
    alert("프로필 링크가 복사되었습니다!")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 max-w-5xl">
        <div className="flex items-center gap-2">
          <div className="bg-primary p-1.5 rounded-lg">
            <LinkIcon className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight">MyLink</span>
        </div>

        <div className="flex items-center gap-4">
          {!loading && (
            user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full ring-offset-background transition-all hover:ring-2 hover:ring-primary/20">
                    <Avatar className="h-9 w-9 border">
                      <AvatarImage src={user.photoURL || ""} alt={user.displayName || "User"} />
                      <AvatarFallback><UserIcon className="h-5 w-5" /></AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-bold leading-none">{user.displayName}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="px-2 py-1.5 flex items-center justify-between text-xs text-muted-foreground font-bold uppercase tracking-widest">
                    <div className="flex items-center gap-1.5">
                      <BarChart3 className="h-3 w-3" />
                      Total Clicks
                    </div>
                    <span className="text-primary">{totalClicks.toLocaleString()}</span>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => window.open(getPublicUrl(), '_blank')}>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    <span>나의 프로필 보기</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={copyProfileLink}>
                    <Copy className="mr-2 h-4 w-4" />
                    <span>링크 복사하기</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                    {theme === "dark" ? (
                      <Sun className="mr-2 h-4 w-4" />
                    ) : (
                      <Moon className="mr-2 h-4 w-4" />
                    )}
                    <span>{theme === "dark" ? "라이트 모드로 변경" : "다크 모드로 변경"}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>설정</span>
                    <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:bg-destructive focus:text-destructive-foreground font-bold">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>로그아웃</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={handleLogin} variant="default" className="rounded-full px-6 font-bold shadow-md shadow-primary/20">
                시작하기
              </Button>
            )
          )}
        </div>
      </div>
    </header>
  )
}
