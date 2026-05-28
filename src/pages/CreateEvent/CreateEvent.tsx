import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCreateEvent, useClubDetail } from "../../hooks";
import BackHeader from "../../components/BackHeader";

interface FormField {
  label: string;
  required: boolean;
}

export default function CreateEvent() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const clubId = Number(searchParams.get("clubId") ?? "0");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [createDiscordChannel, setCreateDiscordChannel] = useState(false);
  const [channelOption, setChannelOption] = useState<"new" | "existing">("new");
  const [discordChannelId, setDiscordChannelId] = useState("");
  const [fields, setFields] = useState<FormField[]>([
    { label: "참가자 실명", required: true },
    { label: "연락처 (전화번호)", required: true },
    { label: "소속/직무 입력", required: false },
  ]);

  const { data: club } = useClubDetail(clubId);
  const hasDiscord = Boolean(club?.discordGuildId);
  const mutation = useCreateEvent();

  function handleRemoveField(index: number) {
    setFields((prev) => prev.filter((_, i) => i !== index));
  }

  function handleAddField() {
    setFields((prev) => [...prev, { label: "", required: true }]);
  }

  function handleFieldLabelChange(index: number, label: string) {
    setFields((prev) =>
      prev.map((f, i) => (i === index ? { ...f, label } : f)),
    );
  }

  function handleToggleRequired(index: number) {
    setFields((prev) =>
      prev.map((f, i) => (i === index ? { ...f, required: !f.required } : f)),
    );
  }

  function handleSubmit() {
    if (!title.trim() || !date || !time) return;

    const startTime = `${date}T${time}${time.length === 5 ? ":00" : ""}`;

    mutation.mutate(
      {
        clubId,
        title: title.trim(),
        description: description.trim(),
        startTime,
        ...(location.trim() ? { location: location.trim() } : {}),
        createDiscordChannel,
        ...(createDiscordChannel && channelOption === "existing" && discordChannelId.trim()
          ? { discordChannelId: discordChannelId.trim() }
          : {}),
        formFields: fields
          .filter((f) => f.label.trim())
          .map((f) => ({
            type: "TEXT" as const,
            label: f.label.trim(),
            required: f.required,
            options: [],
          })),
      },
      {
        onSuccess: () => navigate(-1),
      },
    );
  }

  return (
    <div className="bg-surface h-full overflow-y-auto pb-32">
      <BackHeader title="새 행사 만들기" />

      <main className="px-5 py-6 space-y-6">
        {/* 기본 정보 */}
        <section className="space-y-3">
          <SectionHeader icon="event_note" title="기본 정보" />
          <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm space-y-4">
            <div>
              <label className="text-xs font-semibold text-on-surface-variant block mb-2">
                행사 이름
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="예: 12월 정기 모임"
                className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-on-surface-variant block mb-2">
                상세 내용
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="행사에 대한 설명을 입력하세요"
                rows={4}
                className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:outline-none resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-on-surface-variant block mb-2">
                  시작 날짜
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-on-surface-variant block mb-2">
                  시작 시간
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 장소 */}
        <section className="space-y-3">
          <SectionHeader icon="location_on" title="장소" />
          <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm">
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="장소를 직접 입력하세요"
              className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>
        </section>

        {/* 디스코드 채널 */}
        <section className="space-y-3">
          <SectionHeader icon="forum" title="디스코드 채널" />
          <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm space-y-4">
            {hasDiscord ? (
              <>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm font-medium text-on-surface">
                    디스코드 채널 연동
                  </span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={createDiscordChannel}
                    onClick={() => setCreateDiscordChannel((v) => !v)}
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      createDiscordChannel ? "bg-primary" : "bg-outline-variant"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-surface rounded-full shadow transition-transform ${
                        createDiscordChannel ? "translate-x-5" : ""
                      }`}
                    />
                  </button>
                </label>

                {createDiscordChannel && (
                  <div className="space-y-3 pt-1">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setChannelOption("new")}
                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                          channelOption === "new"
                            ? "bg-primary text-on-primary"
                            : "bg-surface-container-low text-on-surface-variant"
                        }`}
                      >
                        새 채널 생성
                      </button>
                      <button
                        type="button"
                        onClick={() => setChannelOption("existing")}
                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                          channelOption === "existing"
                            ? "bg-primary text-on-primary"
                            : "bg-surface-container-low text-on-surface-variant"
                        }`}
                      >
                        기존 채널 사용
                      </button>
                    </div>

                    {channelOption === "new" ? (
                      <p className="text-xs text-on-surface-variant">
                        행사 이름으로 새 디스코드 채널이 자동 생성됩니다.
                      </p>
                    ) : (
                      <div>
                        <label className="text-xs font-semibold text-on-surface-variant block mb-2">
                          채널 ID
                        </label>
                        <input
                          type="text"
                          value={discordChannelId}
                          onChange={(e) => setDiscordChannelId(e.target.value)}
                          placeholder="디스코드 채널 ID를 입력하세요"
                          className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
                        />
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-start gap-3 py-1">
                <span className="material-symbols-outlined text-outline text-[20px] mt-0.5">
                  info
                </span>
                <div className="flex-1 space-y-2">
                  <p className="text-sm text-on-surface-variant">
                    디스코드 연동이 설정되지 않았습니다. 모임 설정에서 디스코드
                    서버 ID를 먼저 등록해 주세요.
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate(`/club-settings?clubId=${clubId}`)}
                    className="text-sm text-primary font-medium hover:underline"
                  >
                    모임 설정으로 이동
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 참가자 정보 수집 */}
        <section className="space-y-3">
          <SectionHeader icon="assignment_ind" title="참가자 정보 수집" />
          <div className="space-y-3">
            {fields.map((field, i) => (
              <div
                key={i}
                className={`bg-surface-container-lowest p-4 rounded-xl shadow-sm flex items-center justify-between ${
                  field.required ? "border-l-4 border-primary" : ""
                }`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="material-symbols-outlined text-on-surface-variant shrink-0">
                    drag_indicator
                  </span>
                  {field.label ? (
                    <span className="text-sm truncate">{field.label}</span>
                  ) : (
                    <input
                      type="text"
                      autoFocus
                      placeholder="질문을 입력하세요"
                      className="bg-transparent border-none text-sm focus:outline-none focus:ring-0 p-0 w-full"
                      onBlur={(e) =>
                        handleFieldLabelChange(i, e.target.value)
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleFieldLabelChange(
                            i,
                            (e.target as HTMLInputElement).value,
                          );
                        }
                      }}
                    />
                  )}
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-2">
                  <button
                    type="button"
                    onClick={() => handleToggleRequired(i)}
                    className={`text-xs font-semibold px-2 py-1 rounded active:scale-95 transition-transform ${
                      field.required
                        ? "text-primary bg-primary/10"
                        : "text-on-surface-variant bg-surface-container-high"
                    }`}
                  >
                    {field.required ? "필수" : "선택"}
                  </button>
                  <button
                    onClick={() => handleRemoveField(i)}
                    className="text-outline"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      close
                    </span>
                  </button>
                </div>
              </div>
            ))}

            <button
              onClick={handleAddField}
              className="w-full py-4 border-2 border-dashed border-outline-variant rounded-xl flex items-center justify-center gap-2 text-on-surface-variant hover:bg-surface-container-low transition-colors"
            >
              <span className="material-symbols-outlined">add</span>
              <span className="text-base font-medium">질문 추가하기</span>
            </button>
          </div>
        </section>
      </main>

      {/* 하단 고정 버튼 */}
      <div className="fixed bottom-0 left-0 w-full p-5 bg-surface/70 backdrop-blur-xl z-50">
        <button
          onClick={handleSubmit}
          disabled={mutation.isPending}
          className="w-full bg-gradient-to-br from-primary to-primary-container text-on-primary py-4 rounded-xl text-xl font-semibold shadow-lg active:scale-[0.98] transition-transform disabled:opacity-50"
        >
          {mutation.isPending ? "생성 중..." : "QR코드 생성하기"}
        </button>
      </div>
    </div>
  );
}

function SectionHeader({ icon, title }: { icon: string; title: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="material-symbols-outlined text-primary text-[20px]">
        {icon}
      </span>
      <h2 className="text-xl font-semibold">{title}</h2>
    </div>
  );
}
