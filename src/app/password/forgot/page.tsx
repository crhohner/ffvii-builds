"use client";
import { createClient } from "@/utils/supabase/client";
import { useState } from "react";

export default function ForgotPassword() {
  const supabase = createClient();
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  async function send(email: string) {
    const data = {
      email: email,
    };
    const { error } = await supabase.auth.resetPasswordForEmail(data.email);

    if (error) {
      setError(error.message || "An unexpected error occured.");
      setSuccess(false);
    } else {
      setSuccess(true);
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (email === "") {
      setError("Please enter your email.");
      return;
    }
    send(email);
  };

  return (
    <div className="center">
      <div className={"container"}>
        {success ? (
          <h3>Check your email for a reset link!</h3>
        ) : (
          <>
            <br />
            <h1>Forgot your password?</h1>
            <h3>No worries!</h3>
            <br />
            <form onSubmit={handleSubmit} className="form">
              <label htmlFor="email">email:</label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                id="email"
                name="email"
                type="email"
              />
              <br />
              <button type="submit">send reset link</button>
            </form>
            <br />
            <div className="err">{error}</div>
          </>
        )}
      </div>
    </div>
  );
}