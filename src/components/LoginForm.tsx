"use client";
import styles from "@/app/login/page.module.css";
import Link from "next/link";

interface LoginProps {
  login: (formData: FormData) => Promise<void>;
  signup: (formData: FormData) => Promise<void>;
}
//needs username and logout action

export const LoginForm: React.FC<LoginProps> = (props: LoginProps) => {
  return (
    <div className="center">
      <div className={"container"}>
        <br />
        <h1>Welcome!</h1>
        <br />
        <form className={styles["login"]}>
          <label htmlFor="email">email:</label>
          <input id="email" name="email" type="email" required />
          <br />
          <label htmlFor="password">password:</label>
          <input id="password" name="password" type="password" required />
          <div className={styles["login-buttons"]}>
            {" "}
            <button formAction={props.login}>log in</button>
            <button formAction={props.signup}>sign up</button>
          </div>
        </form>
        <br />
        <Link href="/password/forgot-password">Forgot password?</Link>
      </div>
    </div>
  );
};
