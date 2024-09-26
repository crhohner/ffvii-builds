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
  const [burger, setBurger] = useState(false);

  const links = [<Link href="/about">About</Link>];
  if (props.user) {
    links.push(<Link href="/home">Home</Link>);
    links.push(<Link href="/logout">Logout</Link>);
  } else {
    links.push(<Link href="/login">Login</Link>);
  }

  return (
    <>
      <header>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <Image src="/logo.png" width={"22"} height={"22"} alt="" />
          <Link href="/">
            <h1>Savepoint</h1>
          </Link>
        </div>

        {!props.mobile && (
          <div
            style={{
              display: "flex",
              gap: "1rem",
              color: "var(--secondary-text-color)",
            }}
          >
            {links}
          </div>
        )}
      </header>
      {props.mobile && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "0 5rem 1rem 5rem",
          }}
        >
          {links}
        </div>
      )}
    </>
  );
}
