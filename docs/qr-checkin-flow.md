# QR 스캔 → 행사 참여(체크인) 플로우 정리

작성일: 2026-05-29

서비스 외부 기본 카메라 또는 인앱 스캐너로 행사 QR을 스캔했을 때의 처리 흐름과,
관련 백엔드 제약(상태 전이 규칙)을 정리한다. 구현 코드는 `src/pages/Checkin`,
`src/components/EventRegistrationForm.tsx`, `src/pages/QRCheckIn`, `src/pages/QRInfo` 참고.

## QR 종류와 라우트 (의도별로 분리)

| 용도 | 인코딩 값 | 진입 라우트 | 처리 |
|---|---|---|---|
| 사전 등록 링크(원격 공유) | `https://qcheck.asia/register?eventId=X` | `/register` | 등록만 → 행사 상세 |
| 체크인 QR(현장 게시) | `https://qcheck.asia/checkin?eventId=X` | `/checkin` | 4단계 → self check-in → 행사 상세 |

`QRInfo.tsx`에서 복사용 링크 텍스트는 `/register`, QR 코드(`QRCodeSVG value`)는 `/checkin`을 인코딩한다.

### `QCHECK:CHECKIN:{id}` vs URL 방식
- `QCHECK:CHECKIN:{id}`는 앱 내부에서만 의미 있는 자체 문자열. **기본 카메라는 텍스트로만 인식**하여 동작하지 않음.
- URL 방식은 OS·카메라·메신저가 "열기"로 인식 → 브라우저가 `/checkin`을 열고 `ProtectedRoute`/라우터 흐름을 탐.
- "외부 기본 카메라 스캔" 요구사항은 **URL 방식만 성립**한다.
- `QRInfo`는 원래부터 URL을 생성했고, 인앱 스캐너의 `QCHECK:CHECKIN` 파서는 실제 QR과 안 맞는 사실상 죽은 코드였음 → 아래처럼 통일하며 해소.

## 외부 카메라 ↔ 인앱 스캐너 통일

두 경로 모두 `/checkin?eventId=X` **단일 처리 진입점**으로 수렴한다.

```
외부 기본 카메라 → QR(URL) 스캔 → 브라우저가 /checkin?eventId=X 열기 ┐
                                                                   ├▶ /checkin
인앱 스캐너(/qrcheck-in) → QR 스캔 → eventId 추출 → /checkin?eventId=X ┘
                                                                        │
                                       모임 가입 → 사전 등록 → self check-in → /event-info
```

- 인앱 스캐너(`QRCheckIn.tsx`)는 `parseEventIdFromQr()`로 URL에서 `eventId`를 추출하고 `/checkin`으로 `navigate`. (레거시 `QCHECK:CHECKIN:{id}` 포맷은 폴백으로만 인식)
- `QRCheckIn`의 "참가자 직접 등록"(운영진이 이름/전화로 찾아 `manual` 체크인)은 통일 대상이 아닌 별개 기능으로 유지.

## 4단계 플로우와 호출 API

`/checkin`(`Checkin.tsx`)이 사용자 상태에 따라 분기. 공통 UI(가입 모달 + 등록 폼)는
`EventRegistrationForm.tsx`로 추출됨. `/register`도 같은 컴포넌트를 사용.

| 케이스 | 상태 | 동작 | 호출 순서 |
|---|---|---|---|
| 1 | 미회원 | 로그인/회원가입 후 원래 URL 복귀 | `ProtectedRoute` → `setAuthNext`/`consumeAuthNext` (기존 메커니즘) |
| 2 | 모임 미가입 | 가입 모달 → 등록 폼 → 체크인 | `POST /clubs/join-via-event/{id}` → `POST /events/{id}/registrations` → `POST /attendance/self-check-in` |
| 3 | 미등록 | 등록 폼 → 체크인 | `POST /events/{id}/registrations` → `POST /attendance/self-check-in` |
| 4 | 이미 등록 | 자동 체크인(1회 가드) | `POST /attendance/self-check-in` (이미 `CHECKED_IN`이면 호출 없이 안내만) |

- self check-in 요청 바디: `{ "eventId": <Long> }` (`/api/attendance/self-check-in`). 백엔드가 토큰의 로그인 사용자 + `(eventId, user)` 등록건으로 처리.
- **시간 게이팅 없음**: self check-in 서비스 로직에 행사 시작 시각 기준 제한이 없어 등록만 되어 있으면 언제든 체크인 가능. (프론트 `EventInfo.tsx`의 30분 컷오프는 버튼 노출용 UI 로직일 뿐)
- 체크인 실패 시에도 등록은 유지되므로 에러 토스트 후 `/event-info`로 이동(상세에서 상태 확인/재시도 가능).

## 등록 상태 머신 (백엔드 제약)

`RegistrationStatus`: `REGISTERED`, `CANCELED`, `CHECKED_IN`. 상태 전이는 백엔드 3곳에서만 발생.

```
REGISTERED ──check-in──▶ CHECKED_IN   (종착, 빠져나갈 수 없음)
REGISTERED ──cancel────▶ CANCELED      (행사 시작 전 & REGISTERED 일 때만)
CHECKED_IN ──▶ ✗                       (해제/취소/되돌리기 엔드포인트 없음)
CANCELED   ──▶ ✗                       (재등록도 막힘 — 아래 참고)
```

| 전이 | 위치 |
|---|---|
| → `CHECKED_IN` | `AttendanceService.java:76, 125` (check-in / self / manual) |
| → `CANCELED` | `RegistrationService.java:116` (`cancelMyRegistration`) |

체크인 취소 시도는 `cancelMyRegistration`이 막는다:
```java
if (registration.getStatus() == RegistrationStatus.CHECKED_IN)
    throw new AppException(ErrorCode.CONFLICT, "Cannot cancel a checked-in registration");
```
프론트 `EventInfo.tsx`도 `isCheckedIn`이면 "입장 완료"만 표시하고 불참·등록취소 버튼을 숨겨 일관됨.

## 알려진 빈틈 (백엔드 정책 결정 사항, 미수정)

### 1. CANCELED → 재등록 차단 (QR 재스캔 시 막다른 길)
`RegistrationService.createRegistration`의 중복 체크가 **status 무관**으로 동작하고,
취소는 행을 삭제하지 않고 상태만 바꾸므로 CANCELED 행이 남아 재등록을 막는다.
```java
// RegistrationService.java:70
if (registrationRepository.existsByEvent_IdAndUser_Id(eventId, currentUserId))
    throw new AppException(ErrorCode.CONFLICT, "Already registered for this event");
```
영향: 취소한 사용자가 체크인 QR을 다시 스캔하면 프론트는 미등록으로 보고 폼을 띄우지만,
제출 시 409로 실패. 재참여 불가.
해결안: `createRegistration`에서 기존 행이 CANCELED면 throw 대신 `REGISTERED`로 되살리기(권장),
또는 별도 재활성화 엔드포인트.

### 2. 체크인 실수 정정 불가
`CHECKED_IN`을 되돌리는 경로가 본인·운영진 모두 없다(`CHECKED_IN → REGISTERED`/해제 엔드포인트 부재).
의도된 정책이면 유지, 정정이 필요하면 운영진용 체크인 해제 엔드포인트 추가 필요.

## 이번 작업으로 변경된 파일 (프론트)

| 파일 | 변경 |
|---|---|
| `src/components/EventRegistrationForm.tsx` | 신규. 가입 모달 + 등록 폼 공용 컴포넌트 |
| `src/pages/Checkin/Checkin.tsx` | 신규. 4단계 → self check-in → `/event-info` |
| `src/pages/Register/Register.tsx` | 공용 컴포넌트 사용 + 제출 후 `/qr-info`(운영진 전용, 버그) → `/event-info` 수정 |
| `src/pages/QRCheckIn/QRCheckIn.tsx` | 스캔 시 `/checkin`으로 위임(통일). 자체 self check-in/에러 모달 제거, 운영진 직접 등록 유지 |
| `src/pages/QRInfo/QRInfo.tsx` | QR 코드 인코딩을 `/checkin?eventId=`로 분리(복사용 링크 텍스트는 `/register` 유지) |
| `src/App.tsx` | `/checkin` 라우트 추가(ProtectedRoute 하위) |
