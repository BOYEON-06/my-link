import { dummyLinks } from "@/data/link"
import { Card } from "@/components/ui/card"

export default function Page() {
  // 활성화된 링크만 필터링하고 order 순으로 정렬
  const sortedActiveLinks = dummyLinks
    .filter((link) => link.isActive)
    .sort((a, b) => a.order - b.order)

  return (
    <div className="flex min-h-svh flex-col items-center bg-background px-6 py-16">
      <div className="w-full max-w-md flex flex-col gap-6">
        
        {/* Profile Section */}
        <div className="mb-6 flex flex-col items-center">
           <div className="h-24 w-24 rounded-full bg-muted mb-4 overflow-hidden shadow-sm flex items-center justify-center p-0.5 border border-border">
             <img src="https://api.dicebear.com/9.x/notionists/svg?seed=my_username" alt="Profile" className="w-full h-full object-cover rounded-full" />
           </div>
           <h1 className="text-xl font-bold font-sans text-foreground">@my_username</h1>
           <p className="text-sm font-medium text-muted-foreground mt-2">
             Welcome to my link tree!
           </p>
        </div>

        {/* Links Section */}
        <div className="flex flex-col gap-4">
          {sortedActiveLinks.map((link) => {
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
          })}
        </div>
        
        {/* Footer */}
        <div className="mt-12 text-center pb-8">
            <span className="text-[10px] font-semibold text-muted-foreground tracking-widest uppercase">Powered by MyLink</span>
        </div>
      </div>
    </div>
  )
}
