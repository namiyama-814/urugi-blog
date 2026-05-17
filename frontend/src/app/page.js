'use client';

import { useEffect, useState } from 'react';
// 🌟 作成したコンポーネント群をインポート
import Header from '@/components/Header';
import LoopSlider from '@/components/LoopSlider';
import RecentPosts from '@/components/RecentPosts';
import TabBar from '@/components/TabBar';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/api/posts')
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('データ取得失敗:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center">
        <div className="text-[#6e6e73] text-sm font-medium animate-pulse">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="bg-[#f5f5f7] text-[#1d1d1f] antialiased pb-36 font-sans min-h-screen selection:bg-blue-200">
      
      <Header />

      <main className="max-w-md mx-auto pt-6">
        
        <LoopSlider posts={posts} />

        <RecentPosts posts={posts} />

        <div className="flex items-center justify-center gap-6 py-6 select-none">
          <button className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-gray-400 opacity-30 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </button>
          <div className="flex items-center gap-4 text-[14px] font-medium tabular-nums">
            <span className="text-black border-b-2 border-black pb-0.5 px-1">1</span>
            <span className="text-[#86868b] cursor-pointer hover:text-black pb-0.5 px-1">2</span>
            <span className="text-[#86868b] cursor-default">…</span>
            <span className="text-[#86868b] cursor-pointer hover:text-black pb-0.5 px-1">8</span>
          </div>
          <button className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-[#1d1d1f] hover:border-black active:scale-95 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>

      </main>

      <TabBar />

    </div>
  );
}