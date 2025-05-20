import { fetchVideos, fetchVideoById, fetchVideosByKeyword } from './videoApi';
import { VideoServiceClient } from '../client/clients';

afterEach(() => {
  jest.resetAllMocks();
});

jest.mock('../client/clients', () => ({
  VideoServiceClient: {
    getVideosByDate: jest.fn(),
    getVideoById: jest.fn(),
    getVideosByKeyword: jest.fn(),
  }
}));

const sampleVideoPb = {
  dmmId: 'id1',
  title: 'Sample Title',
  directUrl: 'direct.mp4',
  url: 'page.html',
  sampleUrl: 'sample.mp4',
  thumbnailUrl: 'thumb.jpg',
  createdAt: '2023-01-01',
  price: 100,
  likesCount: 5,
  review: { count: 1, average: 5 },
  actresses: [
    { id: 'a1', name: 'Actor1' },
    { id: 'a2', name: 'Actor2' },
    { id: 'a3', name: 'Actor3' },
    { id: 'a4', name: 'Actor4' },
  ],
  genres: [],
  makers: [],
  series: [],
  directors: [],
};

const { getVideosByDate, getVideoById, getVideosByKeyword } =
  VideoServiceClient as jest.Mocked<typeof VideoServiceClient>;

describe('fetchVideos', () => {
  it('maps API response to Video objects', async () => {
    getVideosByDate.mockResolvedValue({ videos: [sampleVideoPb] } as any);

    const result = await fetchVideos('20230101');

    expect(getVideosByDate).toHaveBeenCalled();
    expect(result).toHaveLength(1);
    const video = result[0];
    expect(video.id).toBe('id1');
    expect(video.author.username).toBe('Actor1, Actor2, Actor3');
    expect(video.description).toBe('Sample Title');
  });
});

describe('fetchVideoById', () => {
  it('maps single video response correctly', async () => {
    getVideoById.mockResolvedValue({ video: sampleVideoPb } as any);

    const result = await fetchVideoById('id1');

    expect(getVideoById).toHaveBeenCalled();
    expect(result.id).toBe('id1');
    expect(result.author.username).toBe('Actor1, Actor2, Actor3');
    expect(result.description).toBe('Sample Title - Actor1, Actor2, Actor3, Actor4の作品');
  });

  it('throws error when response has no video', async () => {
    getVideoById.mockResolvedValue({} as any);
    await expect(fetchVideoById('id1')).rejects.toThrow('動画が見つかりませんでした');
  });

  it('uses fallback values when optional fields are missing', async () => {
    const noData = { ...sampleVideoPb, review: undefined, actresses: [] as any[] };
    getVideoById.mockResolvedValue({ video: noData } as any);
    const result = await fetchVideoById('id1');
    expect(result.review).toEqual({ count: 0, average: 0 });
    expect(result.author.username).toBe('不明な女優');
    expect(result.description).toBe('Sample Title - 不明な女優の作品');
  });
});

describe('fetchVideosByKeyword', () => {
  it('fetches videos by keyword', async () => {
    getVideosByKeyword.mockResolvedValue({ videos: [sampleVideoPb] } as any);
    const result = await fetchVideosByKeyword('search');
    expect(getVideosByKeyword).toHaveBeenCalled();
    expect(result).toHaveLength(1);
    expect(result[0].author.username).toBe('Actor1, Actor2, Actor3');
  });
});
