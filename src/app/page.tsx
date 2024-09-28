"use client";

import { Canvas } from "@react-three/fiber";
import { Model } from "@/components/Model";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="center">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h1 style={{ fontSize: "42px" }}>Savepoint</h1>
        <h3>{"A build management system for"}</h3>
        <h3>{"Final Fantasy VII"}</h3>
        <br />
        <div
          style={{ maxWidth: "200px", minHeight: "250px" }}
          id="canvas-container"
        >
          <Canvas>
            <Model />
          </Canvas>
        </div>
        <br />

        <button onClick={() => router.push("/login")}>Get started!</button>
      </div>
    </div>
  );
}
