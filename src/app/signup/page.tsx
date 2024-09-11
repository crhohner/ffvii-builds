"use client";

import styles from "./page.module.css";
import Link from "next/link";
import { signup } from "./action";

export default function Signup() {
  return (
    <div className="center">
      <div className={"container"}>
        <br />
        <h1>Welcome!</h1>
        <br />
        <form action={signup} className={styles["form"]}>
          <label htmlFor="email">email:</label>
          <input id="email" name="email" type="email" />
          <br />
          <label htmlFor="password">password:</label>
          <input id="password" name="password" type="password" />
          <br />
          <button type="submit">sign up</button>
        </form>
        <br />
        <br />
        <Link href="/login">Already have an account?</Link>
        <Link href="/">Forgot password?</Link>
      </div>
    </div>
  );
}