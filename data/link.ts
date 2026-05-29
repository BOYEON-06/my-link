export interface Link {
  id: string;
  title: string;
  url: string;
  icon?: string;
  
  // PRD 기준 항목들 (LinkDocument 참조)
  faviconUrl: string;
  order: number;
  isActive: boolean;
  isHighlighted: boolean;
  clickCount: number;
}

export const dummyLinks: Link[] = [
  {
    id: "1",
    title: "인스타그램",
    url: "https://instagram.com/my_username",
    icon: "instagram",
    faviconUrl: "https://www.google.com/s2/favicons?domain=instagram.com&sz=64",
    order: 0,
    isActive: true,
    isHighlighted: false,
    clickCount: 150,
  },
  {
    id: "2",
    title: "유튜브",
    url: "https://youtube.com/@my_channel",
    icon: "youtube",
    faviconUrl: "https://www.google.com/s2/favicons?domain=youtube.com&sz=64",
    order: 1,
    isActive: true,
    isHighlighted: true,
    clickCount: 320,
  },
  {
    id: "3",
    title: "블로그",
    url: "https://myblog.com",
    faviconUrl: "https://www.google.com/s2/favicons?domain=myblog.com&sz=64",
    order: 2,
    isActive: true,
    isHighlighted: false,
    clickCount: 85,
  },
  {
    id: "4",
    title: "GitHub",
    url: "https://github.com/my_username",
    icon: "github",
    faviconUrl: "https://www.google.com/s2/favicons?domain=github.com&sz=64",
    order: 3,
    isActive: true,
    isHighlighted: false,
    clickCount: 210,
  },
  {
    id: "5",
    title: "포트폴리오",
    url: "https://my-portfolio.com",
    faviconUrl: "https://www.google.com/s2/favicons?domain=my-portfolio.com&sz=64",
    order: 4,
    isActive: false,
    isHighlighted: false,
    clickCount: 45,
  },
];
