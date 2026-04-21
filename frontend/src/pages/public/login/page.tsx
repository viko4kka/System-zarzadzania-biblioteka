import { useState } from "react";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import FloatingCircle, { CIRCLES } from "./components/useCircleAnimation";

export default function Login() {
  const [isLogin, setIsLogin] = useState("register");

  return (
    <div className="bg-mainBgLight flex h-screen w-full flex-col items-center justify-center">
      <div className="800:grid-cols-2 800:w-160 500:w-100 500:h-127 grid h-120 w-75 grid-cols-1 rounded-xl bg-white">
        <div className="800:flex relative hidden overflow-hidden rounded-l-xl">
          {Array.from({ length: CIRCLES }, (_, i) => (
            <FloatingCircle key={i} index={i} />
          ))}
        </div>

        <div className="flex h-full w-full items-center justify-center">
          {isLogin === "login" ? (
            <LoginForm onSwitch={() => setIsLogin("register")} />
          ) : (
            <RegisterForm onSwitch={() => setIsLogin("login")} />
          )}
        </div>
      </div>
    </div>
  );
}
