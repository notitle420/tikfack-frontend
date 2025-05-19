import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Video } from '../types';
import VideoCard from '../components/VideoCard';
import './Home.css';
import { 
  fetchVideos,
} from '../api/videoApi'

// window オブジェクトに scrollEndTimer を追加するための型拡張
declare global {
  interface Window {
    scrollEndTimer: ReturnType<typeof setTimeout>;
  }
}

// 日付をYYYY-MM-DD形式で取得する補助関数
const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2);
  const day = ("0" + date.getDate()).slice(-2);
  return `${year}-${month}-${day}`;
};

const Home: React.FC = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  // 初期読み込み時は今日の日付を使用
  const [currentDate, setCurrentDate] = useState<string>(formatDate(new Date()));
  // 前日データ取得中の重複防止用フラグ
  const [isFetchingPrevious, setIsFetchingPrevious] = useState(false);
  const loadedDatesRef = useRef(new Set<string>());
  const [isMuted, setIsMuted] = useState(true);

  const handleUnmute = () => {
    setIsMuted(false);
  };
  

  // 各動画カードの ref（位置計算用）
  const videoRefs = useRef<HTMLDivElement[]>([]);

  // 日付を指定して動画データを取得し、リストを置換する関数
  const loadVideos = useCallback(async (date: string) => {
    try {
      console.log("動画を読み込みます:", date);
      const data = await fetchVideos(date);
      console.log("取得データ:", data);
      // 配列を入れ替える（リスト置換）
      setVideos(data);
      // 新しいリストのトップから表示するので、インデックスをリセット
      setLoading(false);
      setIsFetchingPrevious(false);
    } catch (error) {
      const fallbackData = [{
        id: "fallback",
        title: "デフォルト動画",
        description: "APIから動画を取得できなかった場合のフォールバック",
        dmmVideoId: "h_1472erofv0030",
        directUrl: "aaaaaa",
        thumbnailUrl: "/thumbnails/default.jpg",
        createdAt: new Date().toISOString(),
        likesCount: 0,
        sampleUrl: "",
        url: "",
        price: 0,
        review: {
          count: 0,
          average: 0
        },
        author: {
          id: "default",
          username: "デフォルトユーザー",
          avatarUrl: "/avatars/default.jpg"
        }
      }];
      setVideos(fallbackData);
      setError('動画リストの読み込みに失敗しました。デフォルト動画を表示しています。');
      setLoading(false);
      setIsFetchingPrevious(false);
    }
  }, []);

  useEffect(() => {
    if (!loading && videos.length > 0) {
      // 新しいリストが読み込まれたので、0番目の要素を画面に表示する
      videoRefs.current[0]?.scrollIntoView({ behavior: 'smooth' });
      setCurrentVideoIndex(0);
    }
  }, [loading, videos]);

  // 初回データ読み込み・前日データ切替用
  useEffect(() => {
    if (!loadedDatesRef.current.has(currentDate)) {
      loadedDatesRef.current.add(currentDate);
      loadVideos(currentDate);
    }
  }, [currentDate, loadVideos]);

  useEffect(() => {
    console.log("currentDate:", currentDate);
    console.log("currentVideoIndex:", currentVideoIndex);
    console.log("videos:", videos);
  }, [currentDate, currentVideoIndex, videos]);

  // スクロール停止後に最も近い動画カードにスナップする
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
    console.log("scroll");
    clearTimeout(window.scrollEndTimer);
    window.scrollEndTimer = setTimeout(() => {
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

  const handleReactScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    handleScrollLogic();
  }, [handleScrollLogic]);

  const handleDOMScroll = useCallback(() => {
    handleScrollLogic();
  }, [handleScrollLogic]);

  useEffect(() => {
    window.addEventListener('scroll', handleDOMScroll);
    return () => window.removeEventListener('scroll', handleDOMScroll);
  }, [handleDOMScroll]);

  useEffect(() => {
    // currentVideoIndex が更新されたタイミングで、次の動画がある場合にプリロードを試みる
    if (currentVideoIndex < videos.length - 1) {
      const nextVideo = videos[currentVideoIndex + 1];
      if (!nextVideo?.sampleUrl) return;
      if (nextVideo && nextVideo.dmmVideoId) {
        (async () => {
          try {
            // getValidVideoUrl を呼び出して、有効な動画URLを取得（non-null assertion を利用）
            const nextVideoUrl = nextVideo.directUrl
            console.log("プリロードする動画URL:", nextVideoUrl);
            // 隠しのvideo要素を作成してプリロード
            const preloader = document.createElement("video");
            preloader.src = nextVideoUrl;
            preloader.muted = true;
            preloader.playsInline = true;
            preloader.preload = "auto";
            preloader.style.display = "none"; // 表示しない
            document.body.appendChild(preloader);
            // 読み込み完了またはエラー後に削除
            preloader.onloadeddata = () => {
              console.log("次の動画のプリロード完了");
              document.body.removeChild(preloader);
            };
            preloader.onerror = () => {
              console.log("次の動画のプリロードエラー");
              document.body.removeChild(preloader);
            };
          } catch (error) {
            console.error("プリロード中にエラーが発生しました:", error);
          }
        })();
      }
    }
  }, [currentVideoIndex, videos]);

  const scrollToNextVideo = useCallback(() => {
    if (currentVideoIndex < videos.length - 1) {
      // 現在のインデックスがリストの最終動画より前の場合は通常のスクロール
      const nextIndex = currentVideoIndex + 1;
      if (videoRefs.current[nextIndex]) {
        videoRefs.current[nextIndex].scrollIntoView({ behavior: 'smooth', block: 'start' });
        setCurrentVideoIndex(nextIndex);
      }
    } else {
      // 最終動画に到達した場合は前日データを取得
      if (!isFetchingPrevious && !loading) {
        console.log("最終ビデオに到達。前日データ読み込み");
        setIsFetchingPrevious(true);
        const current = new Date(currentDate);
        current.setDate(current.getDate() - 1);
        const prevDate = formatDate(current);
        setCurrentDate(prevDate);
        setLoading(true);
        // loadVideos は useEffect により currentDate 更新時に呼ばれる
      }
    }
  }, [currentVideoIndex, videos.length, isFetchingPrevious, loading, currentDate]);

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

  if (loading) {
    return <div className="loading">読み込み中...</div>;
  }

  if (error && videos.length === 0) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="home-container">
      {isMuted && (
      <button className="unmute-btn" onClick={handleUnmute}>
        ミュート解除
      </button>
    )}
      <div 
        className="video-feed"
        onScroll={handleReactScroll}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {videos.map((video, index) => (
          <div
            key={video.id}
            ref={(el) => {
              if (el) videoRefs.current[index] = el;
            }}
            className="video-item"
          >
            <VideoCard video={video} isVisible={index === currentVideoIndex} isMuted={isMuted} onVideoEnded={scrollToNextVideo}/>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
