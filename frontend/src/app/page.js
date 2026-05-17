'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import RecentPosts from '@/components/RecentPosts';
import TabBar from '@/components/TabBar';

export default function Home() {
  const [postsData, setPostsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:8000/api/posts?page=${page}`)
      .then((res) => res.json())
      .then((data) => {
        setPostsData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('データ取得失敗:', err);
        setLoading(false);
      });
  }, [page]);

  const currentPage = postsData ? Number(postsData.currentPage || page) : page;
  const hasMore = postsData ? postsData.hasMore : false;

  const handlePageClick = (targetPage) => {
    if (targetPage >= 1) {
      setPage(targetPage);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    
    pages.push(1);

    if (currentPage > 3) {
      pages.push('…');
    }

    if (currentPage > 2) {
      pages.push(currentPage - 1);
    }

    if (currentPage !== 1) {
      pages.push(currentPage);
    }

    if (hasMore) {
      pages.push(currentPage + 1);
      pages.push('…');
    }

    const uniquePages = pages.filter((item, index) => pages.indexOf(item) === index);

    return uniquePages.map((p, idx) => {
      if (p === '…') {
        return (
          <span key={`dot-${idx}`} className="text-[#86868b] cursor-default px-1">
            …
          </span>
        );
      }

      const isCurrent = p === currentPage;
      return (
        <button
          key={`page-${p}`}
          onClick={() => handlePageClick(p)}
          className={`pb-0.5 px-2 text-[14px] font-medium transition-colors duration-150 rounded-md hover:text-black
            ${isCurrent 
              ? 'text-black border-b-2 border-black font-semibold cursor-default' 
              : 'text-[#86868b]'
            }`}
          disabled={isCurrent}
        >
          {p}
        </button>
      );
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center">
        <div className="text-[#6e6e73] text-sm font-medium animate-pulse">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="bg-[#f5f5f7] text-[#1d1d1f] antialiased pb-36 font-sans min-h-screen">
      <Header />
      <main className="max-w-md mx-auto pt-6">
        <RecentPosts posts={postsData} />

        <div className="flex items-center justify-center gap-4 py-6 select-none">
          <button 
            onClick={() => handlePageClick(currentPage - 1)}
            disabled={currentPage === 1}
            className={`w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-[#1d1d1f] transition-all active:scale-95
              ${currentPage === 1 ? 'text-gray-400 opacity-30 pointer-events-none' : 'hover:border-black'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </button>

          <div className="flex items-center gap-1 tabular-nums">
            {renderPageNumbers()}
          </div>

          <button 
            onClick={() => handlePageClick(currentPage + 1)}
            disabled={!hasMore}
            className={`w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-[#1d1d1f] transition-all active:scale-95
              ${!hasMore ? 'text-gray-400 opacity-30 pointer-events-none' : 'hover:border-black'}`}
          >
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