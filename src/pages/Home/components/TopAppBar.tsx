export default function TopAppBar() {
  return (
    <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant/20 shadow-sm">
      <div className="flex items-center px-5 h-16 w-full">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary">
            qr_code_scanner
          </span>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Q-check
          </h1>
        </div>
      </div>
    </header>
  );
}
