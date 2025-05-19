import React, { useState } from 'react';
import { fetchVideosByKeyword } from '../api/videoApi';
import { Video } from '../types';
import VideoCard from '../components/VideoCard';
import './Search.css';

const Search: React.FC = () => {
  const [keyword, setKeyword] = useState('');
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const results = await fetchVideosByKeyword(keyword);
      setVideos(results);
    } catch (err) {
      setError('検索に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="キーワード検索"
        />
        <button type="submit">検索</button>
      </form>
      <div className="search-results">
        {loading && <div className="loading">読み込み中...</div>}
        {error && <div className="error">{error}</div>}
        {videos.map((video) => (
          <div key={video.id} className="search-item">
            <VideoCard video={video} isVisible={true} isMuted={true} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Search;
