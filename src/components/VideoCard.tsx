import React, { useRef, useEffect, useState } from 'react';
import { Video } from '../types';
import './VideoCard.css';

interface VideoCardProps {
  video: Video;
  isVisible: boolean;
  isMuted: boolean; // ← 追加
  onVideoEnded?: () => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, isVisible, isMuted, onVideoEnded }) => {
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
      {video.sampleUrl ? (
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
        {!isPlaying && video.sampleUrl && (
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
        <h3 className="video-title">{video.title}</h3>
        <p className="video-description">{video.description}</p>
        <div className="video-stats">
          <span className="likes">♥ {video.likesCount}</span>
          <span className="date">{new Date(video.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
