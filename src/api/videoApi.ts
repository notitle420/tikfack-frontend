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
  Director,
  GetVideosByKeywordRequest,
  GetVideosByKeywordResponse,
  GetVideosByIDRequest,
  GetVideosByIDResponse
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

export const fetchVideos = async (date?: string, hits: number = 20, offset: number = 1): Promise<Video[]> => {
  const request = new GetVideosByDateRequest();
  if (date) {
    request.date = date;
  } else {
    request.date = "";
  }
  request.hits = hits;
  request.offset = offset;
  
  // メソッド名をgetVideosByDateに変更
  const response = await VideoServiceClient.getVideosByDate(request) as GetVideosByDateResponse;
  
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
    review: videoPb.review || { count: 0, average: 0 },
    
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
  
  const response = await VideoServiceClient.getVideoById(request) as GetVideoByIdResponse;
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
    review: videoPb.review || { count: 0, average: 0 },
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

export const fetchVideosByKeyword = async (keyword: string, hits: number = 20, offset: number = 1): Promise<Video[]> => {
  const request = new GetVideosByKeywordRequest();
  request.keyword = keyword;
  request.hits = hits;
  request.offset = offset;

  const response = await VideoServiceClient.getVideosByKeyword(request) as GetVideosByKeywordResponse;

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
    review: videoPb.review || { count: 0, average: 0 },
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

export const fetchVideosByActressId = async (
  actressId: string,
  hits: number = 20,
  offset: number = 1
): Promise<Video[]> => {
  const request = new GetVideosByIDRequest();
  request.actressId.push(actressId);
  request.hits = hits;
  request.offset = offset;

  const response = await VideoServiceClient.getVideosByID(request) as GetVideosByIDResponse;

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
    review: videoPb.review || { count: 0, average: 0 },
    author: {
      id: videoPb.actresses && videoPb.actresses.length > 0 ? videoPb.actresses[0].id : "",
      username: getFirstThreeActressNames(videoPb.actresses),
      avatarUrl: "/avatars/default.jpg",
    },
    actresses: videoPb.actresses || [],
    genres: videoPb.genres || [],
    makers: videoPb.makers || [],
    series: videoPb.series || [],
    directors: videoPb.directors || [],
  }));
};
