import { useEffect, useState } from "react";
import { searchUsers, type UserSearchResult } from "../../../api/users";

interface AddMemberSheetProps {
  open: boolean;
  existingUserIds: number[];
  isAdding: boolean;
  onAdd: (user: UserSearchResult) => Promise<void> | void;
  onClose: () => void;
}

export default function AddMemberSheet({
  open,
  existingUserIds,
  isAdding,
  onAdd,
  onClose,
}: AddMemberSheetProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<UserSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setResults([]);
      setErrorMessage(null);
      return;
    }
  }, [open]);

  useEffect(() => {
    const trimmed = query.trim();
    if (!open || trimmed.length === 0) {
      setResults([]);
      setErrorMessage(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      setErrorMessage(null);
      try {
        const data = await searchUsers({ nickname: trimmed });
        setResults(data);
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "사용자 검색에 실패했어요",
        );
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [open, query]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/40 flex items-end justify-center"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-surface rounded-t-2xl pb-6 pt-3 px-4 max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto w-10 h-1 bg-outline-variant rounded-full mb-3" />
        <h3 className="text-lg font-semibold text-on-surface mb-3">멤버 추가</h3>

        <div className="flex items-center gap-2 bg-surface-container-low px-4 py-2 rounded-full mb-3 border border-outline-variant/20">
          <span className="material-symbols-outlined text-on-surface-variant text-[20px]">
            search
          </span>
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="닉네임으로 검색"
            className="bg-transparent border-none focus:outline-none focus:ring-0 text-sm w-full p-0"
          />
        </div>

        <ul className="flex-1 overflow-y-auto flex flex-col gap-2">
          {errorMessage ? (
            <li className="text-sm text-red-600 py-6 text-center">{errorMessage}</li>
          ) : isSearching ? (
            <li className="text-sm text-on-surface-variant py-6 text-center">
              검색 중...
            </li>
          ) : query.trim().length === 0 ? (
            <li className="text-sm text-on-surface-variant py-6 text-center">
              닉네임을 입력해 사용자를 검색하세요
            </li>
          ) : results.length === 0 ? (
            <li className="text-sm text-on-surface-variant py-6 text-center">
              검색 결과가 없습니다
            </li>
          ) : (
            results.map((user) => {
              const alreadyMember = existingUserIds.includes(user.userId);
              return (
                <li
                  key={user.userId}
                  className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/10"
                >
                  <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-on-surface-variant">
                      person
                    </span>
                  </div>
                  <div className="grow min-w-0">
                    <p className="text-sm font-semibold text-on-surface truncate">
                      {user.username}
                    </p>
                    {user.realName && (
                      <p className="text-xs text-on-surface-variant truncate">
                        {user.realName}
                      </p>
                    )}
                  </div>
                  <button
                    disabled={alreadyMember || isAdding}
                    onClick={() => onAdd(user)}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold bg-primary text-white disabled:bg-surface-container disabled:text-on-surface-variant active:scale-95 transition-transform"
                  >
                    {alreadyMember ? "이미 멤버" : isAdding ? "추가 중..." : "추가"}
                  </button>
                </li>
              );
            })
          )}
        </ul>

        <button
          onClick={onClose}
          disabled={isAdding}
          className="w-full mt-3 py-3 text-on-surface-variant text-sm font-semibold rounded-xl active:bg-surface-container disabled:opacity-50"
        >
          닫기
        </button>
      </div>
    </div>
  );
}
