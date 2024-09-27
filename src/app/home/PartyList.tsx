"use client";

import { Database } from "@/utils/supabase/types";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { gameToString } from "@/utils/util";
import { useState } from "react";
import Image from "next/image";

type Party = Database["public"]["Tables"]["party"]["Row"];
type TagProps = { field: string; value: string };

export default function PartyList(props: { parties: Party[] }) {
  const { parties } = props;
  const router = useRouter();
  const path = usePathname();
  const [selected, setSelected] = useState<Party[]>([]);
  const [tags, setTags] = useState<TagProps[]>([
    { field: "hi", value: "aerith" },
  ]);

  function Tag(props: TagProps) {
    const { field, value } = props;
    return (
      <div className={styles["tag"]}>
        <div
          style={{ cursor: "pointer" }}
          onClick={() => {
            setTags((tags) =>
              tags.filter(
                ({ field: f, value: v }) => v !== value && f !== field
              )
            );
          }}
        >
          x
        </div>
        <div>{value}</div>
      </div>
    );
  }

  function Card(props: { party: Party }) {
    const { party } = props;

    return (
      <div className={styles["card"]}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div onClick={() => router.push(path + "/" + party.id)}>
            {" "}
            {party.name}
          </div>
          {selected.includes(party) ? (
            <Image
              src="check.svg"
              height={20}
              width={20}
              alt=""
              onClick={() => {
                setSelected((selected) => selected.filter((p) => p !== party));
              }}
            />
          ) : (
            <div
              onClick={() => {
                setSelected((selected) => [...selected, party]);
              }}
              className={styles["circle"]}
            />
          )}
        </div>
        <div style={{ display: "flex", gap: "0.2rem" }}>
          <h3>GAME</h3>
          {gameToString(party.game)}
        </div>
        <div className={styles["desc"]}>{party.description}</div>
      </div>
    );
  }

  //TODO:
  //add filter menu
  //filter actually working
  //search
  //then after other pages are complete: add + delete
  //validation (are you sure??) for delete
  return (
    <>
      <div className={styles["toolbar"]}>
        <h1>Parties</h1>
        <button>new</button>
        <button>delete</button>
        <button>filter</button>
        {tags.map(({ field, value }) => (
          <Tag field={field} value={value} />
        ))}
      </div>

      <div className={styles["parties"]}>
        {parties.map((party) => (
          <Card party={party} />
        ))}
      </div>
    </>
  );
}

/*<div className="shade"></div>
      <div className="popup">testing popups testing hi</div>*/
