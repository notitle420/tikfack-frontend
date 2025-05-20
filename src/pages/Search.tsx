import React, { useState, useRef, useCallback, useEffect } from 'react';
import { fetchVideosByKeyword, fetchVideosByActressId } from '../api/videoApi';
import { Video, Actress } from '../types';
import { useLocation } from 'react-router-dom';
import VideoCard from '../components/VideoCard';
import './Search.css';

declare global {
  interface Window {
    scrollEndTimer: ReturnType<typeof setTimeout>;
  }
}

const Search: React.FC = () => {
  const [keyword, setKeyword] = useState('');
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [offset, setOffset] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const videoRefs = useRef<HTMLDivElement[]>([]);
  const HITS_PER_PAGE = 20;
  const location = useLocation();

  const handleUnmute = () => {
    setIsMuted(false);
  };

  const loadMoreVideos = async (currentKeyword: string, currentOffset: number) => {
    try {
      const results = await fetchVideosByKeyword(currentKeyword, HITS_PER_PAGE, currentOffset);
      if (results.length === 0) {
        setHasMore(false);
        return;
      }
      setVideos(results);
      setCurrentVideoIndex(0);
      setTimeout(() => {
        videoRefs.current[0]?.scrollIntoView({ behavior: 'smooth' });
      }, 0);
    } catch (err) {
      setError('動画の読み込みに失敗しました');
    }
  };

  const searchByActress = async (id: string, name: string) => {
    setKeyword(name);
    setLoading(true);
    setError(null);
    setOffset(1);
    setHasMore(true);
    try {
      const results = await fetchVideosByActressId(id, HITS_PER_PAGE, 1);
      setVideos(results);
      setCurrentVideoIndex(0);
      if (results.length < HITS_PER_PAGE) {
        setHasMore(false);
      }
      setTimeout(() => {
        videoRefs.current[0]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 0);
    } catch (err) {
      setError('検索に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOffset(1);
    setHasMore(true);
    try {
      const results = await fetchVideosByKeyword(keyword, HITS_PER_PAGE, 1);
      setVideos(results);
      setCurrentVideoIndex(0);
      if (results.length < HITS_PER_PAGE) {
        setHasMore(false);
      }
      setTimeout(() => {
        videoRefs.current[0]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 0);
    } catch (err) {
      setError('検索に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleActressClick = (actress: Actress) => {
    searchByActress(actress.id, actress.name);
  };

  useEffect(() => {
    const state = location.state as { actressId?: string; actressName?: string } | null;
    if (state && state.actressId) {
      searchByActress(state.actressId, state.actressName || '');
    }
  }, [location.state]);

  const findClosestVideoIndex = useCallback(() => {
    let closestIndex = 0;
    let minDistance = Infinity;
    videoRefs.current.forEach((ref, index) => {
      if (!ref) return;
      const rect = ref.getBoundingClientRect();
      const distance = Math.abs(rect.top);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });
    return closestIndex;
  }, []);

  const handleScrollLogic = useCallback(() => {
    if (videoRefs.current.length === 0) return;
    clearTimeout((window as any).scrollEndTimer);
    (window as any).scrollEndTimer = setTimeout(() => {
      const closestIndex = findClosestVideoIndex();
      if (closestIndex !== currentVideoIndex) {
        videoRefs.current[closestIndex]?.scrollIntoView({ behavior: 'smooth' });
        setCurrentVideoIndex(closestIndex);
      }
    }, 100);
    const newIndex = findClosestVideoIndex();
    if (newIndex !== currentVideoIndex) {
      setCurrentVideoIndex(newIndex);
    }
  }, [currentVideoIndex, findClosestVideoIndex]);

  const handleReactScroll = useCallback(() => {
    handleScrollLogic();
  }, [handleScrollLogic]);

  const scrollToNextVideo = useCallback(() => {
    if (currentVideoIndex < videos.length - 1) {
      const nextIndex = currentVideoIndex + 1;
      if (videoRefs.current[nextIndex]) {
        videoRefs.current[nextIndex].scrollIntoView({ behavior: 'smooth', block: 'start' });
        setCurrentVideoIndex(nextIndex);
      }
    } else if (hasMore && !loading) {
      const nextOffset = offset + HITS_PER_PAGE;
      setOffset(nextOffset);
      loadMoreVideos(keyword, nextOffset);
    }
  }, [currentVideoIndex, videos.length, hasMore, loading, keyword, offset]);

  const scrollToPrevVideo = useCallback(() => {
    const prevIndex = Math.max(currentVideoIndex - 1, 0);
    if (prevIndex !== currentVideoIndex && videoRefs.current[prevIndex]) {
      videoRefs.current[prevIndex].scrollIntoView({ behavior: 'smooth', block: 'start' });
      setCurrentVideoIndex(prevIndex);
    }
  }, [currentVideoIndex]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientY);
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientY);
    e.preventDefault();
  };

  const handleTouchEnd = () => {
    const swipeDistance = touchStart - touchEnd;
    if (Math.abs(swipeDistance) > 1) {
      if (swipeDistance > 0) {
        scrollToNextVideo();
      } else {
        scrollToPrevVideo();
      }
    } else {
      if (videoRefs.current[currentVideoIndex]) {
        videoRefs.current[currentVideoIndex].scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'j') {
        scrollToNextVideo();
      } else if (e.key === 'ArrowUp' || e.key === 'k') {
        scrollToPrevVideo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [scrollToNextVideo, scrollToPrevVideo]);

  return (
    <div className="search-container">
      {isMuted && (
        <button className="unmute-btn" onClick={handleUnmute}>
          ミュート解除
        </button>
      )}
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="キーワード検索"
        />
        <button type="submit">検索</button>
      </form>
      <div
        className="video-feed"
        onScroll={handleReactScroll}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {loading && <div className="loading">読み込み中...</div>}
        {error && <div className="error">{error}</div>}
        {videos.map((video, index) => (
          <div
            key={`${video.id}-${index}`}
            ref={(el) => {
              if (el) videoRefs.current[index] = el;
            }}
            className="video-item"
          >
            <VideoCard
              video={video}
              isVisible={index === currentVideoIndex}
              isMuted={isMuted}
              onVideoEnded={scrollToNextVideo}
              onActressClick={handleActressClick}
            />
          </div>
        ))}
        {!hasMore && videos.length > 0 && (
          <div className="end-message">これ以上の動画はありません</div>
        )}
      </div>
    </div>
  );
};

export default Search;
