import logo from "../../assets/png/logo2.png";
import discord_logo from "../../assets/png/discord.png";
import { redirectToDiscordLogin } from "../../api/auth";

export default function Login_Landing() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center space-y-3">
      <img src={logo} alt="Q-Check 로고" className="w-38 h-auto" />
      <button
        type="button"
        onClick={redirectToDiscordLogin}
        className="w-50 h-20 overflow-hidden flex items-center justify-center active:scale-95 transition-transform"
      >
        <img
          src={discord_logo}
          alt="디스코드 로그인"
          className="w-full h-full object-cover"
        />
      </button>
    </div>
  );
}
