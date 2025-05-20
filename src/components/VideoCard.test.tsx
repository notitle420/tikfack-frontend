import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import VideoCard from './VideoCard';
import { Video } from '../types';

const sampleVideo: Video = {
  id: '1',
  dmmVideoId: '1',
  title: 'Test Video',
  directUrl: 'video.mp4',
  url: 'http://example.com',
  sampleUrl: 'sample.mp4',
  thumbnailUrl: 'thumb.jpg',
  createdAt: '2023-01-01',
  price: 100,
  likesCount: 10,
  review: { count: 2, average: 4 },
  description: 'desc',
  author: { id: 'a1', username: 'Actor1', avatarUrl: 'avatar.jpg' },
  actresses: [],
  genres: [],
  makers: [],
  series: [],
  directors: []
};

let playSpy: jest.SpyInstance;
let pauseSpy: jest.SpyInstance;

beforeEach(() => {
  Object.defineProperty(window, 'open', { value: jest.fn() });
  jest.spyOn(HTMLMediaElement.prototype, 'load').mockImplementation(() => {});
  playSpy = jest.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(() => Promise.resolve());
  pauseSpy = jest.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('renders video element and toggles play/pause on click', async () => {
  const { container } = render(<VideoCard video={sampleVideo} isVisible={false} isMuted={true} />);
  const video = container.querySelector('video') as HTMLVideoElement;
  expect(video).toBeInTheDocument();
  expect(video.muted).toBe(true);

  const wrapper = container.querySelector('.video-container') as HTMLElement;

  await act(async () => {
    fireEvent.click(wrapper);
  });
  expect(playSpy).toHaveBeenCalled();

  await act(async () => {
    fireEvent.click(wrapper);
  });
  expect(pauseSpy).toHaveBeenCalled();
});

test('renders thumbnail when no directUrl', () => {
  const { getByText } = render(<VideoCard video={{ ...sampleVideo, directUrl: '' }} isVisible={true} isMuted={false} />);
  expect(getByText('Only Image')).toBeInTheDocument();
});

test('clicking info opens url in new window', () => {
  const { container } = render(<VideoCard video={sampleVideo} isVisible={true} isMuted={false} />);
  const info = container.querySelector('.video-info') as HTMLElement;
  fireEvent.click(info);
  expect(window.open).toHaveBeenCalledWith(sampleVideo.url, '_blank');
});
