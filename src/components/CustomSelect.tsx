import React, { useState } from "react";

type Option = { id: string; nome: string };

type CustomSelectProps = {
  type: "checkbox" | "radio";
  title?: string;
  values: Option[];
  name?: string;
  onChange?: (selected: Option[] | Option) => void;
};

export const CustomSelect: React.FC<CustomSelectProps> = ({
  type,
  title,
  values,
  name,
  onChange,
}) => {
  const [selectedArray, setSelectedArray] = useState<Option[]>([]);
  const [selectedSingle, setSelectedSingle] = useState<Option | null>(null);

  const handleChange = (value: Option) => {
    if (type === "checkbox") {
      const updated = selectedArray.some((v) => v.id === value.id)
        ? selectedArray.filter((v) => v.id !== value.id)
        : [...selectedArray, value];

      setSelectedArray(updated);
      onChange?.(updated);
    } else {
      setSelectedSingle(value);
      onChange?.(value);
    }
  };

  const getColorClass = (index: number) => {
    return index % 2 === 0
      ? "bg-amber-400 hover:bg-amber-500 peer-checked:bg-amber-600"
      : "bg-amber-700 hover:bg-amber-800 peer-checked:bg-amber-900";
  };

  return (
    <div className="w-full my-2">
      <h2 className="ml-1 mb-2 text-sm text-center font-semibold text-gray-700">
        {title}
      </h2>
      <div className="flex flex-wrap justify-center gap-2">
        {values.map((value, index) => {
          const id = `${name}-${index}`;
          const isChecked =
            type === "checkbox"
              ? selectedArray.some((v) => v.id === value.id)
              : selectedSingle?.id === value.id;

          return (
            <div key={index} className="w-auto min-w-[140px]">
              <input
                type={type}
                id={id}
                className="hidden peer"
                value={value.id}
                name={name}
                checked={isChecked}
                onChange={() => handleChange(value)}
              />
              <label
                htmlFor={id}
                className={`flex items-center justify-center text-center w-full 
                py-2 px-4 text-base font-medium text-white rounded-md cursor-pointer transition-colors
            ${getColorClass(
              index
            )} peer-checked:ring-2 peer-checked:ring-white peer-checked:text-white`}
              >
                {value.nome}
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
};
