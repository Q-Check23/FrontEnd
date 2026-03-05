import React from "react";
import GradientButton from "../../components/GradientButton";
import InputArea from "../../components/InputArea";
import InputBox from "../../components/InputBox";
import { OptionSelector } from "../../components/OptionPill";
import TopSpace from "../../components/TopSpace";
import CreateEventHeader from "../../components/CreateEventHeader";
import BottomBar from "../../components/BottomBar";
import ScheduleEvent from "../../components/ScheduleEvent";

export default function CreateEvent() {
    const [choice, setChoice] = React.useState("행사");

    return (
        <div className="h-full relative">
            <TopSpace child={<CreateEventHeader />}/>
            <div className="flex flex-col h-full w-full gap-[27px] bg-[#F9F9F9] p-[15px]">
                <div className="flex flex-col h-full w-full p-[10px] gap-[6px]">
                    <InputBox
                        bgColor="#FDFDFD"
                        basicTxt="예: KUIT 6기 데모데이"
                        hasTitle={true}
                        title="행사 제목"
                    />
                    <OptionSelector 
                        options={["행사", "스터디", "회식", "세션"]}
                        value={choice}
                        onChange={setChoice}
                        hasTitle={true}
                        title="카테고리"
                    />
                    <ScheduleEvent />
                    <InputBox 
                        bgColor="#FDFDFD"
                        basicTxt="장소를 입력하거나 검색하세요"
                        hasTitle={true}
                        title="장소"
                    />
                    <InputArea 
                        bgColor="#FDFDFD"
                        basicTxt="행사에 대한 설명을 입력해주세요. (준비물, 공지사항 등)"
                        hasTitle={true}
                        title="상세 내용"
                    />
                </div>
                <GradientButton onClick={() => console.log("click")}>행사 생성하기</GradientButton>
            </div>
            <BottomBar />
        </div>
    )
}