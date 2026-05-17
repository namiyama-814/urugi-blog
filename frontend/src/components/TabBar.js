export default function TabBar() {
  return (
    <div className="fixed bottom-5 left-0 right-0 flex justify-center z-50 px-6">
      <nav className="bg-[#ffffff]/80 backdrop-blur-xl border border-[#e8e8ed] rounded-3xl px-2 py-2.5 flex items-center justify-around w-full max-w-sm shadow-sm">
        <button className="flex flex-col items-center w-16 text-[#0066cc]">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5 mb-0.5"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>
          <span className="text-[10px] font-medium tracking-wide">ホーム</span>
        </button>
        <button className="flex flex-col items-center w-16 text-[#6e6e73] hover:text-black transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5 mb-0.5"><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.602 10.602Z" /></svg>
          <span className="text-[10px] font-medium tracking-wide">検索</span>
        </button>
        <button className="flex flex-col items-center w-16 text-[#6e6e73] hover:text-black transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5 mb-0.5"><path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" /></svg>
          <span className="text-[10px] font-medium tracking-wide">お気に入り</span>
        </button>
      </nav>
    </div>
  );
}