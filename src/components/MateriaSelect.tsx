import Select, { StylesConfig } from "react-select";

export interface MateriaOption {
  value: string | null;
  label: string;
  context: string | null;
  color: string;
}

function emojiFromColor(color: string) {
  switch (color) {
    case "red": {
      return "🔴";
    }
    case "blue": {
      return "🔵";
    }
    case "green": {
      return "🟢";
    }
    case "purple": {
      return "🟣";
    }
    case "yellow": {
      return "🟡";
    }
    default:
      return "";
  }
}

export default function MateriaSelect({
  value,
  handler,
  searchable,
  options,
}: {
  options: MateriaOption[];
  value: MateriaOption | null;
  handler: (option: MateriaOption | null) => void;
  searchable: boolean;
}) {
  const customStyles: StylesConfig<MateriaOption, false> = {
    control: (base, state) => ({
      ...base,
      color: "rgb(0, 0, 50)",
      width: "9rem",
      zIndex: "10",
      borderRadius: "12px",
      borderWidth: "2px",
      borderColor: "white",
      background: "var(--background-color)",
    }),
    dropdownIndicator: (base) => ({
      ...base,
      display: "none",
    }),
    menu: (base) => ({
      ...base,
      color: "rgb(0, 0, 50)",
      borderRadius: "10px",
    }),
    menuList: (base) => ({
      ...base,
      color: "rgb(0, 0, 50)",
    }),
    option: (base, state) => ({
      ...base,
      color: state.isSelected ? "white" : "rgb(0, 0, 50)",
      backgroundColor: state.isSelected ? "rgb(0, 142, 171)" : "white",
      wordBreak: "break-word",

      ":hover": {
        backgroundColor: "rgb(0, 142, 171)",
        color: "white",
      },
    }),
    placeholder: (styles) => ({
      ...styles,
      color: "var(--secondary-text-color)",
    }),
    singleValue: (base) => ({
      ...base,
      color: "white",
    }),
    input: (provided) => ({
      ...provided,
      color: "var(--secondary-text-color)",
    }),
  };

  return (
    <Select
      options={options}
      formatOptionLabel={(option, { context }) =>
        context === "menu" ? (
          <>
            <div
              style={{ display: "flex", gap: "0.2rem", alignItems: "center" }}
            >
              <div style={{ fontSize: "14px" }}>
                {emojiFromColor(option.color)}
              </div>
              {option.label}
            </div>
            <h3>{option.context}</h3>
          </>
        ) : (
          <div style={{ display: "flex", gap: "0.2rem", alignItems: "center" }}>
            <div style={{ color: "white" }}>{option.label}</div>
            <div style={{ fontSize: "8px" }}>
              {emojiFromColor(option.color)}
            </div>
          </div>
        )
      }
      value={value}
      isSearchable={searchable}
      onChange={handler}
      styles={customStyles}
      menuIsOpen={true}
      menuShouldScrollIntoView
      menuPlacement="auto"
    />
  );
}
