"use client";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/utils/supabase";
import { SetStateAction, useEffect, useState } from "react";
import { Session } from "inspector";

export default function Header() {
  const logout = async () => {
    try {
      let { error } = await supabase.auth.signOut();
    } catch (error) {
      console.log(error);
    }
  };

  /*const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setSession(session);
      } catch (error) {
        if (error instanceof Error)
          console.error("Error fetching session:", error.message);
      }
    };

    fetchSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session === null) {
        console.log("null session");
      }
      setSession(session);
    });

    return () => {
      subscription?.unsubscribe();
    };
  });*/

  return (
    <header>
      <Link
        href="/"
        style={{
          display: "flex",
          gap: ".5rem",
          alignItems: "center",
        }}
      >
        <div>
          <Image src="/logo.png" alt="Savepoint logo" width={22} height={22} />
          <h1>Savepoint</h1>
        </div>
      </Link>

      <div
        style={{
          display: "flex",
          gap: "3rem",
          color: "var(--secondary-text-color)",
        }}
      >
        <Link href="/about">About</Link>
        <Link href="/login">Login</Link>
        <button onClick={logout}>log out</button>
      </div>
    </header>
  );
}
