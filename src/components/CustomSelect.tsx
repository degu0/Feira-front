import React, { useState } from "react";
type Option = { id: string; nome: string };

type CustomSelectProps = {
  type: "checkbox" | "radio";
  title?: string;
  values: Option[];
  name?: string;
  image: boolean;
  onChange?: (selected: Option[] | Option) => void;
};

export const CustomSelect: React.FC<CustomSelectProps> = ({
  type,
  title,
  values,
  name,
  image,
  onChange,
}) => {
  const [selectedArray, setSelectedArray] = useState<Option[]>([]);
  const [selectedSingle, setSelectedSingle] = useState<Option | null>(null);
  const categoryImages: Record<string, string> = {
    "Moda Íntima": "/Icones_Categoria/moda_intima.png",
    "Moda Praia": "/Icones_Categoria/moda_praia.png",
    "Moda Fitness": "/Icones_Categoria/moda_fitness.png",
    "Plus Size": "/Icones_Categoria/plus_size.png",
    Bebês: "/Icones_Categoria/bebes.png",
    "Moda Infantil": "/Icones_Categoria/moda_infantil.png",
    "Moda Feminina": "/Icones_Categoria/moda_feminina.png",
    "Moda Esportiva": "/Icones_Categoria/moda_esportiva.png",
    "Moda Masculina": "/Icones_Categoria/moda_masculina.png",
    Importados: "/Icones_Categoria/importados.png",
    Artesanato: "/Icones_Categoria/artesanato.png",
    Brinquedos: "/Icones_Categoria/brinquedos.png",
    Acessórios: "/Icones_Categoria/acessorios.png",
    Calçados: "/Icones_Categoria/calcados.png",
    Utilidades: "/Icones_Categoria/utilidades.png",
    "Cama, Mesa e Banho": "/Icones_Categoria/cama_mesa_banho.png",
  };

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
      ? "bg-amber-600 hover:border-4 hover:outline-amber-400 peer-checked:outline-4 peer-checked:outline-gray-700"
      : "bg-amber-900 hover:border-4 hover:outline-amber-400 peer-checked:outline-4 peer-checked:outline-gray-700";
  };
  console.log(categoryImages["Moda Masculina"]);

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
            <div key={index} className="w-44 h-15">
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
                className={`text-white shadow text-center flex items-end justify-around text-sm w-full h-full rounded-[5px] pb-2
                ${getColorClass(
                  index
                )} peer-checked:ring-2 peer-checked:ring-white`}
              >
                {value.nome}
                {image && (
                  <img
                    src={
                      categoryImages[value.nome] ||
                      "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=500&auto=format&fit=crop"
                    }
                    alt={value.nome}
                    className="w-11.5  object-cover"
                    loading="lazy"
                  />
                )}
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
};
