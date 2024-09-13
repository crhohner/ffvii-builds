"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function Login() {
  const supabase = createClient();
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  async function login(email: string, password: string) {
    const data = {
      email: email,
      password: password,
    };

    const { error } = await supabase.auth.signInWithPassword(data);

    if (error) {
      setError(error.message || "An unexpected error occured.");
    } else {
      router.push("/");
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (email === "") {
      setError("Please enter your email.");
      return;
    }

    if (password === "") {
      setError("Please enter your password.");
      return;
    }

    try {
      login(email, password);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="center">
      <div className={"container"}>
        <br />
        <h1>Welcome back!</h1>
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
          <label htmlFor="password">password:</label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            id="password"
            name="password"
            type="password"
          />
          <br />
          <button type="submit">log in</button>
        </form>
        <br />
        <div className="err">{error}</div>
        <br />
        <Link href="/signup">New user?</Link>
        <Link href="/password/forgot">Forgot password?</Link>
      </div>
    </div>
  );
}
