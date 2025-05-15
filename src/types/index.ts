export interface Actress {
  id: string;
  name: string;
}

export interface Genre {
  id: string;
  name: string;
}

export interface Maker {
  id: string;
  name: string;
}

export interface Series {
  id: string;
  name: string;
}

export interface Director {
  id: string;
  name: string;
}

export interface Video {
  id: string;           // クライアント側での識別用 (dmmIdと同じ値)
  dmmVideoId: string;   // dmm_id フィールド
  title: string;
  directUrl: string;    // direct_url フィールド
  url: string;
  sampleUrl: string;    // sample_url フィールド
  thumbnailUrl: string; // thumbnail_url フィールド
  createdAt: string;    // created_at フィールド
  price: number;
  likesCount: number;   // likes_count フィールド
  
  // フロントエンド用の追加フィールド（protoにはないがUIで必要）
  description: string;  // UIでの表示用
  author: User;         // 女優情報をUser型として表示するための変換フィールド
  
  // protoにあるがオプショナルとして定義
  actresses?: Actress[];
  genres?: Genre[];
  makers?: Maker[];
  series?: Series[];
  directors?: Director[];
}

export interface User {
  id: string;
  username: string;
  avatarUrl: string;
}