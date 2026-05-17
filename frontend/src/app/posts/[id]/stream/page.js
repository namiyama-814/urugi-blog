'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import TabBar from '@/components/TabBar';

export default function PostStream() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [post, setPost] = useState(null);
  const [images, setImages] = useState([]); // 抽出した画像URLの配列
  const [loading, setLoading] = useState(true);
  const [viewCount, setViewCount] = useState(0);

  const feedRef = useRef(null);
  const progressBarRef = useRef(null);
  const viewedIndexesRef = useRef(new Set());

  useEffect(() => {
    if (!id) return;

    fetch(`http://localhost:8000/api/posts/${id}`)
      .then((res) => res.json())
      .then((data) => {
        const postData = data.post ? data.post : data;
        setPost(postData);

        if (postData.content) {
          const parser = new DOMParser();
          const doc = parser.parseFromString(postData.content, 'text/html');
          const imgElements = doc.querySelectorAll('img');
          const imgSrcList = Array.from(imgElements).map(img => img.getAttribute('src')).filter(Boolean);
          setImages(imgSrcList);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('ストリームの取得に失敗しました:', err);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    const feed = feedRef.current;
    if (!feed || images.length === 0) return;

    const posts = feed.querySelectorAll('.post-section');

    const handleScroll = () => {
      const scrollTop = feed.scrollTop;
      const height = window.innerHeight;
      const currentIndex = Math.round(scrollTop / height);

      if (currentIndex >= 0 && currentIndex < posts.length) {
        if (!viewedIndexesRef.current.has(currentIndex)) {
          viewedIndexesRef.current.add(currentIndex);
          setViewCount((prev) => {
            const nextCount = prev + 1;
            if (progressBarRef.current) {
              progressBarRef.current.style.width = (nextCount * 10) + '%';
            }
            createExpDot();
            return nextCount;
          });
        }

        const mainImg = posts[currentIndex].querySelector('.layer-main');
        if (mainImg) {
          const offset = (scrollTop % height) / height;
          const scale = 1 + Math.sin(offset * Math.PI) * 0.08; 
          mainImg.style.transform = `scale(${scale})`;
        }
      }
    };

    const createExpDot = () => {
      const dot = document.createElement('div');
      dot.className = 'exp-dot';
      dot.style.left = '50%';
      dot.style.top = '50%';
      document.body.appendChild(dot);

      const anime = dot.animate([
        { transform: 'translate(0, 0) scale(1)', opacity: 1 },
        { transform: `translate(${window.innerWidth / 2}px, -${window.innerHeight / 2}px) scale(0)`, opacity: 0 }
      ], { duration: 800, easing: 'ease-in' });

      anime.onfinish = () => dot.remove();
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target.querySelector('.layer-main');
          if (img) {
            img.animate([
              { filter: 'blur(10px) brightness(1.5)', transform: 'scale(0.95)' },
              { filter: 'blur(0px) brightness(1)', transform: 'scale(1)' }
            ], { duration: 400, easing: 'ease-out' });
          }
          if (navigator.vibrate) navigator.vibrate(15);
        }
      });
    }, { threshold: 0.5 });

    feed.addEventListener('scroll', handleScroll);
    posts.forEach(post => observer.observe(post));

    return () => {
      feed.removeEventListener('scroll', handleScroll);
      posts.forEach(post => observer.unobserve(post));
    };
  }, [images]);

  useEffect(() => {
    if (images.length === 0) return;

    const handleOrientation = (e) => {
      const tiltX = e.beta / 20; 
      const tiltY = e.gamma / 20; 
      const feed = feedRef.current;
      if (!feed) return;

      const posts = feed.querySelectorAll('.post-section');
      posts.forEach(post => {
        const bg = post.querySelector('.layer-bg');
        const main = post.querySelector('.layer-main');
        const ui = post.querySelector('.layer-ui');

        if (bg) bg.style.transform = `translate(${-tiltY * 10}px, ${-tiltX * 10}px) scale(1.1)`;
        if (main) main.style.transform = `translate(${tiltY * 5}px, ${tiltX * 5}px)`;
        if (ui) ui.style.transform = `translate(${tiltY * 20}px, ${tiltX * 20}px)`;
      });
    };

    window.addEventListener('deviceorientation', handleOrientation);
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [images]);

  const handleDoubleClick = (e) => {
    const img = e.currentTarget;
    img.animate([
      { transform: 'scale(1)' },
      { transform: 'scale(1.08) rotate(1.5deg)' },
      { transform: 'scale(1)' }
    ], { duration: 200 });
  };

  const requestPermission = () => {
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission()
        .then(response => {
          if (response === 'granted') {
            console.log('センサーアクセスが許可されました');
          }
        })
        .catch(console.error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-[#6e6e73] text-sm font-medium animate-pulse">ストリーム生成中...</div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white antialiased font-sans min-h-screen overflow-hidden">
      <meta name="referrer" content="no-referrer" />

      <div id="progress-bar" ref={progressBarRef}></div>

      <header className="fixed top-0 left-0 right-0 bg-black/40 backdrop-blur-md border-b border-white/10 z-50 px-6">
        <div className="max-w-md mx-auto h-14 flex items-center justify-between relative">
          <button onClick={() => router.push(`/posts/${id}`)} className="flex items-center gap-1 text-[#ff0050] text-[15px] -ml-2 active:opacity-60 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
            <span>記事へ</span>
          </button>
          <span 
            onClick={requestPermission} 
            className="text-sm font-semibold tracking-tight text-white absolute left-1/2 -translate-x-1/2 cursor-pointer bg-white/10 px-3 py-1 rounded-full active:scale-95 transition-transform"
          >
            ストリーム ⚡
          </span>
          <div className="w-10"></div>
        </div>
      </header>

      <main className="max-w-md mx-auto">
        {images.length > 0 ? (
          <div className="feed" id="feed" ref={feedRef}>
            {images.map((src, index) => (
              <section className="post-section post" key={index}>
                <img className="layer-bg" src={src} alt="Background blur" />
                <img 
                  className="layer-main" 
                  src={src} 
                  alt={`Feed content ${index + 1}`} 
                  onDoubleClick={handleDoubleClick}
                />
                <div className="layer-ui">
                  <h2 className="text-lg font-bold tracking-tight mb-0.5">{post?.title || "Urugi Village"}</h2>
                  <p className="text-xs text-white/70 font-light">Photo {index + 1} of {images.length}</p>
                </div>
              </section>
            ))}
          </div>
        ) : (
          <div className="min-h-screen flex items-center justify-center text-gray-500 text-sm">
            写真が見つかりませんでした
          </div>
        )}
      </main>

      <style jsx global>{`
        :root { --accent: #ff0050; }
        
        /* Next.jsコンポーネント用スクロールフィックス */
        #progress-bar {
          position: fixed; top: 0; left: 0; width: 0%; height: 4px;
          background: linear-gradient(90deg, var(--accent), #00f2ea);
          z-index: 1000; transition: width 0.3s ease;
        }
        .feed {
          height: 100vh; overflow-y: scroll; scroll-snap-type: y mandatory;
          perspective: 1000px;
          -webkit-overflow-scrolling: touch;
        }
        /* スクロールバー非表示 */
        .feed::-webkit-scrollbar { display: none; }
        
        .post {
          position: relative; width: 100%; height: 100vh;
          scroll-snap-align: start; display: flex; align-items: center;
          justify-content: center; overflow: hidden;
        }
        .layer-bg {
          position: absolute; width: 120%; height: 120%;
          object-fit: cover; filter: blur(25px) brightness(0.4);
          z-index: 1; transform: translateZ(-50px);
        }
        .layer-main {
          position: relative; width: 100%; aspect-ratio: 4/3;
          object-fit: contain; z-index: 2;
          box-shadow: 0 20px 50px rgba(0,0,0,0.8);
          transition: transform 0.1s ease-out;
          will-change: transform;
          cursor: pointer;
        }
        .layer-ui {
          position: absolute; bottom: 14%; left: 6%; z-index: 3;
          transform: translateZ(50px);
          text-shadow: 0 2px 10px rgba(0,0,0,1);
          pointer-events: none;
        }
        .exp-dot {
          position: fixed; width: 8px; height: 8px; background: var(--accent);
          border-radius: 50%; pointer-events: none; z-index: 999;
          box-shadow: 0 0 10px var(--accent);
        }
      `}</style>
    </div>
  );
}