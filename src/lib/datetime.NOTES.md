# 시각 표시 KST(+9h) 보정 — 적용 범위 메모

서버가 타임존 없는 UTC `LocalDateTime` 을 내려주기 때문에, 프론트에서 서버 시각
문자열을 파싱할 때 `parseKST()` (`src/lib/datetime.ts`) 로 9시간을 더해 한국 시간으로
표시한다.

> ⚠️ 임시 보정이다. 근본 원인은 서버 JVM 이 UTC 라는 점이며, 백엔드 타임존을
> 정리하면 여기 `parseKST` 호출들을 같이 걷어내야 한다. 그렇지 않으면 이중 보정된다.

## 적용한 곳 (서버 시각 문자열 → `parseKST`)

- `pages/EventParticipants/EventParticipants.tsx` — QR/수동 체크인 시각
- `pages/DashBoard/DashBoard.tsx` — 행사 일시
- `pages/EventInfo/EventInfo.tsx` — 행사 날짜·시간 + 등록 마감 30분 컷오프 계산
- `pages/GroupEvents/components/EventCard.tsx` — 행사 목록 날짜·시간
- `pages/Home/components/EventSearchCard.tsx` — 검색 결과 날짜
- `pages/Home/components/ScheduleList.tsx` — 일정 목록 시간 (`formatTime` 만)
- `pages/Home/Home.tsx` — 캘린더 day 버킷팅 (표시 시간과 같은 날짜에 묶이도록)
- `pages/GroupNotice/GroupNotice.tsx` — 공지 "N분 전"
- `pages/NoticeDetail/NoticeDetail.tsx` — 공지 작성 날짜·시간

## 일부러 건드리지 않은 곳

### 서버 시각이 아닌 Date 생성 — 보정하면 오히려 깨짐
- `pages/Home/components/Calendar.tsx` (line 16, 30, 31, 32)
  — `new Date(year, month-1, …)` 숫자 기반 달력 격자 계산. 시각 표시가 아니다.
- `pages/Home/components/ScheduleList.tsx` (line 13 `formatDateHeading`)
  — `new Date(year, month-1, day)` 숫자 기반 날짜 헤딩.
- `pages/Home/Home.tsx` (line 14)
  — `new Date()` 오늘 날짜(로컬 현재 시각). 서버 값 아님.

### 양방향 read/write 경로 — 별도 처리 필요
- `pages/EditEvent/EditEvent.tsx`
  - `splitDateTime` (line 11): 서버 `startTime` 을 수정 폼 입력칸으로 분해
  - `handleSubmit` (line 85): 입력값을 `new Date(\`${date}T${time}\`).toISOString()` 로
    다시 UTC(Z 접미사) 변환해 전송
  - 읽기에만 +9h 를 넣으면 저장 경로의 `.toISOString()` 변환과 어긋나 데이터가
    틀어진다. 표시 버그와 성격이 다른 read/write 정합성 문제라 분리해서 다뤄야 한다.
