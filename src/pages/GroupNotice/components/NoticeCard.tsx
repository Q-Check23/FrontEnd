interface NoticeCardProps {
  author: string;
  isAdmin: boolean;
  timeAgo: string;
  title: string;
  content: string;
}

export default function NoticeCard({
  author,
  isAdmin,
  timeAgo,
  title,
  content,
}: NoticeCardProps) {
  return (
    <article className="bg-surface-container-lowest rounded-xl p-4 shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-outline-variant/10 active:scale-[0.98] transition-transform">
      <div className="flex items-center gap-3 mb-3">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-bold text-on-surface">{author}</span>
            {isAdmin && (
              <span className="px-2 py-0.5 bg-secondary-container/20 text-secondary text-[10px] font-bold rounded-full uppercase tracking-wider">
                운영진
              </span>
            )}
          </div>
          <p className="text-[11px] text-on-surface-variant/60">{timeAgo}</p>
        </div>
        <button className="ml-auto material-symbols-outlined text-on-surface-variant text-base">
          more_horiz
        </button>
      </div>
      <h3 className="text-xl font-semibold text-on-surface mb-2">{title}</h3>
      <p className="text-sm text-on-surface-variant line-clamp-3">{content}</p>
    </article>
  );
}
