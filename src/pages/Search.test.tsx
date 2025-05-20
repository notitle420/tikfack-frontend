import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Search from './Search';
import { fetchVideosByKeyword } from '../api/videoApi';
import { Video } from '../types';

jest.mock('../api/videoApi');

jest.mock('../components/VideoCard', () => ({ video }: { video: any }) => (
  <div data-testid="video-card">{video.title}</div>
));

const mockedFetch = fetchVideosByKeyword as jest.MockedFunction<typeof fetchVideosByKeyword>;

const sampleVideo: Video = {
  id: 'id1',
  dmmVideoId: 'id1',
  title: 'Video1',
  directUrl: 'direct.mp4',
  url: 'page.html',
  sampleUrl: 'sample.mp4',
  thumbnailUrl: 'thumb.jpg',
  createdAt: '2023-01-01',
  price: 0,
  likesCount: 0,
  review: { count: 0, average: 0 },
  description: 'desc',
  author: { id: 'a1', username: 'author', avatarUrl: '' },
  actresses: [],
  genres: [],
  makers: [],
  series: [],
  directors: [],
};

afterEach(() => {
  jest.resetAllMocks();
});

describe('Search page', () => {
  it('calls fetchVideosByKeyword and displays results', async () => {
    mockedFetch.mockResolvedValue([sampleVideo]);

    render(<Search />);

    fireEvent.change(screen.getByPlaceholderText('キーワード検索'), {
      target: { value: 'test' },
    });
    fireEvent.click(screen.getByText('検索'));

    await waitFor(() => {
      expect(mockedFetch).toHaveBeenCalledWith('test', 20, 1);
    });

    expect(await screen.findByTestId('video-card')).toHaveTextContent('Video1');
  });

  it('shows error message when search fails', async () => {
    mockedFetch.mockRejectedValue(new Error('fail'));

    render(<Search />);

    fireEvent.change(screen.getByPlaceholderText('キーワード検索'), {
      target: { value: 'err' },
    });
    fireEvent.click(screen.getByText('検索'));

    const error = await screen.findByText('検索に失敗しました');
    expect(error).toBeInTheDocument();
  });

  it('unmutes when button is clicked', () => {
    render(<Search />);

    const button = screen.getByText('ミュート解除');
    fireEvent.click(button);
    expect(screen.queryByText('ミュート解除')).toBeNull();
  });
});
