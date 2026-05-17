'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function LoopSlider({ posts }) {
  const router = useRouter();
  const sliderRef = useRef(null);
  const isDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftStartRef = useRef(0);

  const safePosts = Array.isArray(posts)
    ? posts
    : posts && Array.isArray(posts.posts)
    ? posts.posts
    : posts && Array.isArray(posts.data)
    ? posts.data
    : [];

  const pickupPosts = safePosts.slice(0, 5);

  const getStep = () => {
    if (!sliderRef.current) return 0;
    const firstCard = sliderRef.current.querySelector('.loop-card');
    if (!firstCard) return 0;
    return firstCard.getBoundingClientRect().width + 16;
  };

  useEffect(() => {
    if (safePosts.length === 0 || !sliderRef.current) return;

    const initSlider = () => {
      const slider = sliderRef.current;
      slider.classList.remove('scroll-smooth');
      slider.scrollLeft = getStep();
      slider.classList.add('scroll-smooth');
    };

    const timer = setTimeout(initSlider, 100);
    window.addEventListener('resize', initSlider);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', initSlider);
    };
  }, [safePosts]);

  const handleScroll = () => {
    const slider = sliderRef.current;
    if (!slider) return;

    const currentScroll = slider.scrollLeft;
    const step = getStep();

    if (currentScroll < step * 0.5) {
      slider.classList.remove('scroll-smooth');
      slider.scrollLeft = currentScroll + step * 3;
      slider.classList.add('scroll-smooth');
    }
    if (currentScroll > step * 3.5) {
      slider.classList.remove('scroll-smooth');
      slider.scrollLeft = currentScroll - step * 3;
      slider.classList.add('scroll-smooth');
    }
  };

  const startDrag = (e) => {
    const slider = sliderRef.current;
    if (!slider) return;
    isDownRef.current = true;
    slider.classList.remove('scroll-smooth');
    const pageX = e.pageX || e.touches?.[0].pageX;
    startXRef.current = pageX - slider.offsetLeft;
    scrollLeftStartRef.current = slider.scrollLeft;
  };

  const endDrag = () => {
    const slider = sliderRef.current;
    if (!slider || !isDownRef.current) return;
    isDownRef.current = false;
    slider.classList.add('scroll-smooth');
    const step = getStep();
    const nearestIndex = Math.round(slider.scrollLeft / step);
    slider.scrollLeft = nearestIndex * step;
  };

  const moveDrag = (e) => {
    const slider = sliderRef.current;
    if (!slider || !isDownRef.current) return;
    if (e.cancelable) e.preventDefault();
    const pageX = e.pageX || e.touches?.[0].pageX;
    const x = pageX - slider.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    slider.scrollLeft = scrollLeftStartRef.current - walk;
  };

  if (pickupPosts.length === 0) return null;

  return (
    <section className="mb-10 overflow-hidden relative">
      <div className="flex items-baseline justify-between mb-3 px-6">
        <h2 className="text-xs font-semibold tracking-wider text-[#6e6e73] uppercase">おすすめ</h2>
      </div>
      
      <div 
        ref={sliderRef}
        onScroll={handleScroll}
        onMouseDown={startDrag}
        onMouseLeave={endDrag}
        onMouseUp={endDrag}
        onMouseMove={moveDrag}
        onTouchStart={startDrag}
        onTouchEnd={endDrag}
        onTouchMove={moveDrag}
        className="flex overflow-x-auto gap-4 no-scrollbar snap-x snap-mandatory scroll-smooth px-6 scroll-px-6 select-none touch-pan-y"
        style={{
          cursor: isDownRef.current ? 'grabbing' : 'grab',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {pickupPosts.map((post, index) => {
          const badges = ['森の散策', '最重要', '夜の記憶', '学校生活', '地域のイベント'];
          const badge = badges[index % badges.length];
          const imageUrls = [
            'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=600&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1599933311603-5188f615456f?q=80&w=600&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1496715976403-7e36dc43f17b?q=80&w=600&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=600&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=600&auto=format&fit=crop'
          ];
          const imgUrl = imageUrls[index % imageUrls.length];

          return (
            <div
              key={`pickup-${post.id}-${index}`}
              onClick={() => router.push(`/posts/${post.id}/stream`)}
              className="loop-card block flex-shrink-0 w-[82%] bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 snap-center cursor-pointer active:scale-[0.99] transition-transform"
            >
              <div 
                className="w-full aspect-[16/10] bg-gray-100 bg-cover bg-center pointer-events-none" 
                style={{ backgroundImage: `url('${imgUrl}')` }}
              />
              <div className="p-5">
                <span className="text-[11px] font-medium text-[#0066cc] block mb-1">{badge}</span>
                <h3 className="text-base font-semibold tracking-tight text-black line-clamp-2">
                  {post.title}
                </h3>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}