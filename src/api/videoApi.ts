import { Video } from '../types';
import {VideoServiceClient} from '../client/clients';
import {
  GetVideosByDateRequest,
  GetVideoByIdRequest,
  GetVideosByDateResponse,
  GetVideoByIdResponse,
  Actress,
  Genre,
  Maker,
  Series,
  Director
} from '../generated/proto/video/video_pb';
import { SearchVideosRequest } from '../generated/proto/video/video_pb';

// 最初の3人の女優名をカンマ区切りで結合するヘルパー関数
const getFirstThreeActressNames = (actresses: Actress[] | undefined): string => {
  if (!actresses || actresses.length === 0) return "不明な女優";
  
  // 最大3人までの女優名を取得
  const maxCount = 3;
  const displayCount = Math.min(actresses.length, maxCount);
  const names = actresses.slice(0, displayCount).map(a => a.name);
  
  return names.join(', ');
};

export const fetchVideos = async (date?: string): Promise<Video[]> => {
  const request = new GetVideosByDateRequest();
  if (date) {
    request.date = date;
  } else {
    request.date = "";
  }
  
  // メソッド名をgetVideosByDateに変更
  const response = await VideoServiceClient.getVideosByDate(request);
  
  // 新しいproto定義に基づいてVideo型に変換
  return response.videos.map((videoPb: any) => ({
    // 基本情報
    id: videoPb.dmmId,
    dmmVideoId: videoPb.dmmId,
    title: videoPb.title,
    directUrl: videoPb.directUrl,
    url: videoPb.url,
    sampleUrl: videoPb.sampleUrl,
    thumbnailUrl: videoPb.thumbnailUrl,
    createdAt: videoPb.createdAt,
    price: videoPb.price || 0,
    likesCount: videoPb.likesCount,
    
    // UI表示用の追加フィールド
    description: videoPb.title, // タイトルを説明として使用
    
    // 最初の3人の女優を著者として扱う
    author: {
      id: videoPb.actresses && videoPb.actresses.length > 0 ? videoPb.actresses[0].id : "",
      username: getFirstThreeActressNames(videoPb.actresses),
      avatarUrl: "/avatars/default.jpg" // デフォルトのアバター
    },
    
    // protoから直接対応するフィールド
    actresses: videoPb.actresses || [],
    genres: videoPb.genres || [],
    makers: videoPb.makers || [],
    series: videoPb.series || [],
    directors: videoPb.directors || []
  }));
};

export const fetchVideoById = async (id: string): Promise<Video> => {
  const request = new GetVideoByIdRequest();
  // 正しいフィールド名でセット
  request.dmmId = id;
  
  const response = await VideoServiceClient.getVideoById(request);
  const videoPb = response.video;
  if (!videoPb) {
    throw new Error("動画が見つかりませんでした");
  }
  
  return {
    // 基本情報
    id: videoPb.dmmId,
    dmmVideoId: videoPb.dmmId,
    title: videoPb.title,
    directUrl: videoPb.directUrl,
    url: videoPb.url,
    sampleUrl: videoPb.sampleUrl,
    thumbnailUrl: videoPb.thumbnailUrl,
    createdAt: videoPb.createdAt,
    price: videoPb.price || 0,
    likesCount: videoPb.likesCount,
    
    // UI表示用の追加フィールド
    description: `${videoPb.title} - ${videoPb.actresses && videoPb.actresses.length > 0 
      ? videoPb.actresses.map(a => a.name).join(', ') 
      : '不明な女優'}の作品`,
    
    // 最初の3人の女優を著者として扱う
    author: {
      id: videoPb.actresses && videoPb.actresses.length > 0 ? videoPb.actresses[0].id : "",
      username: getFirstThreeActressNames(videoPb.actresses),
      avatarUrl: "/avatars/default.jpg" // デフォルトのアバター
    },
    
    // protoから直接対応するフィールド
    actresses: videoPb.actresses || [],
    genres: videoPb.genres || [],
    makers: videoPb.makers || [],
    series: videoPb.series || [],
    directors: videoPb.directors || []
  };
};

export const fetchVideosByKeyword = async (keyword: string): Promise<Video[]> => {
  const request = new SearchVideosRequest();
  request.keyword = keyword;

  const response = await VideoServiceClient.searchVideos(request);

  return response.videos.map((videoPb: any) => ({
    id: videoPb.dmmId,
    dmmVideoId: videoPb.dmmId,
    title: videoPb.title,
    directUrl: videoPb.directUrl,
    url: videoPb.url,
    sampleUrl: videoPb.sampleUrl,
    thumbnailUrl: videoPb.thumbnailUrl,
    createdAt: videoPb.createdAt,
    price: videoPb.price || 0,
    likesCount: videoPb.likesCount,
    description: videoPb.title,
    author: {
      id: videoPb.actresses && videoPb.actresses.length > 0 ? videoPb.actresses[0].id : "",
      username: getFirstThreeActressNames(videoPb.actresses),
      avatarUrl: "/avatars/default.jpg"
    },
    actresses: videoPb.actresses || [],
    genres: videoPb.genres || [],
    makers: videoPb.makers || [],
    series: videoPb.series || [],
    directors: videoPb.directors || []
  }));
};
