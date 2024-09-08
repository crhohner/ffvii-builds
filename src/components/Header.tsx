"use client";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/utils/supabase";
import { SetStateAction, useEffect, useState } from "react";
import { Session } from "inspector";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();
  const logout = async () => {
    try {
      let { error } = await supabase.auth.signOut();
      router.push("/login");
    } catch (error) {
      console.log(error);
      router.push("/error");
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
        <div style={{ display: "flex", gap: "10px" }}>
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
        <Link href="/login" onClick={logout}>
          Logout
        </Link>
      </div>
    </header>
  );
  //make button based on session
}
