import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu } from "../../components/Menu";
import Banner from "../../../public/banner_categoria.png";
import moda_intima from "../../../public/Icones_Categoria/moda_intima.png";
import moda_praia from "../../../public/Icones_Categoria/moda_praia.png";
import moda_fitness from "../../../public/Icones_Categoria/moda_fitness.png";
import plus_size from "../../../public/Icones_Categoria/plus_size.png";
import bebes from "../../../public/Icones_Categoria/bebes.png";
import moda_infantil from "../../../public/Icones_Categoria/moda_infantil.png";
import moda_feminina from "../../../public/Icones_Categoria/moda_feminina.png";
import moda_esportiva from "../../../public/Icones_Categoria/moda_esportiva.png";
import moda_masculina from "../../../public/Icones_Categoria/moda_masculina.png";
import importados from "../../../public/Icones_Categoria/importados.png";
import artesanato from "../../../public/Icones_Categoria/artesanato.png";
import brinquedos from "../../../public/Icones_Categoria/brinquedos.png";
import acessorios from "../../../public/Icones_Categoria/acessorios.png";
import calcados from "../../../public/Icones_Categoria/calcados.png";
import utilidades from "../../../public/Icones_Categoria/utilidades.png";
import cama_mesa_banho from "../../../public/Icones_Categoria/cama_mesa_banho.png";

type CategoryType = {
  id: string;
  nome: string;
};

export function Category() {
  const token = localStorage.getItem("token");
  const categoryImages: Record<string, string> = {
    "Moda Íntima": moda_intima,
    "Moda Praia": moda_praia,
    "Moda Fitness": moda_fitness,
    "Plus Size": plus_size,
    "Bebês": bebes,
    "Moda Infantil": moda_infantil,
    "Moda Feminina": moda_feminina,
    "Moda Esportiva": moda_esportiva,
    "Moda Masculina": moda_masculina,
    "Importados": importados,
    "Artesanato": artesanato,
    "Brinquedos": brinquedos,
    "Acessórios": acessorios,
    "Calçados": calcados,
    "Utilidades": utilidades,
    "Cama, Mesa e Banho": cama_mesa_banho
  };
  const navigate = useNavigate();
  const [category, setCategory] = useState<CategoryType[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/categorias/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
        const data: CategoryType[] = await response.json();

        if (response.ok) {
          if (Array.isArray(data.results)) {
            setCategory(data.results);
          } else {
            console.error("Resposta inválida da API:", data);
          }
        } else {
          console.error("Erro no fetch de dados dos categorias:", data);
        }
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
      }
    }
    loadData();
  }, []);

  const getColorClass = (index: number) => {
    return index % 2 === 0 ? "bg-amber-600" : "bg-amber-900";
  };

  return (
    <div className="h-full flex flex-col gap-3 bg-gray-200 overflow-auto">
      <div>
        <img src={Banner} alt="Banner de catagorias" />
      </div>
      <div className="h-full px-4 flex flex-col gap-3 bg-white">
        <h2 className="text-lg mt-2">Categorias</h2>
        <div className="grid grid-cols-2 gap-3">
          {category.map((cat) => (
            <div
              key={cat.id}
              className={`border-none rounded w-44 h-16 p-3 ${getColorClass(
                cat.id
              )} text-white shadow text-center cursor-pointer flex items-end justify-between text-sm`}
              onClick={() => navigate(`/category/${cat.id}`)}
            >
              {cat.nome}
              <img
                src={categoryImages[cat.nome] || "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=500&auto=format&fit=crop"}
                alt={cat.nome}
                className="w-10 h-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
      <Menu type="Cliente" />
    </div>
  );
}
