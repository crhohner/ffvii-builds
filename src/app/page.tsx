"use client";
/*import { cache } from "react";
import { Database } from "../../database.types";
import { type SupabaseClient } from "@supabase/auth-helpers-nextjs";*/
import { createClient } from "@/utils/supabase/client";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Model } from "@/components/Model";
import { OrbitControls } from "@react-three/drei";
import { useRouter } from "next/navigation";

export default async function Home() {
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        redirect("/password/reset");
      }
    });
    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="center">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <h2>Savepoint</h2>
        <h3>{"A build management system for"}</h3>
        <h3>{"Final Fantasy VII"}</h3>
        <br />
        <div
          style={{ maxWidth: "200px", minHeight: "250px" }}
          id="canvas-container"
        >
          <Canvas>
            <ambientLight intensity={0.1} />
            <directionalLight color="red" position={[0, 0, 5]} />
            <Model />
            <OrbitControls />
          </Canvas>
        </div>
        <br />

        <button onClick={() => router.push("/login")}>
          Let's get started!
        </button>
      </div>
    </div>
  );
}

/*<span>MATERIA: {JSON.stringify(materia)}</span>
      <br />
      <span>ACCESSORIES: {JSON.stringify(accessories)}</span>
      <br />*/

/*const materia = await getAllMateria();
  const accessories = await getAllAccessories();*/

/*const supabase: SupabaseClient<Database> = createClient();

const getAllMateria = cache(async () => {
  const item = await supabase.from("materia").select("*");
  return item;
});

const getAllAccessories = cache(async () => {
  const item = await supabase.from("accessory").select("*");
  return item;
});*/
