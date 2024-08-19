"use client";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const supabase = createClient();

export default async function Page() {
  const router = useRouter();
  useEffect(() => {
    const initialize = async () => await supabase.auth.signOut();
    initialize();
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        router.push("/");
      }
    );
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);
  return <></>;
}

//this works better than the login..
