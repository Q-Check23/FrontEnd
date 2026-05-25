import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/png/logo.png";

export default function Landing() {
  const navigate = useNavigate();
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFadeOut(true), 1500);
    const navTimer = setTimeout(() => navigate("/login-landing", { replace: true }), 2000);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(navTimer);
    };
  }, [navigate]);

  return (
    <div
      className="h-full w-full flex flex-col items-center justify-center transition-opacity duration-500"
      style={{ opacity: fadeOut ? 0 : 1 }}
    >
      <img src={logo} alt="Q-Check 로고" className="w-50 h-auto" />
    </div>
  );
}
