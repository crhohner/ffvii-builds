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
} from "@/utils/frontend-types";
import { fetchProps, fetchProps as fetchServerProps } from "./fetch";
import Orb from "./MateriaView";
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
  m1: Materia;
  m2: Materia;
  links: MateriaLink[];
}) {
  if (!m1 || !m2) {
    return null;
  }
  const active = links.some(
    (link) =>
      (link.blue_id === m1.id && link.target_id === m2.id) ||
      (link.blue_id === m2.id && link.target_id === m1.id)
  );
  const src = active ? "active-link" : "link";

  return (
    <div style={{ display: "flex", gap: "0.6rem", position: "relative" }}>
      <Orb m={m1} />
      <Orb m={m2} />
      <div style={{ position: "absolute", left: "28%" }}>
        <Image src={`/materia/${src}.svg`} width={32} height={32} alt="" />
      </div>
    </div>
  );
}

function MateriaMap({
  materia,
  slots,
  links,
}: {
  materia: Materia[];
  slots: Database["public"]["Enums"]["slot_type"][];
  links: Database["public"]["Tables"]["materia_link"]["Row"][];
}) {
  const slotIcons: JSX.Element[] = [];
  let j = 0;

  slots.forEach((slot, i) => {
    if (slot === "double") {
      slotIcons.push(
        <Double key={i} m1={materia[j]} m2={materia[j + 1]} links={links} />
      );
      j += 2;
    } else {
      slotIcons.push(<Orb key={i} m={materia[j]} />);
      j++;
    }
  });

  return <div style={{ display: "flex", gap: "0.5rem" }}>{slotIcons}</div>;
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
        slots={build.weapon_schema}
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
          slots={build.armor_schema}
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
    const { party, builds, links } = await fetchServerProps(params.party);
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
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
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
          <div style={{ width: "inherit", height: "fit-content" }}>
            <h3>{party.description}</h3>
          </div>
        </div>
        <br />

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
