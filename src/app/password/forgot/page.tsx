"use client";
import Error from "@/components/Error";
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
    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: "https://www.ffvii-savepoint.com/password/reset",
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
            <h1>Forgot your password?</h1>
            <form onSubmit={handleSubmit} className="form">
              <div className="labeled-field">
                <label htmlFor="email">email:</label>
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  id="email"
                  name="email"
                  type="email"
                />
              </div>

              <div className="center">
                <button type="submit">send reset link</button>
              </div>
            </form>
            <div className="center">
              <Error error={error} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
