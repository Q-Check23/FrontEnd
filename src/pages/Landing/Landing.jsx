import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

export default function Landing() {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center space-y-10">
       <img src={logo} alt="Q-Check 로고" className="w-50 h-auto" ></img>
        <Link to="/login-landing" >다음</Link>
    </div>
     
  );
}
