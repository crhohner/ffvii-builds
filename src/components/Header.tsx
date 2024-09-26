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
        {props.mobile && (
          <div>
            <Image
              onClick={() => {
                setBurger(!burger);
              }}
              src="burger.svg"
              alt="burger"
              height={"22"}
              width={"22"}
            />
          </div>
        )}
      </header>
      {burger && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            position: "fixed",
            right: "2.5rem",
            top: "4.2rem",
            zIndex: "10",
            background: "var(--blob-color)",
            borderRadius: "12px",
          }}
        >
          {links.map((link) => (
            <div className="blob">{link}</div>
          ))}
        </div>
      )}
    </>
  );
}
