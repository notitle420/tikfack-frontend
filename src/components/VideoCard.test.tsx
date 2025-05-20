import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

beforeAll(() => {
  Object.defineProperty(HTMLMediaElement.prototype, 'pause', {
    configurable: true,
    value: jest.fn(),
  });
  Object.defineProperty(HTMLMediaElement.prototype, 'play', {
    configurable: true,
    value: jest.fn().mockResolvedValue(undefined),
  });
});
import VideoCard from './VideoCard';
import { Video } from '../types';

const baseVideo: Video = {
  id: 'v1',
  dmmVideoId: 'v1',
  title: 'Test Video',
  directUrl: 'video.mp4',
  url: '',
  sampleUrl: '',
  thumbnailUrl: 'thumb.jpg',
  createdAt: '2024-01-01',
  price: 0,
  likesCount: 0,
  review: { count: 0, average: 0 },
  description: 'desc',
  author: { id: 'a1', username: 'actor', avatarUrl: 'avatar.jpg' },
  actresses: [],
  genres: [],
  makers: [],
  series: [],
  directors: [],
};

// helper render that avoids autoplay logic
const renderCard = (props?: Partial<{isVisible:boolean; isMuted:boolean}>) => {
  const {isVisible=false, isMuted=true} = props || {};
  return render(<VideoCard video={baseVideo} isVisible={isVisible} isMuted={isMuted} />);
};

describe('VideoCard component', () => {
  it('shows play overlay when not playing and directUrl exists', () => {
    const { container } = renderCard({ isVisible: false });
    expect(container.querySelector('.play-overlay')).toBeInTheDocument();
  });

  it('updates muted attribute when prop changes', () => {
    const { container, rerender } = renderCard({ isVisible: false, isMuted: true });
    const video = container.querySelector('video') as HTMLVideoElement;
    expect(video.muted).toBe(true);
    rerender(<VideoCard video={baseVideo} isVisible={false} isMuted={false} />);
    expect(video.muted).toBe(false);
  });

  it('seek buttons adjust currentTime', async () => {
    const user = userEvent;
    const { container } = renderCard({ isVisible: false });
    const video = container.querySelector('video') as HTMLVideoElement;
    video.currentTime = 20;
    await user.click(screen.getByText('« 10秒'));
    expect(video.currentTime).toBe(10);
    await user.click(screen.getByText('▶︎ 10秒'));
    expect(video.currentTime).toBe(20);
  });
});
