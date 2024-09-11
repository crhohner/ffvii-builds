"use client";

import styles from "./page.module.css";
import Link from "next/link";
import { login } from "./action";

export default function Login() {
  return (
    <div className="center">
      <div className={"container"}>
        <br />
        <h1>Welcome!</h1>
        <br />
        <form action={login} className={styles["form"]}>
          <label htmlFor="email">email:</label>
          <input id="email" name="email" type="email" />
          <br />
          <label htmlFor="password">password:</label>
          <input id="password" name="password" type="password" />
          <br />
          <button type="submit">log in</button>
        </form>
        <br />
        <br />
        <Link href="/signup">New user?</Link>
        <Link href="/">Forgot password?</Link>
      </div>
    </div>
  );
}
