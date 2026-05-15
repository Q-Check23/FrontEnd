import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMyClubs } from "../../hooks";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorFallback from "../../components/ErrorFallback";
import ClubCard from "./components/ClubCard";

export default function Meeting() {
  const navigate = useNavigate();
  const { data: clubs = [], isLoading, isError, refetch } = useMyClubs();
  const [query, setQuery] = useState("");

  const filtered = query.trim()
    ? clubs.filter((c) =>
        c.clubName.toLowerCase().includes(query.trim().toLowerCase()),
      )
    : clubs;

  return (
    <>
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant/20 shadow-sm">
        <div className="flex items-center justify-between px-5 h-16 w-full">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-2xl">
              qr_code_scanner
            </span>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Q-check
            </h1>
          </div>
        </div>
      </header>

      <main className="pt-20 px-5">
        {/* 검색바 */}
        <section className="mt-4 mb-6">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
              search
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="모임 검색"
              className="w-full h-12 pl-12 pr-4 bg-surface-container-low border-none rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-on-surface-variant/60"
            />
          </div>
        </section>

        {/* FAB - 모임 생성 */}
        <button
          onClick={() => navigate("/create-club")}
          className="fixed bottom-24 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary-container text-white shadow-lg flex items-center justify-center z-50 active:scale-90 transition-transform"
        >
          <span
            className="material-symbols-outlined text-[28px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            add
          </span>
        </button>

        {/* 모임 목록 */}
        <div className="flex flex-col gap-5 pb-24">
          {isLoading ? (
            <LoadingSpinner />
          ) : isError ? (
            <ErrorFallback onRetry={refetch} />
          ) : filtered.length === 0 ? (
            <p className="text-sm text-on-surface-variant py-8 text-center">
              {query.trim() ? "검색 결과가 없습니다" : "가입한 모임이 없습니다"}
            </p>
          ) : (
            filtered.map((club) => (
              <ClubCard
                key={club.clubId}
                club={club}
                onClick={() =>
                  navigate(`/group-notice?clubId=${club.clubId}&role=${club.myRole}`)
                }
              />
            ))
          )}
        </div>
      </main>
    </>
  );
}
