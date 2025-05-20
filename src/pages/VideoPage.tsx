import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchVideoById, } from '../api/videoApi';
import { Video, Actress } from '../types';
import './VideoPage.css';

const VideoPage: React.FC = () => {
  // URLパラメータからIDを取得
  const { id: urlId } = useParams<{ id: string }>();
  const id = urlId || "1"; // デフォルトは最初の動画
  const navigate = useNavigate();
  
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const loadVideo = async () => {
      try {
        const data = await fetchVideoById(id);
        setVideo(data);
        
        // DMM動画IDから直接的な動画URLを設定

        setLoading(false);
        
        // 動画のロード後に自動再生を試みる
        setTimeout(() => {
          if (videoRef.current) {
            videoRef.current.play().catch(err => {
              console.log('自動再生できませんでした:', err);
            });
          }
        }, 500);
      } catch (error) {
        setError('動画の読み込みに失敗しました');
        setLoading(false);
      }
    };

    loadVideo();
  }, [id]);

  // 動画のエラーハンドリング
const handleVideoError = () => {
    // 最初のURLが失敗した場合、代替URLを試す
    if (videoUrl && video?.dmmVideoId) {
      // 代替URLに切り替え
    
    }
    
  setError('動画の再生に失敗しました');
};

  const handleActressClick = (actress: Actress) => {
    navigate('/search', { state: { actressId: actress.id, actressName: actress.name } });
  };

  if (loading) {
    return <div className="loading">読み込み中...</div>;
  }

  if (error || !video) {
    return <div className="error">{error || '動画が見つかりません'}</div>;
  }

  return (
    <div className="video-page">
      <div className="video-player-container">
        <video
          ref={videoRef}
          src={videoUrl}
          poster={video.thumbnailUrl}
          controls
          playsInline
          className="video-player-full"
          onError={handleVideoError}
        />
      </div>
      <div className="video-details">
        <h1 className="video-title">{video.title}</h1>
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
                onClick={() => handleActressClick(a)}
              >
                {a.name}
              </span>
            ))}
          </div>
        )}
        <p className="video-description">{video.description}</p>
        <div className="video-stats">
          <span className="likes">♥ {video.likesCount}</span>
          <span className="date">{new Date(video.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

export default VideoPage;