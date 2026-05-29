const KST_OFFSET_MS = 9 * 60 * 60 * 1000;

/**
 * 백엔드가 타임존 없는 UTC 시각(LocalDateTime)을 내려주므로,
 * 화면 표시 전에 9시간(KST)을 더해 한국 시간으로 보정한다.
 *
 * 숫자 인자로 Date 를 만드는 곳(달력 격자 등)에는 쓰지 말 것 — 서버에서 받은
 * 시각 문자열에만 적용한다.
 */
export function parseKST(value: string): Date {
  return new Date(new Date(value).getTime() + KST_OFFSET_MS);
}
