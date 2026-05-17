'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import TabBar from '@/components/TabBar';

export default function PostDetail() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // モーダル管理用の状態（開いている画像のURLを保持。nullなら閉じている状態）
  const [activeImgUrl, setActiveImgUrl] = useState(null);

  // 記事データの取得
  useEffect(() => {
    if (!id) return;

    fetch(`http://localhost:8000/api/posts/${id}`)
      .then((res) => res.json())
      .then((data) => {
        const postData = data.post ? data.post : data;
        setPost(postData);
        setLoading(false);
      })
      .catch((err) => {
        console.error('記事の取得に失敗しました:', err);
        setLoading(false);
      });
  }, [id]);

  // ★【追加】モーダル表示中の背景スクロール制御
  useEffect(() => {
    if (activeImgUrl) {
      // モーダルが開いた時：スクロールを禁止
      document.body.style.overflow = 'hidden';
    } else {
      // モーダルが閉じた時：元のスクロール状態に戻す
      document.body.style.overflow = '';
    }

    // クリーンアップ関数（画面遷移時などに確実に制限を解除する安全ガード）
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeImgUrl]);

  // HTML内の画像クリックを親要素で検知するハンドラー
  const handleContentClick = (e) => {
    if (e.target.tagName === 'IMG') {
      const src = e.target.getAttribute('src');
      if (src) {
        setActiveImgUrl(src);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center">
        <div className="text-[#6e6e73] text-sm font-medium animate-pulse">読み込み中...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] flex flex-col items-center justify-center gap-4">
        <div className="text-[#6e6e73] text-sm font-medium">記事が見つかりませんでした</div>
        <button onClick={() => router.push('/')} className="text-sm text-[#0066cc] font-medium hover:underline">
          ホームに戻る
        </button>
      </div>
    );
  }

  const formattedDate = post.date ? post.date.replace(/-/g, '/') : '2026/05/11';

  return (
    <div className="bg-[#f5f5f7] text-[#1d1d1f] antialiased pb-36 font-sans min-h-screen">
      <meta name="referrer" content="no-referrer" />

      <header className="sticky top-0 bg-[#ffffff]/80 backdrop-blur-md border-b border-[#e8e8ed] z-50 px-6">
        <div className="max-w-md mx-auto h-14 flex items-center justify-between relative">
          <button onClick={() => router.push('/')} className="flex items-center gap-1 text-[#0066cc] text-[15px] -ml-2 active:opacity-60 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
            <span>戻る</span>
          </button>
          <span className="text-sm font-semibold tracking-tight text-black absolute left-1/2 -translate-x-1/2">日誌</span>
          <button
            onClick={() => router.push(`/posts/${id}/stream`)}
            className="text-[#0066cc] text-[14px] font-medium active:opacity-60 transition-opacity"
          >
            写真
          </button>
        </div>
      </header>

      {/* 記事本文エリア */}
      <main className="max-w-md mx-auto px-6 pt-6" onClick={handleContentClick}>
        <div className="mb-6">
          <span className="text-xs font-semibold text-[#86868b] tabular-nums tracking-wide block mb-2">{formattedDate}</span>
          <h1 className="text-2xl font-bold tracking-tight text-black leading-tight">{post.title}</h1>
        </div>

        {post.content ? (
          <article className="article-content bg-transparent" dangerouslySetInnerHTML={{ __html: post.content }} />
        ) : (
          <article className="article-content bg-transparent">
            <p>{post.body || '本文がありません。'}</p>
          </article>
        )}
      </main>

      <TabBar />

      {/* Appleテイスト・フォトモーダル */}
      {activeImgUrl && (
        <div 
          onClick={() => setActiveImgUrl(null)}
          className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4 backdrop-blur-lg transition-opacity duration-300 animate-fade-in"
        >
          {/* 右上の閉じるボタン */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setActiveImgUrl(null);
            }} 
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 active:scale-95 text-white rounded-full transition-all z-[110]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>

          {/* 拡大画像 */}
          <img 
            src={activeImgUrl} 
            alt="拡大画像" 
            className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl transition-transform duration-300 ease-out animate-zoom-in"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <style jsx global>{`
        .article-content p { margin-bottom: 1.5rem; font-size: 15px; line-height: 1.75; letter-spacing: -0.01em; color: #1d1d1f; }
        .article-content img { display: block !important; width: 100% !important; height: auto !important; max-width: 100% !important; border-radius: 1rem !important; margin-top: 0.5rem !important; margin-bottom: 1.5rem !important; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05) !important; border: 1px solid #f3f4f6 !important; cursor: pointer !important; transition: transform 0.2s ease, opacity 0.2s ease !important; }
        .article-content img:active { transform: scale(0.98) !important; opacity: 0.9 !important; }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes zoomIn { from { transform: scale(0.95); } to { transform: scale(1); } }
        .animate-fade-in { animation: fadeIn 0.2s ease-out forwards; }
        .animate-zoom-in { animation: zoomIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
}