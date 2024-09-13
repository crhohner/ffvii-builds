"use client";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useState } from "react";

export default function ForgotPassword() {
  const supabase = createClient();
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  async function reset(password: string) {
    const data = {
      password: password,
    };
    const { error } = await supabase.auth.updateUser({
      password: data.password,
    });

    if (error) {
      setError(error.message || "An unexpected error occured.");
      setSuccess(false);
    } else {
      setSuccess(true);
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password === "") {
      setError("Please enter your new password.");
      return;
    }
    reset(password);
  };

  return (
    <div className="center">
      <div className={"container"}>
        {success ? (
          <>
            <h3>{"Password reset! :)"}</h3>
            <br />
            <Link href={"/"}>Return home</Link>
          </>
        ) : (
          <>
            <br />
            <h1>Reset password</h1>
            <form onSubmit={handleSubmit} className="form">
              <label htmlFor="password">new password:</label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                id="password"
                name="password"
                type="password"
              />
              <br />
              <button type="submit">reset</button>
            </form>
            <br />
            <div className="err">{error}</div>
          </>
        )}
      </div>
    </div>
  );
}
