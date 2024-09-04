"use client";
import Link from "next/link";
import Image from "next/image";

import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../../database.types";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Session } from "@supabase/supabase-js";

//needs username and logout action
const supabase: SupabaseClient<Database> = createClient();

export default function Header() {
  //dont like this bc this is server call in client component - ask ibi..
  const [session, setSession] = useState<Session | null>(null);

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
  });

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
        </div>
        <h1>Savepoint</h1>
      </Link>

      <div
        style={{
          display: "flex",
          gap: "3rem",
          color: "var(--secondary-text-color)",
        }}
      >
        <Link href="/about">About</Link>
        {session?.user ? (
          <Link href="/logout">Logout</Link>
        ) : (
          <Link href="/login">Login</Link>
        )}
      </div>
    </header>
  );
}
