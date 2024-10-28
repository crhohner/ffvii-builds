"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import Error from "@/components/Error";

export default function Signup() {
  const supabase = createClient();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  async function signup(email: string, password: string) {
    const data = {
      email: email,
      password: password,
    };

    const { error } = await supabase.auth.signUp(data);

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

    if (password === "") {
      setError("Please enter a password.");
      return;
    }

    try {
      signup(email, password);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="center">
      <div className="container">
        {success ? (
          <h3>Check your email for a validation link!</h3>
        ) : (
          <>
            <h1>Welcome!</h1>
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

              <div className="labeled-field">
                <label htmlFor="password">password:</label>
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  id="password"
                  name="password"
                  type="password"
                />
              </div>
              <div className="center">
                <button type="submit">sign up</button>
              </div>
            </form>
            <div className="center">
              <Error error={error} />
            </div>
            <Link href="/login">Already have an account?</Link>
          </>
        )}
      </div>
    </div>
  );
}
