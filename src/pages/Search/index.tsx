import { useEffect, useState } from "react";
import { SearchInput } from "../../components/SearchInput";
import { useNavigate } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";

type CategoryType = {
  id: string;
  nome: string;
};

export function Search() {
  const navigate = useNavigate();
  const [category, setCategory] = useState<CategoryType[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch("http://localhost:3000/categoria");
        const data: CategoryType[] = await response.json();

        if (response.ok) {
          if (Array.isArray(data)) {
            setCategory(data);
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

  return (
    <div className="h-full">
      <div className="flex items-center">
        <div className="px-4 pt-4" onClick={() => navigate('/')}>
          <FaArrowLeftLong className="text-2xl" />
        </div>
        <SearchInput />
      </div>
      <div className="my-10">
        <div className="grid grid-cols-2 gap-4 px-4">
          {category.map((cat) => (
            <div
              key={cat.id}
              className="border-none rounded w-full p-3 bg-white shadow text-center cursor-pointer"
            >
              {cat.nome}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
