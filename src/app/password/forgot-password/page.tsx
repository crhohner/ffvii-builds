"use client";
import { ForgotPasswordForm } from "@/components/ForgotPasswordForm";
import { send } from "./actions";

export default function Page() {
  return <ForgotPasswordForm action={send} />; //how to not use FCs here..
}
