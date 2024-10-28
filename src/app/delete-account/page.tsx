"use client";
import { useEffect, useState } from "react";
import { deleteAccount } from "./action";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

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
        <h1 style={{ paddingBottom: "0.5rem" }}>
          {"Delete account " + name + "?"}
        </h1>
        <button onClick={() => deleteAccount()}>delete</button>
      </div>
    </div>
  );
}
