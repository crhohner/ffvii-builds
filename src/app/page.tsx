"use client";

import { Canvas } from "@react-three/fiber";
import { Model } from "@/components/Model";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function Home() {
  const router = useRouter();
  const supabase = createClient();

  return (
    <div className="center">
      <div
        className="container"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "3rem",
        }}
      >
        <h1 style={{ fontSize: "38px" }}>Savepoint</h1>
        <h3>{"A build management system for"}</h3>
        <h3>{"Final Fantasy VII"}</h3>

        <div
          style={{ maxWidth: "200px", minHeight: "250px" }}
          id="canvas-container"
        >
          <Canvas>
            <Model />
          </Canvas>
        </div>

        <button onClick={() => router.push("/login")}>Get started!</button>
      </div>
    </div>
  );
}
