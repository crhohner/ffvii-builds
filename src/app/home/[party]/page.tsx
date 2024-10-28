"use client";

import { Database } from "@/utils/supabase/types";

import { characterDisplayString, gameDisplayString } from "@/utils/util";
import { useEffect, useState } from "react";

import {
  Character,
  DisplayBuild,
  Link as MateriaLink,
  Materia,
  Party,
  emptyMateria,
} from "@/utils/frontend-types";
import { fetchProps, fetchProps as fetchServerProps } from "./fetch";
import MateriaView from "./MateriaView";
import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
interface Params {
  params: {
    party: string;
  };
}

function Double({
  m1,
  m2,
  links,
}: {
  m1: Materia | null;
  m2: Materia | null;
  links: MateriaLink[];
}) {
  let active = false;
  if (m1 && m2) {
    active = links.some(
      (link) =>
        (link.blue_id === m1.id && link.target_id === m2.id) ||
        (link.blue_id === m2.id && link.target_id === m1.id)
    );
  }

  const src = active ? "active-link" : "link";

  return (
    <div style={{ display: "flex", gap: "0.6rem", position: "relative" }}>
      <MateriaView context={true} m={m1} />
      <MateriaView context={true} m={m2} />
      <div style={{ position: "absolute", left: "28%" }}>
        <Image src={`/materia/${src}.svg`} width={32} height={32} alt="" />
      </div>
    </div>
  );
}

function MateriaMap({
  materia,
  schema,
  links,
}: {
  materia: (Materia | null)[];
  schema: Database["public"]["Enums"]["slot_type"][];
  links: Database["public"]["Tables"]["materia_link"]["Row"][];
}) {
  let slots: JSX.Element[] = [];
  let i = 0;
  for (const slot of schema) {
    if (slot === "single") {
      console.log(materia[i]);
      slots.push(<MateriaView m={materia[i]} context />);
      i += 1;
    } else {
      slots.push(<Double m1={materia[i]} m2={materia[i + 1]} links={links} />);
      i += 2;
    }
  }

  return <div style={{ display: "flex", gap: "0.5rem" }}>{slots}</div>;
}

function ViewBuild({
  build,
  leader,
  links,
}: {
  build: DisplayBuild;
  leader: boolean;
  links: MateriaLink[];
}) {
  return (
    <div className={styles["card"]}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <h1>{characterDisplayString(build.character as Character)}</h1>
          {leader && (
            <div style={{ paddingBottom: "4px" }}>
              <Image src="/crown.svg" height={24} width={24} alt="crown" />
            </div>
          )}
        </div>
        {build.game !== "og" && (
          <MateriaView
            context={true}
            m={build.summon_materia ? build.summon_materia : emptyMateria}
          />
        )}
      </div>

      <div className={styles.property}>
        <h3>ACCESSORY</h3>
        {build.accessory
          ? build.accessory?.name + " (" + build.accessory?.description + ")"
          : "None"}
      </div>
      <div className={styles.property}>
        <h3>WEAPON</h3>
        {build.weapon_name == null ? "None" : build.weapon_name}
      </div>
      <MateriaMap
        materia={build.weapon_materia}
        schema={build.weapon_schema}
        links={links}
      />
      <div className={styles.property}>
        <h3>ARMOR</h3>
        {build.armor_name == null ? "None" : build.armor_name}
      </div>
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <MateriaMap
          materia={build.armor_materia}
          schema={build.armor_schema}
          links={links}
        />
      </div>
    </div>
  );
}

export default function Page({ params }: Params) {
  const [party, setParty] = useState<Party>();
  const [builds, setBuilds] = useState<DisplayBuild[]>([]);
  const [links, setLinks] = useState<MateriaLink[]>([]);

  const fetchPageProps = async () => {
    const result = await fetchServerProps(params.party);
    if (result === undefined) return;
    const { party, builds, links } = result;
    setParty(party);
    setBuilds(builds);
    setLinks(links);
  };

  useEffect(() => {
    fetchPageProps(); // Fetch parties when the component mounts
  }, []);

  function View({ party }: { party: Party }) {
    const path = usePathname();
    return (
      <>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <h1>{party.name}</h1>
            <h2>{gameDisplayString(party.game)}</h2>
            <Link href={path + "/edit"}>
              <Image
                src="/edit.svg"
                height={20}
                width={20}
                alt="pencil"
              ></Image>
            </Link>
          </div>
          <div
            style={{
              width: "inherit",
              height: "fit-content",
              paddingBottom: "1rem",
              paddingTop: "0.5rem",
            }}
          >
            <h3>{party.description}</h3>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {builds?.map((build, index) => (
            <div key={index}>
              <ViewBuild build={build} leader={index === 0} links={links} />
            </div>
          ))}
        </div>
      </>
    );
  }

  return <>{party && <View party={party} />}</>;
}
