"use client";
import { useEffect, useState } from "react";
import { logout } from "./action";
import { createClient } from "@/utils/supabase/client";

let nameFromEmail = function (name: string): string {
  const idx = name.indexOf("@");
  return name.substring(0, idx);
};

export default function Logout() {
  const supabase = createClient();
  const [name, setName] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then((session) => {
      setName(nameFromEmail(session.data.session?.user.email!));
    });
  }, []);

  return (
    <div className="center">
      <div className={"container"}>
        <br />
        <h1>{"Goodbye " + name + " :("}</h1>
        <br />
        <button onClick={(e) => logout()}>log out</button>
      </div>
    </div>
  );
}
