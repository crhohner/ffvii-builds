"use client";

import { Database } from "@/utils/supabase/types";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import {
  allChars,
  allGames,
  characterDisplayString,
  gameDisplayString,
} from "@/utils/util";
import { useState } from "react";
import Image from "next/image";
import { Character, Party, Game } from "./page";

type TagProps = { field: string; value: string };

export default function PartyList(props: { parties: Party[] }) {
  const { parties } = props;
  const router = useRouter();
  const path = usePathname();

  const [selected, setSelected] = useState<Party[]>([]);
  const [tags, setTags] = useState<TagProps[]>([]);
  const [filterMenu, setFilterMenu] = useState(false);
  const [displayedParties, setDisplayedParties] = useState(parties);

  function updateDisplayedParties(tags: TagProps[]) {
    var displayed = [...parties];

    tags.forEach(({ field, value }) => {
      if (field == "game") {
        displayed = displayed.filter((party) => party.game == value);
      } else if (field == "character") {
        displayed = displayed.filter((party) => {
          return party.characters.includes(value as Character);
        });
      }
    });
    setDisplayedParties(displayed);
  }

  function removeTag(tag: TagProps): void {
    setTags((tags) => {
      const updated = tags.filter(({ value }) => value !== tag.value);
      updateDisplayedParties(updated);
      return updated;
    });
  }

  function containsTag(tag: TagProps): boolean {
    return tags.some((f) => f.field == tag.field && f.value == tag.value);
  }

  function addTag(tag: TagProps): void {
    if (!containsTag(tag)) {
      if (tag.field == "game") {
        setTags((tags) =>
          tags.filter(({ field: f, value: v }) => f !== "game")
        );
      } else if (tag.field == "character") {
        const chars = tags.filter(({ field }) => field == "character");
        while (chars.length > 2) {
          const char = chars.shift()!;
          removeTag(char);
        }
      }
      setTags((tags) => {
        const updated = [...tags, tag];
        updateDisplayedParties(updated);
        return updated;
      });
    }
  }

  function Tag(props: TagProps) {
    const { field, value } = props;
    return (
      <div className={styles["tag"]}>
        <div style={{ cursor: "pointer" }} onClick={() => removeTag(props)}>
          x
        </div>
        <div>
          {field == "character"
            ? characterDisplayString(value as Character)
            : gameDisplayString(value as Game)}
        </div>
      </div>
    );
  }

  function FilterRadio(props: {
    field: string;
    value: string;
    display: string;
  }) {
    const { display } = props;
    const tag = { field: props.field, value: props.value };
    return (
      <div style={{ display: "flex", alignItems: "center", gap: ".6rem" }}>
        {display}
        {containsTag(tag) ? (
          <Image
            src="radio.svg"
            height={20}
            width={20}
            alt=""
            onClick={() => removeTag(tag)}
          />
        ) : (
          <Image
            src="circle.svg"
            height={20}
            width={20}
            alt=""
            onClick={() => addTag(tag)}
          />
        )}
      </div>
    );
  }

  function FilterMenu() {
    return (
      <>
        <div className="shade"></div>
        <div className="popup">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <h2>Filters</h2>
            <Image
              onClick={() => setFilterMenu(false)}
              src="esc.svg"
              height={20}
              width={20}
              alt=""
            />
          </div>

          <br />
          <h3>Games</h3>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "1rem",
              padding: "1rem 0 0 0",
            }}
          >
            {allGames.map((game) => (
              <FilterRadio
                field={"game"}
                value={game}
                display={gameDisplayString(game)}
              />
            ))}
          </div>
          <br />
          <h3>Characters</h3>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "1rem",
              padding: "1rem 0 0 0",
            }}
          >
            {allChars.map((character) => (
              <FilterRadio
                field={"character"}
                value={character}
                display={characterDisplayString(character)}
              />
            ))}
          </div>
          <br />
          <button
            onClick={() =>
              setTags(() => {
                updateDisplayedParties([]);
                return [];
              })
            }
          >
            clear
          </button>
        </div>
      </>
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
          {gameDisplayString(party.game)}
        </div>
        <div className={styles["desc"]}>{party.description}</div>
      </div>
    );
  }

  //TODO:
  //search?
  //then after other pages are complete: add + delete
  //validation (are you sure??) for delete
  return (
    <>
      <div className={styles["toolbar"]}>
        <h1>Parties</h1>
        <button>new</button>
        <button>delete</button>
        <button onClick={() => setFilterMenu(true)}>filter</button>
        {tags.map(({ field, value }) => (
          <Tag field={field} value={value} />
        ))}
      </div>

      <div className={styles["parties"]}>
        {displayedParties.map((party) => (
          <Card party={party} />
        ))}
      </div>
      {filterMenu && <FilterMenu />}
    </>
  );
}
