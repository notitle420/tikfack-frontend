import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Top from './Top';
import { fetchVideos } from '../api/videoApi';
import { Video } from '../types';

jest.mock('../api/videoApi');
jest.mock('../components/VideoCard', () => (props: any) => (<div>{props.video.title}</div>));
jest.mock('react-router-dom', () => ({ __esModule: true, useNavigate: () => jest.fn() }), { virtual: true });

const mockedFetchVideos = fetchVideos as jest.MockedFunction<typeof fetchVideos>;

const sampleVideos: Video[] = [
  {
    id: '1',
    dmmVideoId: '1',
    title: 'Video 1',
    directUrl: 'video1.mp4',
    url: 'http://example.com/1',
    sampleUrl: 's1.mp4',
    thumbnailUrl: 't1.jpg',
    createdAt: '2023-01-01',
    price: 0,
    likesCount: 0,
    review: { count: 0, average: 0 },
    description: 'desc1',
    author: { id: 'a1', username: 'Actor1', avatarUrl: 'a1.jpg' },
    actresses: [],
    genres: [],
    makers: [],
    series: [],
    directors: []
  },
  {
    id: '2',
    dmmVideoId: '2',
    title: 'Video 2',
    directUrl: 'video2.mp4',
    url: 'http://example.com/2',
    sampleUrl: 's2.mp4',
    thumbnailUrl: 't2.jpg',
    createdAt: '2023-01-02',
    price: 0,
    likesCount: 0,
    review: { count: 0, average: 0 },
    description: 'desc2',
    author: { id: 'a2', username: 'Actor2', avatarUrl: 'a2.jpg' },
    actresses: [],
    genres: [],
    makers: [],
    series: [],
    directors: []
  }
];

beforeAll(() => {
  Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', { value: jest.fn(), configurable: true });
});

beforeEach(() => {
  mockedFetchVideos.mockResolvedValue(sampleVideos);
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('renders loading initially', () => {
  render(<Top />);
  expect(screen.getByText('読み込み中...')).toBeInTheDocument();
});

test('renders videos after fetch', async () => {
  render(<Top />);
  await waitFor(() => expect(mockedFetchVideos).toHaveBeenCalled());
  expect(screen.getByText('Video 1')).toBeInTheDocument();
  expect(screen.getByText('Video 2')).toBeInTheDocument();
});
