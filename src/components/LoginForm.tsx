"use client";

import { Session } from "@supabase/supabase-js";
import styles from "@/app/login/page.module.css";
import { useRouter } from "next/navigation";

interface LoginProps {
  login: (formData: FormData) => Promise<void>;
  signup: (formData: FormData) => Promise<void>;
}
//needs username and logout action

export const LoginForm: React.FC<LoginProps> = async (props: LoginProps) => {
  return (
    <>
      <div className={styles["center"]}>
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
      </div>
    </>
  );
};
