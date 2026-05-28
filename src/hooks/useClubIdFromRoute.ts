import { useSearchParams } from "react-router-dom";
import { useEventDetail } from "./queries/useEventDetail";

function parseId(value: string | null): number | undefined {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

export function useClubIdFromRoute(): {
  clubId: number | undefined;
  isResolving: boolean;
} {
  const [searchParams] = useSearchParams();
  const directClubId = parseId(searchParams.get("clubId"));
  const eventId = parseId(searchParams.get("eventId"));

  const eventQuery = useEventDetail(
    directClubId === undefined && eventId !== undefined ? eventId : 0,
  );

  if (directClubId !== undefined) {
    return { clubId: directClubId, isResolving: false };
  }

  if (eventId !== undefined) {
    return {
      clubId: eventQuery.data?.clubId,
      isResolving: eventQuery.isLoading,
    };
  }

  return { clubId: undefined, isResolving: false };
}
