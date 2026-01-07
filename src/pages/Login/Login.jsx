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
    <div>
      <div>
        <h1>회원가입</h1>
      </div>
      
      <div>
        <form onSubmit={onSubmit}>
          {/* 이름 */}
          <div>
            <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="성명"
            />
            <p>정산시 사용되니 실명으로 입력해주세요.</p>
          </div>

          {/* 닉네임 */}
           <div>
            <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="닉네임"
            />
          </div>

          {/* 이메일 */}
          <div>
            <input
            value={emailId}
            onChange={(e) => setEmailId(e.target.value)}
            placeholder="이메일 주소"
            />

            <span className="text-gray-700 font-medium">@</span>

            <div>
              <select
              value={domain}
              onChange={(e) => setDomain(e.target.value)}>
                {domains.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          {/* 도메인 직접 입력인 경우 */}
            {isCustomDomain && (
              <input value={customDomain}
              onChange={(e) => setCustomDomain(e.target.value)}
              placeholder="도메인 직접 입력"/>
            )}
          {/* 가입 버튼 */}
          <button type="submit">
            가입하기
          </button>
        </form>
      </div>
    </div>
    
  );
}
