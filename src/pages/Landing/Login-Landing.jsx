import { Link } from "react-router-dom";
import logo from "../../assets/logo2.png";
import discord_logo from "../../assets/discord.png";

export default function Login_Landing() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center space-y-3" >
      <img src={logo} alt="Q-Check 로고" className="w-38 h-auto"></img>
      <div className="w-50 h-20 overflow-hidden flex items-center justify-center">
        <img src={discord_logo} alt="디스코드 로그인" className="w-full h-full object-cover"></img>
      </div>
    </div>
  );
}
