import { fetchVideos, fetchVideoById } from './videoApi';
import { VideoServiceClient } from '../client/clients';

afterEach(() => {
  jest.resetAllMocks();
});

jest.mock('../client/clients', () => ({
  VideoServiceClient: {
    getVideosByDate: jest.fn(),
    getVideoById: jest.fn(),
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

const { getVideosByDate, getVideoById } = VideoServiceClient as jest.Mocked<typeof VideoServiceClient>;

describe('fetchVideos', () => {
  it('maps API response to Video objects', async () => {
    getVideosByDate.mockResolvedValue({ videos: [sampleVideoPb] });

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
    getVideoById.mockResolvedValue({ video: sampleVideoPb });

    const result = await fetchVideoById('id1');

    expect(getVideoById).toHaveBeenCalled();
    expect(result.id).toBe('id1');
    expect(result.author.username).toBe('Actor1, Actor2, Actor3');
    expect(result.description).toBe('Sample Title - Actor1, Actor2, Actor3, Actor4の作品');
  });
});
