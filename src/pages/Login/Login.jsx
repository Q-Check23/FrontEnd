import { Link } from "react-router-dom";
import {useState} from "react";

export default function Login() {
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [emailId, setEmailId] = useState("");
  const [domain, setDomain] = useState("gmail.com");

  const domains = ["직접입력", "gmail.com", "naver.com", "daum.net", "kakao.com"];

  const isCustomDomain = domain === "직접입력";
  const [customDomain, setCustomDomain] = useState("");

  const finalEmail = `${emailId}@${isCustomDomain? customDomain : domain}`;

  const onSubmit = (e) => {
    e.preventDefault();
    //TODO: 가입 API 붙이기
    console.log({name, nickname, finalEmail});
  }
  return (
    <div className="h-full w-full flex flex-col items-center justify-start gap-16">
        <h1 className="text-2xl font-bold self-start mt-10 ml-10">회원가입</h1>
      
      <div className="h-full w-full flex flex-col p-5">
        <form onSubmit={onSubmit} className="flex flex-col gap-5">
          {/* 이름 */}
          <div>
            <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="성명"
            className="w-full h-11 rounded-xl border border-gray-200 outline-none focus:border-gray-400 p-5"
            />
            <p className="text-xs text-gray-500 text-left pl-3 pt-2">정산시 사용되니 실명으로 입력해주세요.</p>
          </div>

          {/* 닉네임 */}
           <div>
            <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="닉네임"
            className="w-full h-11 rounded-xl border border-gray-200 outline-none focus:border-gray-400 p-5"
            />
          </div>

          {/* 이메일 */}
          <div className="flex items-center gap-3 w-full">
            <input
              value={emailId}
              onChange={(e) => setEmailId(e.target.value)}
              placeholder="이메일 주소"
              className="w-1/2 h-11 rounded-xl border border-gray-200 px-4 outline-none focus:border-gray-400"
            />

            <span className="shrink-0 text-gray-700 font-medium">@</span>

            <select
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="w-1/2 h-11 rounded-xl border border-gray-200 px-4 outline-none focus:border-gray-400 bg-white"
            >
              {domains.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* 도메인 직접 입력인 경우 */}
            {isCustomDomain && (
              <input value={customDomain}
              onChange={(e) => setCustomDomain(e.target.value)}
              placeholder="도메인 직접 입력"
              className="w-full h-11 rounded-xl border border-gray-200 outline-none focus:border-gray-400 p-5"/>
              
            )}
          {/* 가입 버튼 */}
          <button type="submit"
          className="w-full h-11 rounded-xl border outline-none ">
            가입하기
          </button>
        </form>
      </div>
    </div>
    
  );
}
