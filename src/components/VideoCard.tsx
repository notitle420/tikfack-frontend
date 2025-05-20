import React, { useRef, useEffect, useState } from 'react';
import { Video, Actress } from '../types';
import './VideoCard.css';

interface VideoCardProps {
  video: Video;
  isVisible: boolean;
  isMuted: boolean; // ← 追加
  onVideoEnded?: () => void;
  onActressClick?: (actress: Actress) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, isVisible, isMuted, onVideoEnded, onActressClick }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleRedirectToDMM = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (video.url) window.open(video.url, '_blank');
  };

  // ミュート状態が変更されたとき即座に反映
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  useEffect(() => {
    if (!videoRef.current) return;
    if (isVisible && video.directUrl) {
      videoRef.current.load();
      videoRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.log('自動再生エラー:', err));
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [isVisible, video.directUrl]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.log('再生エラー:', err));
    }
  };

  return (
    <div className="video-card">
      <div className="video-container" onClick={togglePlay}>
      {video.directUrl ? (
        <>
          <video
            ref={videoRef}
            src={video.directUrl}
            poster={video.thumbnailUrl}
            playsInline
            muted={isMuted}
            autoPlay
            onEnded={onVideoEnded}
          />
          <button
            className="seek-backward-icon"
            onClick={(e) => {
              e.stopPropagation();
              if (videoRef.current) {
                videoRef.current.currentTime -= 10;
              }
            }}
          >
            « 10秒
          </button>
          <button
            className="seek-forward-icon"
            onClick={(e) => {
              e.stopPropagation();
              if (videoRef.current) videoRef.current.currentTime += 10;
            }}
            style={{ position: 'absolute', right: 0 }}
          >
            ▶︎ 10秒
          </button>
        </>          

        ) : (
          <div className="video-thumbnail-wrapper">
            <img src={video.thumbnailUrl} alt={video.title} className="video-thumbnail" />
            <div className="only-image-overlay">Only Image</div>
          </div>
        )}
        {!isPlaying && video.directUrl && (
          <div className="play-overlay">
            <span className="play-icon">▶</span>
          </div>
        )}
      </div>
      <div className="video-info" onClick={handleRedirectToDMM}>
        <div className="author-info">
          <img src={video.author.avatarUrl} alt={video.author.username} className="avatar" />
          <span className="username">{video.author.username}</span>
        </div>
        {video.actresses && video.actresses.length > 0 && (
          <div className="actress-list">
            {video.actresses.map(a => (
              <span
                key={a.id}
                className="actress-name"
                onClick={(e) => {
                  e.stopPropagation();
                  onActressClick && onActressClick(a);
                }}
              >
                {a.name}
              </span>
            ))}
          </div>
        )}
        <p className="video-title">{video.title}</p>
        <div className="video-stats">
          <div className="stats-left">
            <span className="likes">♥ {video.likesCount}</span>
            <span className="review-count">レビュー数 {video.review.count}</span>
            <span className="review-average">レビュー平均点 {video.review.average}</span>
          </div>
          <div className="stats-right">
            <span className="date">{new Date(video.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
