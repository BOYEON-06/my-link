import { Timestamp } from "firebase/firestore";

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
  
  // 타임스탬프 필드
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}
