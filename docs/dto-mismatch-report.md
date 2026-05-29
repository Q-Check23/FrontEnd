# 백엔드 ↔ 프론트엔드 DTO 불일치 정리

작성일: 2026-05-29

QCheck_Backend(Spring, Java record DTO)와 QCheck_Frontend(`src/api/*.ts`) 간 DTO를
도메인별로 대조한 결과. 양쪽 모두 camelCase JSON 직렬화를 사용한다.

> 현재 동작에 치명적 장애는 없어 즉시 수정 없이 기록만 남긴다. 추후 정리 시 참고.

## 🔴 런타임 버그로 이어지는 불일치

### 1. Event — `endTime` / `registerFee` 가 프론트에 통째로 누락
백엔드 event DTO 전반에 `endTime`(String), `registerFee`(BigDecimal)가 존재하나
프론트 `src/api/events.ts` 어디에도 정의가 없다.

| 백엔드 DTO | 프론트 타입 | 누락 필드 |
|---|---|---|
| `CreateEventRequestDto` | `CreateEventRequest` | `endTime`, `registerFee` |
| `UpdateEventRequestDto` | `UpdateEventRequest` | `endTime`, `registerFee` |
| `EventDetailResponseDto` | `EventDetail` / `EventDetailResponse` | `endTime`, `registerFee` |
| `EventListItemDto` | `EventSummary` / `EventSummaryResponse` | `endTime`, `registerFee` |

영향: 행사 생성/수정 시 종료시간·참가비가 전송되지 않고, 상세/목록에서도 표시 불가.

### 2. Club 생성 응답 — 필드명이 전부 다름 (값이 `undefined`)
`POST /clubs` 백엔드는 `MyClubResponseDto`를 반환하는데 프론트는 `ClubResponse`로 타이핑됨.

```
BE 응답:  { clubId, clubName, clubDescription, myRole }   (MyClubResponseDto)
FE 타입:  { id, name, description }                        (ClubResponse, src/api/clubs.ts:42)
```

영향: `createClub()` 결과의 `.id` / `.name` / `.description` 은 런타임에 전부 `undefined`.
필드명을 `clubId/clubName/clubDescription`로 맞추고 `myRole` 추가 필요.
(`getMyClubs`/`getClubDetail`는 올바른 이름을 사용 중 — `createClub`만 어긋남)

## 🟡 누락된 연동 (백엔드만 존재)

- **Settlement 도메인 전체 미연동** — 백엔드에 컨트롤러 + DTO 5종
  (`CreateSettlementRequestDto`, `SettlementResponseDto`, `SettlementSummaryDto`,
  `SettlementItemResponseDto`, `SettlementGroupRequestDto`)이 있으나 프론트에 관련 코드 0건.
- **`POST /clubs/join`** (초대코드 가입, `JoinClubRequestDto.inviteCode`) — 프론트 미구현.
  (프론트 `joinClubViaEvent`는 별개 엔드포인트 `/join-via-event/{eventId}`로 정상 동작)
- **`GET /clubs/{clubId}/invite-code`** — 프론트 미구현.

## 🟢 경미 (동작엔 문제없으나 정리 권장)

- `UpdateClubRequest`(FE) 전 필드 optional ↔ `UpdateClubRequestDto`(BE) 전 필드 필수.
  PUT 전체 교체 의미상, 일부 필드만 보내면 BE에서 누락 필드가 null이 될 수 있음.
- Notice: `createNotice` FE 응답 타입이 `{ noticeId }`뿐, `updateNotice`는 `void`지만
  BE는 둘 다 전체 `NoticeResponseDto` 반환 (FE가 나머지 필드를 버릴 뿐, 깨지진 않음).
- Club `addClubMember` / `updateClubMemberRole`: FE `void` ↔ BE `ClubMemberResponseDto` 반환 (응답 무시).
- 방어적 nullable 차이: `MyProfileResponse`, `ClubDetailResponse.discordGuildId`, 캘린더 필드 —
  BE는 non-null 선언이나 FE가 `string | null`로 받아 정규화. 버그 아님.

## 일치 확인된 영역

- identity(auth/user): 모든 요청/응답 필드 일치 (방어적 nullable 외)
- attendance / event registration: 전부 일치
- discord(`/bot-invite-url`): 일치
