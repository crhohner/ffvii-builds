"use client";
import { logout } from "./action";

export default async function Logout() {
  return (
    <div className="center">
      <div className={"container"}>
        <br />
        <h1>{"Goodbye"}</h1>
        <br />
        <button onClick={(e) => logout()}>log out</button>
      </div>
    </div>
  );
}
