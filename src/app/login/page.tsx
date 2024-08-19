"use client";
import { login, signup } from "@/app/login/actions";
import { LoginForm } from "@/components/LoginForm";

export default function Page() {
  return (
    <>
      <LoginForm login={login} signup={signup} />
    </>
  );
}
