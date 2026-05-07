/**
 * Mock data for UI preview.
 * API 호출이 실패할 때 fallback으로 사용됩니다.
 * API가 정상 동작하면 이 데이터는 사용되지 않습니다.
 */

import type { CalendarClubGroup } from "../api/calendar";
import type { ClubSummary } from "../api/clubs";
import type {
  EventDetail,
  EventListPage,
  EventRegistration,
} from "../api/events";
import type { MyProfile } from "../api/users";

/* ── 현재 날짜 기준으로 동적 날짜 생성 ── */
function dateStr(dayOffset: number, hour = 14, minute = 0) {
  const d = new Date();
  d.setDate(d.getDate() + dayOffset);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

function thisMonth(day: number, hour = 14, minute = 0) {
  const d = new Date();
  d.setDate(day);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

/* ── Calendar ── */
export const mockCalendarGroups: CalendarClubGroup[] = [
  {
    clubId: 1,
    clubName: "KUIT",
    events: [
      {
        eventId: 1,
        eventTitle: "6기 데모데이",
        clubId: 1,
        clubName: "KUIT",
        location: "고려대학교 하나스퀘어 B1",
        startTime: thisMonth(10, 14, 0),
      },
      {
        eventId: 2,
        eventTitle: "네트워킹 세미나",
        clubId: 1,
        clubName: "KUIT",
        location: "고려대학교 중앙광장 세미나실",
        startTime: thisMonth(15, 18, 30),
      },
      {
        eventId: 5,
        eventTitle: "신규 기수 OT",
        clubId: 1,
        clubName: "KUIT",
        location: "고려대학교 라이시움 301호",
        startTime: thisMonth(22, 15, 0),
      },
    ],
  },
  {
    clubId: 2,
    clubName: "멋쟁이사자처럼",
    events: [
      {
        eventId: 3,
        eventTitle: "해커톤 킥오프",
        clubId: 2,
        clubName: "멋쟁이사자처럼",
        location: "서울 강남 코엑스 컨퍼런스룸",
        startTime: thisMonth(12, 10, 0),
      },
      {
        eventId: 6,
        eventTitle: "중간 발표회",
        clubId: 2,
        clubName: "멋쟁이사자처럼",
        location: "홍대 카페 스터디룸",
        startTime: thisMonth(20, 19, 0),
      },
    ],
  },
  {
    clubId: 3,
    clubName: "UMC",
    events: [
      {
        eventId: 4,
        eventTitle: "스프링 워크숍",
        clubId: 3,
        clubName: "UMC",
        location: "건국대학교 공학관 201호",
        startTime: thisMonth(18, 13, 0),
      },
      {
        eventId: 7,
        eventTitle: "프론트엔드 스터디",
        clubId: 3,
        clubName: "UMC",
        location: "건국대학교 도서관 세미나실",
        startTime: thisMonth(25, 16, 0),
      },
    ],
  },
];

/* ── Clubs ── */
export const mockClubs: ClubSummary[] = [
  {
    clubId: 1,
    clubName: "KUIT",
    clubDescription:
      "고려대학교 IT 동아리. 웹/앱 개발 프로젝트를 진행합니다.",
    myRole: "ADMIN",
  },
  {
    clubId: 2,
    clubName: "멋쟁이사자처럼",
    clubDescription:
      "전국 대학생 IT 창업 동아리. 아이디어를 현실로 만들어갑니다.",
    myRole: "MEMBER",
  },
  {
    clubId: 3,
    clubName: "UMC",
    clubDescription:
      "University MakeUs Challenge. 앱/서버 개발 연합 동아리입니다.",
    myRole: "MEMBER",
  },
  {
    clubId: 4,
    clubName: "GDSC Korea Univ.",
    clubDescription:
      "Google Developer Student Clubs. 구글 기술을 활용한 프로젝트를 합니다.",
    myRole: "MEMBER",
  },
];

/* ── Profile ── */
export const mockProfile: MyProfile = {
  id: 1,
  username: "yuna.jung@korea.ac.kr",
  realName: "정윤아",
};

export const mockProfileStats = {
  attendedEvents: 12,
  upcomingEvents: 3,
};

/* ── Event Detail ── */
export const mockEventDetail: EventDetail = {
  eventId: 1,
  clubId: 1,
  title: "KUIT 6기 데모데이",
  startTime: thisMonth(10, 14, 0),
  location: "고려대학교 하나스퀘어 B1",
  isActive: true,
  formFields: [
    {
      id: 1,
      type: "TEXT",
      label: "이름",
      required: true,
      options: [],
    },
    {
      id: 2,
      type: "TEXT",
      label: "학번",
      required: true,
      options: [],
    },
    {
      id: 3,
      type: "SELECT",
      label: "소속 파트",
      required: true,
      options: ["프론트엔드", "백엔드", "디자인", "PM"],
    },
    {
      id: 4,
      type: "TEXT",
      label: "특이사항",
      required: false,
      options: [],
    },
  ],
};

/* ── Event List ── */
export const mockEventList: EventListPage = {
  page: 0,
  size: 10,
  totalPages: 1,
  totalElements: 5,
  items: [
    {
      eventId: 1,
      title: "KUIT 6기 데모데이",
      startTime: dateStr(3, 14, 0),
      location: "고려대학교 하나스퀘어 B1",
      isActive: true,
    },
    {
      eventId: 2,
      title: "네트워킹 세미나",
      startTime: dateStr(8, 18, 30),
      location: "고려대학교 중앙광장 세미나실",
      isActive: true,
    },
    {
      eventId: 3,
      title: "해커톤 킥오프",
      startTime: dateStr(5, 10, 0),
      location: "서울 강남 코엑스 컨퍼런스룸",
      isActive: true,
    },
    {
      eventId: 4,
      title: "스프링 워크숍",
      startTime: dateStr(11, 13, 0),
      location: "건국대학교 공학관 201호",
      isActive: true,
    },
    {
      eventId: 5,
      title: "프론트엔드 스터디",
      startTime: dateStr(15, 16, 0),
      location: "건국대학교 도서관 세미나실",
      isActive: false,
    },
  ],
};

/* ── Event Registrations (for Dashboard / Participants) ── */
export const mockRegistrations: EventRegistration[] = [
  {
    registrationId: 1,
    userId: 1,
    username: "정윤아",
    status: "CHECKED_IN",
    qrToken: "qr-token-001",
    answers: [
      { fieldId: 1, label: "이름", value: "정윤아" },
      { fieldId: 2, label: "학번", value: "2021320001" },
      { fieldId: 3, label: "소속 파트", value: "프론트엔드" },
    ],
  },
  {
    registrationId: 2,
    userId: 2,
    username: "김민수",
    status: "CHECKED_IN",
    qrToken: "qr-token-002",
    answers: [
      { fieldId: 1, label: "이름", value: "김민수" },
      { fieldId: 2, label: "학번", value: "2022320045" },
      { fieldId: 3, label: "소속 파트", value: "백엔드" },
    ],
  },
  {
    registrationId: 3,
    userId: 3,
    username: "이지수",
    status: "REGISTERED",
    qrToken: "qr-token-003",
    answers: [
      { fieldId: 1, label: "이름", value: "이지수" },
      { fieldId: 2, label: "학번", value: "2023320012" },
      { fieldId: 3, label: "소속 파트", value: "디자인" },
    ],
  },
  {
    registrationId: 4,
    userId: 4,
    username: "박준현",
    status: "CHECKED_IN",
    qrToken: "qr-token-004",
    answers: [
      { fieldId: 1, label: "이름", value: "박준현" },
      { fieldId: 2, label: "학번", value: "2021320078" },
      { fieldId: 3, label: "소속 파트", value: "프론트엔드" },
    ],
  },
  {
    registrationId: 5,
    userId: 5,
    username: "최아름",
    status: "REGISTERED",
    qrToken: "qr-token-005",
    answers: [
      { fieldId: 1, label: "이름", value: "최아름" },
      { fieldId: 2, label: "학번", value: "2022320089" },
      { fieldId: 3, label: "소속 파트", value: "PM" },
    ],
  },
  {
    registrationId: 6,
    userId: 6,
    username: "강동훈",
    status: "REGISTERED",
    qrToken: "qr-token-006",
    answers: [
      { fieldId: 1, label: "이름", value: "강동훈" },
      { fieldId: 2, label: "학번", value: "2023320034" },
      { fieldId: 3, label: "소속 파트", value: "백엔드" },
    ],
  },
  {
    registrationId: 7,
    userId: 7,
    username: "윤지환",
    status: "CHECKED_IN",
    qrToken: "qr-token-007",
    answers: [
      { fieldId: 1, label: "이름", value: "윤지환" },
      { fieldId: 2, label: "학번", value: "2021320056" },
      { fieldId: 3, label: "소속 파트", value: "백엔드" },
    ],
  },
];

/* ── Dashboard Stats ── */
export const mockDashboardStats = {
  totalRegistrations: mockRegistrations.length,
  checkedIn: mockRegistrations.filter((r) => r.status === "CHECKED_IN").length,
  lastCheckInName: "윤지환",
  lastCheckInTime: "2분 전",
};
