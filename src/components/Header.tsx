"use client";
import Link from "next/link";
import Image from "next/image";
import { User } from "@supabase/supabase-js";
import { useState } from "react";

type HeaderProps = {
  user: User | null;
  mobile: boolean;
};
export default function Header(props: HeaderProps) {
  const [menu, setMenu] = useState(false);

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
          <div style={{ position: "relative", top: "-2px" }}>
            <Image
              src="/logo.png"
              alt="Savepoint logo"
              width={22}
              height={22}
            />
          </div>

          <h1>Savepoint</h1>
        </div>
      </Link>

      {!props.mobile && (
        <div
          style={{
            display: "flex",
            gap: "3rem",
            color: "var(--secondary-text-color)",
          }}
        >
          <Link href="/about">About</Link>
          {props.user ? (
            <Link href="/logout">Logout</Link>
          ) : (
            <Link href="/login">Login</Link>
          )}
        </div>
      )}
      {props.mobile && <></>}
    </header>
  );
}
