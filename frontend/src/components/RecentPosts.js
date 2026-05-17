'use client';

import { useRouter } from 'next/navigation';

export default function RecentPosts({ posts }) {
  const router = useRouter();

  return (
    <section className="mb-8 px-5">
      <div className="flex items-baseline justify-between mb-3 px-1">
        <h2 className="text-xs font-semibold tracking-wider text-[#6e6e73] uppercase">最近の更新</h2>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm divide-y divide-[#e8e8ed]">
        {posts.map((post) => (
          <div 
            key={post.id}
            onClick={() => router.push(`/posts/${post.id}/stream`)}
            className="flex items-center justify-between p-4 bg-white hover:bg-gray-50 active:bg-gray-100 transition-colors duration-200 group cursor-pointer"
          >
            <div className="space-y-0.5">
              <span className="text-xs text-[#86868b] block tabular-nums">
                {post.date ? post.date.replace(/^\d{4}-/, '').replace('-', '.') : '05.17'}
              </span>
              <h3 className="text-base font-normal tracking-tight text-[#1d1d1f] group-hover:text-[#0066cc] transition-colors">
                {post.title}
              </h3>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4 text-gray-300">
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </div>
        ))}
      </div>
    </section>
  );
}