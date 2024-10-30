import Select, { StylesConfig } from "react-select";

export interface Option {
  value: string;
  label: string;
}

export default function CustomSelect({
  options,
  value,
  handler,
  searchable,
}: {
  options: { value: any; label: string }[];
  value: Option | null;
  handler: (option: Option | null) => void;
  searchable: boolean;
}) {
  const customStyles: StylesConfig<Option, false> = {
    control: (base, state) => ({
      ...base,
      color: "white",
      borderRadius: "12px",
      background: "none",
      borderWidth: "2px",
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

      ":hover": {
        backgroundColor: "var(--secondary-text-color)",
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
      value={value}
      isSearchable={searchable}
      onChange={handler}
      styles={customStyles}
    />
  );
}
