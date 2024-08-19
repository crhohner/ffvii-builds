"use client";
import Link from "next/link";

import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../../database.types";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Session } from "@supabase/supabase-js";

//needs username and logout action
const supabase: SupabaseClient<Database> = createClient();

export default function Header() {
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
      <Link href="/">ffvii builds</Link>
      {session?.user ? (
        <Link href="/logout">logout</Link>
      ) : (
        <Link href="/login">login</Link>
      )}
    </header>
  ); //why is logout so hard
}
