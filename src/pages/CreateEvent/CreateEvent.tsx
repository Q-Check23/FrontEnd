import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCreateEvent } from "../../hooks";
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
  const [discordChannelId, setDiscordChannelId] = useState("");
  const [fields, setFields] = useState<FormField[]>([
    { label: "참가자 실명", required: true },
    { label: "연락처 (전화번호)", required: true },
    { label: "소속/직무 입력", required: false },
  ]);

  const mutation = useCreateEvent();

  function handleRemoveField(index: number) {
    setFields((prev) => prev.filter((_, i) => i !== index));
  }

  function handleAddField() {
    setFields((prev) => [...prev, { label: "", required: false }]);
  }

  function handleFieldLabelChange(index: number, label: string) {
    setFields((prev) =>
      prev.map((f, i) => (i === index ? { ...f, label } : f)),
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
        ...(discordChannelId.trim() ? { discordChannelId: discordChannelId.trim() } : {}),
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

        {/* 디스코드 채널 (선택) */}
        <section className="space-y-3">
          <SectionHeader icon="forum" title="디스코드 채널" />
          <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-[#5865F2] text-[18px]">
                forum
              </span>
              <span className="text-xs font-semibold text-on-surface-variant">
                디스코드 채널 ID (선택)
              </span>
            </div>
            <input
              type="text"
              value={discordChannelId}
              onChange={(e) => setDiscordChannelId(e.target.value)}
              placeholder="연결할 디스코드 채널 ID를 입력하세요"
              className="w-full bg-surface-container-low border-none rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
            />
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
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded ${
                      field.required
                        ? "text-primary bg-primary/10"
                        : "text-on-surface-variant bg-surface-container-high"
                    }`}
                  >
                    {field.required ? "필수" : "선택"}
                  </span>
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
