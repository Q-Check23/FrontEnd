import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getMyClubs, type ClubSummary } from "../../api/clubs";
import {
  createEvent,
  type CreateEventFormField,
  type EventFormFieldType,
} from "../../api/events";
import BottomBar from "../../components/BottomBar";
import CreateEventHeader from "../../components/CreateEventHeader";
import GradientButton from "../../components/GradientButton";
import TopSpace from "../../components/TopSpace";
import { ToastContext } from "../../context/ToastContext";

type ToastValue = {
  push: (message: string) => void;
};

type DraftField = {
  id: string;
  type: EventFormFieldType;
  label: string;
  required: boolean;
  optionsText: string;
};

function FieldCard({
  field,
  onChange,
  onRemove,
}: {
  field: DraftField;
  onChange: (id: string, next: Partial<DraftField>) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="rounded-2xl border border-[#e6e6e6] bg-white px-4 py-4 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-[#f0ebfa] px-3 py-1 text-xs font-semibold text-[#702f95]">
            {field.type}
          </span>
          <button
            type="button"
            onClick={() =>
              onChange(field.id, { type: field.type === "TEXT" ? "SELECT" : "TEXT" })
            }
            className="text-xs font-medium text-[#666666]"
          >
            형식 변경
          </button>
        </div>
        <button
          type="button"
          onClick={() => onRemove(field.id)}
          className="text-sm font-medium text-[#d93025]"
        >
          삭제
        </button>
      </div>

      <div className="mt-4">
        <label className="mb-2 block text-xs font-medium text-[#666666]">
          질문 라벨
        </label>
        <input
          type="text"
          value={field.label}
          onChange={(event) =>
            onChange(field.id, { label: event.target.value })
          }
          placeholder="예: 학번"
          className="h-11 w-full rounded-xl border border-[#d5d5d5] px-4 outline-none focus:border-[#702f95]"
        />
      </div>

      {field.type === "SELECT" ? (
        <div className="mt-4">
          <label className="mb-2 block text-xs font-medium text-[#666666]">
            선택지
          </label>
          <textarea
            value={field.optionsText}
            onChange={(event) =>
              onChange(field.id, { optionsText: event.target.value })
            }
            placeholder={"한 줄에 하나씩 입력하거나 쉼표로 구분하세요\n예: 한식, 양식, 샐러드"}
            className="min-h-[96px] w-full rounded-xl border border-[#d5d5d5] px-4 py-3 outline-none focus:border-[#702f95]"
          />
        </div>
      ) : null}

      <label className="mt-4 flex items-center gap-2 text-sm font-medium text-[#111111]">
        <input
          type="checkbox"
          checked={field.required}
          onChange={(event) =>
            onChange(field.id, { required: event.target.checked })
          }
          className="h-4 w-4"
        />
        필수 응답
      </label>
    </div>
  );
}

function buildStartTime(date: string, time: string) {
  return `${date}T${time}:00`;
}

function parseOptions(optionsText: string) {
  return optionsText
    .split(/\n|,/)
    .map((option) => option.trim())
    .filter(Boolean);
}

export default function CreateEvent() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const toast = useContext(ToastContext) as ToastValue | null;
  const [clubs, setClubs] = useState<ClubSummary[]>([]);
  const [isLoadingClubs, setIsLoadingClubs] = useState(true);
  const [selectedClubId, setSelectedClubId] = useState("");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("19:00");
  const [fields, setFields] = useState<DraftField[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadClubs = async () => {
      setIsLoadingClubs(true);

      try {
        const nextClubs = await getMyClubs();
        setClubs(nextClubs);

        const clubIdFromQuery = searchParams.get("clubId");
        const singleClub = nextClubs.length === 1 ? nextClubs[0] : null;
        const nextSelectedClubId =
          clubIdFromQuery && nextClubs.some((club) => String(club.clubId) === clubIdFromQuery)
            ? clubIdFromQuery
            : singleClub
              ? String(singleClub.clubId)
              : "";

        setSelectedClubId(nextSelectedClubId);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "클럽 목록을 불러오지 못했습니다.";
        toast?.push(message);
      } finally {
        setIsLoadingClubs(false);
      }
    };

    const today = new Date();
    const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 10);
    setDate(localDate);

    void loadClubs();
  }, [searchParams, toast]);

  const handleFieldChange = (id: string, next: Partial<DraftField>) => {
    setFields((current) =>
      current.map((field) => (field.id === id ? { ...field, ...next } : field)),
    );
  };

  const handleFieldRemove = (id: string) => {
    setFields((current) => current.filter((field) => field.id !== id));
  };

  const handleFieldAdd = (type: EventFormFieldType) => {
    const nextId = String(Date.now());
    setFields((current) => [
      ...current,
      {
        id: nextId,
        type,
        label: "",
        required: true,
        optionsText: "",
      },
    ]);
  };

  const validateFields = () => {
    for (const field of fields) {
      if (!field.label.trim()) {
        return "모든 추가 질문에는 라벨이 필요합니다.";
      }

      if (field.type === "SELECT" && parseOptions(field.optionsText).length === 0) {
        return "선택형 질문에는 하나 이상의 선택지가 필요합니다.";
      }
    }

    return "";
  };

  const handleSubmit = async () => {
    if (!selectedClubId) {
      toast?.push("행사를 생성할 클럽을 선택해주세요.");
      return;
    }

    if (!title.trim()) {
      toast?.push("행사 제목을 입력해주세요.");
      return;
    }

    if (!date || !time) {
      toast?.push("행사 일시를 입력해주세요.");
      return;
    }

    const fieldValidationMessage = validateFields();
    if (fieldValidationMessage) {
      toast?.push(fieldValidationMessage);
      return;
    }

    const formFields: CreateEventFormField[] = fields.map((field) => ({
      type: field.type,
      label: field.label.trim(),
      required: field.required,
      options: field.type === "SELECT" ? parseOptions(field.optionsText) : [],
    }));

    setIsSubmitting(true);

    try {
      const createdEvent = await createEvent({
        clubId: Number(selectedClubId),
        title: title.trim(),
        startTime: buildStartTime(date, time),
        formFields,
      });

      toast?.push(`행사를 생성했습니다. Event ID ${createdEvent.eventId}`);
      navigate("/dashboard");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "행사 생성에 실패했습니다.";
      toast?.push(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative h-full bg-[#f7f7f7]">
      <TopSpace child={<CreateEventHeader title="새 행사 만들기" />} />

      <div className="h-[calc(100%-60px)] overflow-y-auto px-4 pb-28">
        <div className="flex flex-col gap-4 pb-6">
          <section className="rounded-3xl border border-[#e8e8e8] bg-white px-4 py-4 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
            <h2 className="text-lg font-bold text-[#111111]">기본 정보</h2>

            <div className="mt-4">
              <label className="mb-2 block text-xs font-medium text-[#666666]">
                클럽 선택
              </label>
              <select
                value={selectedClubId}
                onChange={(event) => setSelectedClubId(event.target.value)}
                disabled={isLoadingClubs}
                className="h-12 w-full rounded-2xl border border-[#d5d5d5] bg-white px-4 outline-none focus:border-[#702f95] disabled:bg-[#f5f5f5]"
              >
                <option value="">
                  {isLoadingClubs ? "클럽 불러오는 중" : "클럽을 선택하세요"}
                </option>
                {clubs.map((club) => (
                  <option key={club.clubId} value={club.clubId}>
                    {club.clubName} ({club.myRole})
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-4">
              <label className="mb-2 block text-xs font-medium text-[#666666]">
                행사 제목
              </label>
              <input
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="예: 2026 상반기 OT"
                className="h-12 w-full rounded-2xl border border-[#d5d5d5] px-4 outline-none focus:border-[#702f95]"
              />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div>
                <label className="mb-2 block text-xs font-medium text-[#666666]">
                  날짜
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  className="h-12 w-full rounded-2xl border border-[#d5d5d5] px-4 outline-none focus:border-[#702f95]"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-medium text-[#666666]">
                  시간
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(event) => setTime(event.target.value)}
                  className="h-12 w-full rounded-2xl border border-[#d5d5d5] px-4 outline-none focus:border-[#702f95]"
                />
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-[#e8e8e8] bg-white px-4 py-4 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
            <h2 className="text-lg font-bold text-[#111111]">추가 신청 항목</h2>
            <p className="mt-2 text-sm leading-6 text-[#666666]">
              `formFields`에 들어가는 추가 질문입니다. 비워두면 기본 질문 없이 생성됩니다.
            </p>

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => handleFieldAdd("TEXT")}
                className="rounded-xl border border-[#d5d5d5] px-4 py-2 text-sm font-medium text-[#111111]"
              >
                텍스트 질문 추가
              </button>
              <button
                type="button"
                onClick={() => handleFieldAdd("SELECT")}
                className="rounded-xl border border-[#d5d5d5] px-4 py-2 text-sm font-medium text-[#111111]"
              >
                선택형 질문 추가
              </button>
            </div>

            <div className="mt-4 flex flex-col gap-3">
              {fields.length > 0 ? (
                fields.map((field) => (
                  <FieldCard
                    key={field.id}
                    field={field}
                    onChange={handleFieldChange}
                    onRemove={handleFieldRemove}
                  />
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-[#d9d9d9] bg-[#fcfcfc] px-4 py-5 text-sm text-[#666666]">
                  추가 질문이 없습니다.
                </div>
              )}
            </div>
          </section>

          <section className="rounded-3xl border border-dashed border-[#d9d9d9] bg-white/90 px-4 py-4">
            <h2 className="text-sm font-semibold text-[#111111]">현재 API 기준 안내</h2>
            <p className="mt-2 text-sm leading-6 text-[#666666]">
              생성 API에는 아직 `location`, `endTime`, `description`, `category`가 없습니다.
              지금 화면에서는 `clubId`, `title`, `startTime`, `formFields`만 전송합니다.
            </p>
          </section>
        </div>
      </div>

      <div className="absolute bottom-[70px] left-0 right-0 bg-white px-4 py-3 border-t border-[#ededed]">
        <GradientButton onClick={handleSubmit} disabled={isSubmitting || isLoadingClubs}>
          {isSubmitting ? "생성 중..." : "행사 생성하기"}
        </GradientButton>
      </div>

      <BottomBar activeItem="moim" />
    </div>
  );
}
