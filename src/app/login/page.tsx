"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Error from "@/components/Error";

export default function Login() {
  const supabase = createClient();
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const session = async () => (await supabase.auth.getSession()).data!.session;
  if (session() !== null) router.push("/home");

  async function login(email: string, password: string) {
    const data = {
      email: email,
      password: password,
    };

    const { error } = await supabase.auth.signInWithPassword(data);

    if (error) {
      setError(error.message || "An unexpected error occured.");
    } else {
      router.push("/home");
      router.refresh();
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
        <h1>Welcome back!</h1>
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
            <button type="submit">log in</button>
          </div>
        </form>
        <div className="center">
          <Error error={error} />
        </div>
        <Link href="/signup">New user?</Link>
        <Link href="/password/forgot">Forgot password?</Link>
      </div>
    </div>
  );
}
