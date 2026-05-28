import { useSearchParams } from "react-router-dom";
import { useEventDetail, useMyClubs } from "../hooks";
import BackHeader from "./BackHeader";
import EventManageTabs from "./EventManageTabs";

type TabKey = "qr" | "dashboard" | "participants";

interface EventManageHeaderProps {
  activeTab: TabKey;
}

export default function EventManageHeader({ activeTab }: EventManageHeaderProps) {
  const [searchParams] = useSearchParams();
  const eventId = Number(searchParams.get("eventId"));
  const { data: event } = useEventDetail(eventId);
  const { data: clubs = [] } = useMyClubs();
  const currentClub = event ? clubs.find((c) => c.clubId === event.clubId) : undefined;
  const backTo = event ? `/group-events?clubId=${event.clubId}&role=${currentClub?.myRole ?? "MEMBER"}` : undefined;

  return (
    <>
      <BackHeader title="행사 상세 설정" backTo={backTo} />
      <EventManageTabs activeTab={activeTab} />
    </>
  );
}
