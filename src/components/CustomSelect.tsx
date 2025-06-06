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
      ? "bg-amber-600 hover:border-4 hover:border-amber-400 peer-checked:border-4 peer-checked:border-amber-400"
      : "bg-amber-900 hover:border-4 hover:border-amber-400 peer-checked:border-4 peer-checked:border-amber-400";
  };

  return (
    <div className="w-full my-4">
      {title && (
        <h2 className="text-center text-gray-700 font-semibold text-lg mb-4">
          {title}
        </h2>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {values.map((value, index) => {
          const id = `${name}-${index}`;
          const isChecked =
            type === "checkbox"
              ? selectedArray.some((v) => v.id === value.id)
              : selectedSingle?.id === value.id;

          return (
            <div key={index} className="min-w-[120px]">
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
                className={`block text-center py-2 px-3 text-sm font-medium text-white rounded-lg cursor-pointer transition
                ${getColorClass(index)} peer-checked:ring-2 peer-checked:ring-white`}
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
