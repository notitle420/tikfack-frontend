import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Search from './Search';
import { fetchVideosByKeyword } from '../api/videoApi';

jest.mock('../api/videoApi');

jest.mock('../components/VideoCard', () => (props: any) => (
  <div data-testid="video-card">{props.video.title}</div>
));
jest.mock('react-router-dom', () => ({ __esModule: true, useLocation: () => ({ state: {} }) }), { virtual: true });

const mockedFetch = fetchVideosByKeyword as jest.MockedFunction<typeof fetchVideosByKeyword>;

afterEach(() => {
  jest.clearAllMocks();
});

describe('Search page', () => {
  it('performs search and displays results', async () => {
    mockedFetch.mockResolvedValue([{ id: '1', dmmVideoId: '1', title: 'Video1', directUrl: '', url: '', sampleUrl: '', thumbnailUrl: '', createdAt: '', price: 0, likesCount: 0, review: { count: 0, average: 0 }, description: 'Video1', author: { id: 'u', username: 'User', avatarUrl: '' } }]);

    render(<Search />);

    const input = screen.getByPlaceholderText('キーワード検索');
    fireEvent.change(input, { target: { value: 'query' } });
    fireEvent.submit(input.closest('form')!);

    await waitFor(() => expect(mockedFetch).toHaveBeenCalledWith('query', 20, 1));
    expect(await screen.findByTestId('video-card')).toBeInTheDocument();
  });

  it('shows error message on search failure', async () => {
    mockedFetch.mockRejectedValue(new Error('fail'));

    render(<Search />);

    const input = screen.getByPlaceholderText('キーワード検索');
    fireEvent.change(input, { target: { value: 'bad' } });
    fireEvent.submit(input.closest('form')!);

    await waitFor(() => expect(mockedFetch).toHaveBeenCalled());
    expect(await screen.findByText('検索に失敗しました')).toBeInTheDocument();
  });

  it('hides unmute button after click', async () => {
    mockedFetch.mockResolvedValue([]);

    render(<Search />);

    const unmute = screen.getByText('ミュート解除');
    fireEvent.click(unmute);
    expect(unmute).not.toBeInTheDocument();
  });
});
