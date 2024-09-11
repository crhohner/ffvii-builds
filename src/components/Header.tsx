import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/utils/supabase/server";

export default async function Header() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();

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
        {data.user ? (
          <Link href="/logout">Logout</Link>
        ) : (
          <Link href="/login">Login</Link>
        )}
      </div>
    </header>
  );
}
