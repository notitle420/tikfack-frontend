export interface Video {
  id: string;
  title: string;
  description: string;
  dmmVideoId?: string; // オプショナルに変更
  directUrl: string;   // 直接的なMP4のURL
  url?: string;
  thumbnailUrl: string;
  createdAt: string;
  likesCount: number;
  author: User;
  sampleUrl: string
}

export interface User {
  id: string;
  username: string;
  avatarUrl: string;
}