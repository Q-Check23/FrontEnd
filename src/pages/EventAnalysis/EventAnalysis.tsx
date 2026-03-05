import { useState } from "react";
import BottomBar from "../../components/BottomBar";

type AnalysisTabType = "overview" | "attendance" | "feedback";

interface AnalysisData {
  totalRegistrations: number;
  totalAttendance: number;
  attendanceRate: number;
  noShowRate: number;
  avgRating: number;
  feedbackCount: number;
  hourlyCheckIns: Array<{ hour: string; count: number }>;
  departmentStats: Array<{ dept: string; count: number; percentage: number }>;
}

const AnalysisCard = ({
  title,
  value,
  unit,
  highlight = false,
}: {
  title: string;
  value: number | string;
  unit?: string;
  highlight?: boolean;
}) => (
  <div
    className={`rounded-lg px-4 py-4 flex flex-col items-center justify-center border ${
      highlight
        ? "bg-[rgba(239,227,254,0.3)] border-[#d9d9d9]"
        : "bg-[#fdfdfd] border-[#d9d9d9]"
    }`}
  >
    <p className="text-sm text-[#808080] mb-1 text-center">{title}</p>
    <div className="flex items-baseline gap-1">
      <p className="text-3xl font-bold text-black">{value}</p>
      {unit && <p className="text-lg text-[#808080]">{unit}</p>}
    </div>
  </div>
);

const SimpleBarChart = ({
  data,
  label,
}: {
  data: Array<{ label: string; value: number }>;
  label: string;
}) => {
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <div className="bg-[#fdfdfd] border border-[#d9d9d9] rounded-lg p-4">
      <p className="text-lg font-semibold text-black mb-4">{label}</p>
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index}>
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm text-[#606060]">{item.label}</p>
              <p className="text-sm font-bold text-black">{item.value}</p>
            </div>
            <div className="w-full bg-[#f0f0f0] rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#870199] to-[#E101FF] h-full transition-all"
                style={{
                  width: `${(item.value / maxValue) * 100}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const DepartmentStats = ({
  data,
}: {
  data: Array<{ dept: string; count: number; percentage: number }>;
}) => (
  <div className="bg-[#fdfdfd] border border-[#d9d9d9] rounded-lg p-4">
    <p className="text-lg font-semibold text-black mb-4">학과별 참석 현황</p>
    <div className="space-y-3">
      {data.map((item, index) => (
        <div key={index} className="flex items-center justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm text-[#606060]">{item.dept}</p>
              <p className="text-sm font-bold text-black">{item.count}명</p>
            </div>
            <div className="w-full bg-[#f0f0f0] rounded-full h-2 overflow-hidden">
              <div
                className="bg-[#649f76] h-full transition-all"
                style={{ width: `${item.percentage}%` }}
              />
            </div>
          </div>
          <p className="text-sm font-bold text-black min-w-[40px] text-right">
            {item.percentage}%
          </p>
        </div>
      ))}
    </div>
  </div>
);

const FeedbackSection = ({
  avgRating,
  feedbackCount,
}: {
  avgRating: number;
  feedbackCount: number;
}) => (
  <div className="bg-[#fdfdfd] border border-[#d9d9d9] rounded-lg p-4">
    <p className="text-lg font-semibold text-black mb-4">참가자 피드백</p>
    <div className="flex items-center gap-4 mb-4">
      <div className="flex-1">
        <p className="text-sm text-[#808080] mb-1">평균 평점</p>
        <div className="flex items-center gap-1">
          <p className="text-2xl font-bold text-black">{avgRating}</p>
          <p className="text-sm text-[#808080]">/ 5.0</p>
        </div>
      </div>
      <div className="flex-1">
        <p className="text-sm text-[#808080] mb-1">피드백 수</p>
        <p className="text-2xl font-bold text-black">{feedbackCount}</p>
      </div>
    </div>
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <div
          key={star}
          className={`text-2xl ${
            star <= Math.round(avgRating) ? "text-yellow-400" : "text-[#f0f0f0]"
          }`}
        >
          ★
        </div>
      ))}
    </div>
  </div>
);

export default function EventAnalysis() {
  const [activeTab, setActiveTab] = useState<AnalysisTabType>("overview");

  const analysisData: AnalysisData = {
    totalRegistrations: 156,
    totalAttendance: 134,
    attendanceRate: 85.9,
    noShowRate: 14.1,
    avgRating: 4.5,
    feedbackCount: 89,
    hourlyCheckIns: [
      { hour: "19:00", count: 12 },
      { hour: "19:30", count: 34 },
      { hour: "20:00", count: 56 },
      { hour: "20:30", count: 28 },
      { hour: "21:00", count: 4 },
    ],
    departmentStats: [
      { dept: "전산학부", count: 42, percentage: 31 },
      { dept: "수학과", count: 28, percentage: 21 },
      { dept: "물리학과", count: 35, percentage: 26 },
      { dept: "기타", count: 29, percentage: 22 },
    ],
  };

  return (
    <div className="relative w-full h-full bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-center py-5 border-b border-[#f0f0f0]">
        <h1 className="text-2xl font-medium text-black">분석</h1>
      </div>

      {/* Tabs */}
      <div className="flex items-center border-b border-t border-[#c0c0c0]">
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex-1 h-11 text-center font-medium text-lg px-6 py-2 border-b-[2px] transition-colors ${
            activeTab === "overview"
              ? "border-[#649f76] text-[#649f76]"
              : "border-transparent text-black"
          }`}
        >
          개요
        </button>
        <button
          onClick={() => setActiveTab("attendance")}
          className={`flex-1 h-11 text-center font-medium text-lg px-6 py-2 border-b-[2px] transition-colors ${
            activeTab === "attendance"
              ? "border-[#649f76] text-[#649f76]"
              : "border-transparent text-black"
          }`}
        >
          입장 현황
        </button>
        <button
          onClick={() => setActiveTab("feedback")}
          className={`flex-1 h-11 text-center font-medium text-lg px-6 py-2 border-b-[2px] transition-colors ${
            activeTab === "feedback"
              ? "border-[#649f76] text-[#649f76]"
              : "border-transparent text-black"
          }`}
        >
          피드백
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-[#f9f9f9] pb-24">
        <div className="px-4 py-4 flex flex-col gap-4">
          {activeTab === "overview" && (
            <>
              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-3">
                <AnalysisCard
                  title="총 등록수"
                  value={analysisData.totalRegistrations}
                  unit="명"
                />
                <AnalysisCard
                  title="실제 참석"
                  value={analysisData.totalAttendance}
                  unit="명"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <AnalysisCard
                  title="참석률"
                  value={analysisData.attendanceRate}
                  unit="%"
                  highlight
                />
                <AnalysisCard
                  title="노쇼율"
                  value={analysisData.noShowRate}
                  unit="%"
                />
              </div>

              {/* Department Stats */}
              <DepartmentStats data={analysisData.departmentStats} />

              {/* Feedback */}
              <FeedbackSection
                avgRating={analysisData.avgRating}
                feedbackCount={analysisData.feedbackCount}
              />
            </>
          )}

          {activeTab === "attendance" && (
            <>
              {/* Hourly Check-in Chart */}
              <div className="bg-[#fdfdfd] border border-[#d9d9d9] rounded-lg p-4">
                <p className="text-lg font-semibold text-black mb-4">
                  시간대별 입장 현황
                </p>
                <div className="space-y-3">
                  {analysisData.hourlyCheckIns.map((item, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm text-[#606060]">{item.hour}</p>
                        <p className="text-sm font-bold text-black">
                          {item.count}명
                        </p>
                      </div>
                      <div className="w-full bg-[#f0f0f0] rounded-full h-3 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-[#870199] to-[#E101FF] h-full transition-all"
                          style={{
                            width: `${(item.count / 60) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Peak Hours */}
              <div className="bg-[rgba(239,227,254,0.3)] border border-[#d9d9d9] rounded-lg p-4">
                <p className="text-lg font-semibold text-black mb-3">
                  피크 시간대
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-[#606060]">가장 많이 입장한 시간</p>
                    <p className="text-lg font-bold text-black">20:00 (56명)</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-[#606060]">가장 적게 입장한 시간</p>
                    <p className="text-lg font-bold text-black">21:00 (4명)</p>
                  </div>
                </div>
              </div>

              {/* Department Attendance */}
              <DepartmentStats data={analysisData.departmentStats} />
            </>
          )}

          {activeTab === "feedback" && (
            <>
              {/* Feedback Summary */}
              <div className="grid grid-cols-2 gap-3">
                <AnalysisCard
                  title="평균 평점"
                  value={analysisData.avgRating}
                  unit="/ 5.0"
                  highlight
                />
                <AnalysisCard
                  title="피드백 수"
                  value={analysisData.feedbackCount}
                  unit="개"
                />
              </div>

              {/* Star Distribution */}
              <div className="bg-[#fdfdfd] border border-[#d9d9d9] rounded-lg p-4">
                <p className="text-lg font-semibold text-black mb-4">
                  평점 분포
                </p>
                <div className="space-y-3">
                  {[
                    { stars: 5, count: 68, percentage: 76 },
                    { stars: 4, count: 15, percentage: 17 },
                    { stars: 3, count: 4, percentage: 4 },
                    { stars: 2, count: 2, percentage: 2 },
                    { stars: 1, count: 0, percentage: 1 },
                  ].map((item, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={i < item.stars ? "text-yellow-400" : "text-[#f0f0f0]"}
                            >
                              ★
                            </span>
                          ))}
                          <p className="text-sm text-[#606060] ml-2">
                            {item.count}명
                          </p>
                        </div>
                        <p className="text-sm font-bold text-black">
                          {item.percentage}%
                        </p>
                      </div>
                      <div className="w-full bg-[#f0f0f0] rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-[#649f76] h-full transition-all"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Feedback Comments */}
              <div className="bg-[#fdfdfd] border border-[#d9d9d9] rounded-lg p-4">
                <p className="text-lg font-semibold text-black mb-3">
                  주요 피드백
                </p>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {[
                    "정말 좋은 이벤트였습니다!",
                    "다음에도 참여하고 싶어요",
                    "스피커 분의 강의가 도움이 많이 되었습니다",
                    "장소가 조금 좁았지만 전반적으로 만족합니다",
                    "음식이 맛있었어요",
                  ].map((comment, index) => (
                    <div
                      key={index}
                      className="text-sm text-[#606060] rounded px-3 py-2 bg-[#f9f9f9]"
                    >
                      "{comment}"
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomBar activeItem="activity" />
    </div>
  );
}
