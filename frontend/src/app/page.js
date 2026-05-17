'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import RecentPosts from '@/components/RecentPosts';
import TabBar from '@/components/TabBar';

export default function Home() {
  const [postsData, setPostsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  // 検索用の状態管理
  const [isSearchOpen, setIsSearchOpen] = useState(false); // モーダルの開閉フラグ
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  // 通常の記事一覧フェッチ
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

  // モーダル表示中の背景スクロール固定
  useEffect(() => {
    if (isSearchOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isSearchOpen]);

  // 検索実行ロジック
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearchLoading(true);
    fetch(`http://localhost:8000/api/search?q=${encodeURIComponent(searchQuery)}`)
      .then((res) => res.json())
      .then((data) => {
        setSearchResults(data);
        setSearchLoading(false);
      })
      .catch((err) => {
        console.error('検索失敗:', err);
        setSearchLoading(false);
      });
  };

  // 検索を閉じてクリアする
  const handleCloseSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const currentPage = postsData ? Number(postsData.currentPage || page) : page;
  const hasMore = postsData ? postsData.hasMore : false;

  return (
    <div className="bg-[#f5f5f7] text-[#1d1d1f] antialiased pb-36 font-sans min-h-screen">
      <Header />
      
      <main className="max-w-md mx-auto pt-4 px-6">
        {loading ? (
          <div className="py-20 text-center text-[#6e6e73] text-sm animate-pulse">読み込み中...</div>
        ) : (
          <div>
            <RecentPosts posts={postsData} />
            
            {/* 通常のページネーション */}
            <div className="flex items-center justify-center gap-4 py-6 select-none">
              <button 
                onClick={() => setPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-[#1d1d1f] transition-all active:scale-95
                  ${currentPage === 1 ? 'text-gray-400 opacity-30 pointer-events-none' : 'hover:border-black'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
              </button>
              <div className="text-[14px] font-medium text-black border-b-2 border-black pb-0.5 px-2">
                {currentPage}
              </div>
              <button 
                onClick={() => setPage(currentPage + 1)}
                disabled={!hasMore}
                className={`w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-[#1d1d1f] transition-all active:scale-95
                  ${!hasMore ? 'text-gray-400 opacity-30 pointer-events-none' : 'hover:border-black'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* タブバーに検索ボタンが押された時の関数を仕込む */}
      <TabBar onSearchClick={() => setIsSearchOpen(true)} />

      {/* ========================================== */}
      {/* Appleテイスト・フルスクリーン検索モーダル */}
      {/* ========================================== */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-[#f5f5f7] z-[200] overflow-y-auto animate-fade-in flex flex-col">
          
          {/* モーダル内ヘッダー */}
          <header className="sticky top-0 bg-[#f5f5f7]/90 backdrop-blur-md px-6 py-4 flex items-center gap-4 border-b border-[#e8e8ed]">
            <form onSubmit={handleSearchSubmit} className="flex-1 relative">
              <input
                type="text"
                autoFocus
                placeholder="日誌を検索"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#e8e8ed] text-black pl-10 pr-4 py-2 rounded-xl text-[15px] focus:outline-none focus:ring-2 focus:ring-[#0066cc]/50 transition-all"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#86868b]">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.603 10.601Z" /></svg>
              </span>
            </form>
            <button onClick={handleCloseSearch} className="text-[15px] text-[#0066cc] font-medium active:opacity-60 transition-opacity whitespace-nowrap">
              キャンセル
            </button>
          </header>

          {/* 検索結果エリア */}
          <div className="flex-1 max-w-md w-full mx-auto px-6 py-4">
            {searchLoading ? (
              <div className="py-20 text-center text-[#6e6e73] text-sm animate-pulse">検索中...</div>
            ) : searchQuery && searchResults.length > 0 ? (
              <div>
                <h2 className="text-xs font-semibold text-[#86868b] uppercase tracking-wider mb-4">検索結果 ({searchResults.length}件)</h2>
                <div className="flex flex-col gap-3">
                  {searchResults.map((post) => (
                    <a
                      key={post.id}
                      href={`/posts/${post.id}`}
                      className="block bg-white p-4 rounded-2xl border border-[#e8e8ed] shadow-sm active:scale-[0.99] transition-all"
                    >
                      <span className="text-[11px] font-medium text-[#86868b] block mb-1 tabular-nums">
                        {post.date ? post.date.replace(/-/g, '/') : ''}
                      </span>
                      <h3 className="text-[15px] font-bold text-black leading-snug tracking-tight">
                        {post.title}
                      </h3>
                    </a>
                  ))}
                </div>
              </div>
            ) : searchQuery && !searchLoading ? (
              <div className="py-16 text-center text-[#6e6e73] text-sm">
                一致する日誌が見つかりませんでした。
              </div>
            ) : (
              <div className="py-16 text-center text-[#86868b] text-sm">
                キーワードを入力してEnterを押してください
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
}