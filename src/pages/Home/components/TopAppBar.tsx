interface TopAppBarProps {
  profileImageUrl?: string;
}

export default function TopAppBar({ profileImageUrl }: TopAppBarProps) {
  return (
    <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant/20 shadow-sm">
      <div className="flex items-center justify-between px-5 h-16 w-full">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary">
            qr_code_scanner
          </span>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Q-check
          </h1>
        </div>
        <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-primary/20">
          {profileImageUrl ? (
            <img
              src={profileImageUrl}
              alt="프로필"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-surface-container-high flex items-center justify-center">
              <span className="material-symbols-outlined text-on-surface-variant text-sm">
                person
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
