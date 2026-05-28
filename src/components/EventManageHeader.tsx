import { useSearchParams } from "react-router-dom";
import { useEventDetail } from "../hooks";
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
  const backTo = event ? `/group-events?clubId=${event.clubId}` : undefined;

  return (
    <>
      <BackHeader title="행사 상세 설정" backTo={backTo} />
      <EventManageTabs activeTab={activeTab} />
    </>
  );
}
