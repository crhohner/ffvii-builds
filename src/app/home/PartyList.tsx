"use client";

import styles from "./page.module.css";
import { usePathname } from "next/navigation";
import {
  allChars,
  allGames,
  characterDisplayString,
  gameDisplayString,
} from "@/utils/util";
import { useState } from "react";
import Image from "next/image";
import { Character, DisplayParty, Game } from "./page";
import NewMenu from "./NewMenu";
import DeleteMenu from "./DeleteMenu";
import Link from "next/link";

export type TagProps = { field: string; value: string };

export default function PartyList(props: {
  parties: DisplayParty[];
  deleteAction: (parties: DisplayParty[]) => Promise<void>;
  addAction: (args: { name: string; game: string }) => Promise<DisplayParty>;
}) {
  const { parties } = props;
  const path = usePathname();

  const [selected, setSelected] = useState<DisplayParty[]>([]);
  const [tags, setTags] = useState<TagProps[]>([]);
  const [filterMenu, setFilterMenu] = useState(false);
  const [displayedParties, setDisplayedParties] =
    useState<DisplayParty[]>(parties);

  const [deleteMenu, setDeleteMenu] = useState(false);
  const [newMenu, setNewMenu] = useState(false);
  const [searchInput, setSearchInput] = useState<string>("");

  function getSelected(): DisplayParty[] {
    return selected;
  }

  function updateDisplayedParties(tags: TagProps[], searchInput: string) {
    let displayed = [...parties];

    tags.forEach(({ field, value }) => {
      if (field == "game") {
        displayed = displayed.filter((party) => party.game == value);
      } else if (field == "character") {
        displayed = displayed.filter((party) => {
          return party.characters.includes(value as Character);
        });
      }
    });

    if (searchInput != "") {
      displayed = displayed.filter((party) => party.name.includes(searchInput));
    }

    setSelected((selected) => selected.filter((s) => displayed.includes(s)));

    setDisplayedParties(displayed);
  }

  function removeTag(tag: TagProps): void {
    setTags((tags) => {
      const updated = tags.filter(({ value }) => value !== tag.value);
      updateDisplayedParties(updated, searchInput);
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
        updateDisplayedParties(updated, searchInput);
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

  function FilterRadio({
    display,
    field,
    value,
  }: {
    field: string;
    value: string;
    display: string;
  }) {
    const tag = { field: field, value: value };
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
                updateDisplayedParties([], searchInput);
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

  function Card({ party }: { party: DisplayParty }) {
    return (
      <div className={styles["card"]}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Link href={path + "/" + party.id}>{party.name}</Link>
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

  return (
    <>
      <div className={styles["toolbar"]}>
        <h1>Parties</h1>
        <button onClick={() => setNewMenu(true)}>new</button>
        <button
          onClick={() => {
            if (selected.length > 0) setDeleteMenu(true);
          }}
        >
          delete
        </button>
        <input
          onChange={(e) => {
            setSearchInput(e.target.value);
            updateDisplayedParties(tags, e.target.value);
          }}
          placeholder="search"
        ></input>

        <button onClick={() => setFilterMenu(true)}>filter</button>
        {tags.map(({ field, value }) => (
          <Tag field={field} value={value} key={value} />
        ))}
      </div>

      <div className={styles["parties"]}>
        {displayedParties.map((party) => (
          <Card party={party} key={party.id} />
        ))}
      </div>
      {filterMenu && <FilterMenu />}
      {deleteMenu && (
        <DeleteMenu
          setDeleteMenu={setDeleteMenu}
          getSelected={getSelected}
          deleteAction={props.deleteAction}
          setSelected={setSelected}
        />
      )}
      {newMenu && (
        <NewMenu addAction={props.addAction} setNewMenu={setNewMenu} />
      )}
    </>
  );
}
