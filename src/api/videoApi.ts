import { Video } from '../types';
import {VideoServiceClient} from '../client/clients';
import {
  GetVideosRequest,
  GetVideoByIdRequest,
  GetVideosResponse,
  GetVideoByIdResponse
} from '../generated/video_pb';

export const fetchVideos = async (date?: string): Promise<Video[]> => {
  const request = new GetVideosRequest();
  if (date) {
    request.date = date;
  } else {
    request.date = "";
  }
  const response = (await VideoServiceClient.getVideos(request)) as GetVideosResponse;
  // 生成されたレスポンスから直接 Video 型の配列を返す（サーバー側で directUrl を設定済み）
  return response.videos.map((videoPb: any) => ({
    id: videoPb.id,
    title: videoPb.title,
    description: videoPb.description,
    dmmVideoId: videoPb.dmmId,
    thumbnailUrl: videoPb.thumbnailUrl,
    createdAt: videoPb.createdAt,
    likesCount: videoPb.likesCount,
    sampleUrl: videoPb.sampleUrl,
    url: videoPb.url,
    directUrl: videoPb.directUrl, // サーバー側で設定された directUrl
    author: {
      id: videoPb.author?.id || '',
      username: videoPb.author?.username || '',
      avatarUrl: videoPb.author?.avatarUrl || '',
    }
  }));
};

export const fetchVideoById = async (id: string): Promise<Video> => {
  const request = new GetVideoByIdRequest();
  request.id = id;
  const response = (await VideoServiceClient.getVideoById(request)) as GetVideoByIdResponse;
  const videoPb = response.video;
  if (!videoPb) {
    throw new Error("動画が見つかりませんでした");
  }
  return {
    id: videoPb.id,
    title: videoPb.title,
    description: videoPb.description,
    dmmVideoId: videoPb.dmmId,
    thumbnailUrl: videoPb.thumbnailUrl,
    createdAt: videoPb.createdAt,
    likesCount: videoPb.likesCount,
    sampleUrl: videoPb.sampleUrl,
    url: videoPb.url,
    directUrl: videoPb.directUrl,
    author: {
      id: videoPb.author?.id || '',
      username: videoPb.author?.username || '',
      avatarUrl: videoPb.author?.avatarUrl || '',
    }
  };
};