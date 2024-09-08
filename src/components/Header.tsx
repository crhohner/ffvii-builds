"use client";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/utils/supabase";
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
      {"user: " + null}
      <div
        style={{
          display: "flex",
          gap: "3rem",
          color: "var(--secondary-text-color)",
        }}
      >
        <Link href="/about">About</Link>
        {null ? (
          <button onClick={logout}>Logout</button>
        ) : (
          <Link href="/login">Login</Link>
        )}
      </div>
    </header>
  );
}
