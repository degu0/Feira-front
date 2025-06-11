import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Menu } from "../../components/Menu";
import { Header } from "../../components/Header";
import { CardStore } from "../../components/CardStore";

type CategoryNameType = {
  nome: string;
};

type StoresType = {
  id: string;
  nome: string;
  categoria: string;
  setor: string;
  localizacao: string;
};

export function ExploreCategory() {
  const token = localStorage.getItem("token");
  const { category } = useParams();
  const [categoryName, setCategoryName] = useState<CategoryNameType>();
  const [stores, setStores] = useState<StoresType[]>([]);

  const corMap: Record<number, string> = {
    1: "bg-red-500",      
    2: "bg-yellow-500",   
    3: "bg-green-500",    
    4: "bg-purple-500",   
    5: "bg-amber-800",
    6: "bg-violet-400",   
    7: "bg-orange-500",   
    8: "bg-pink-500",     
    9: "bg-blue-500",     
    10: "bg-white",       
  };
  

  useEffect(() => {
    async function fetchCategoryNameAndStores() {
      try {
        const responseCategory = await fetch(
          `http://127.0.0.1:8000/api/categorias/${category}/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!responseCategory.ok) {
          throw new Error(
            `Erro ao buscar categoria: ${responseCategory.status}`
          );
        }
        const dataCategoryName: CategoryNameType =
          await responseCategory.json();
        setCategoryName(dataCategoryName);

        const responseStores = await fetch(
          `http://127.0.0.1:8000/api/categorias/${category}/lojas/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!responseStores.ok) {
          throw new Error(`Erro ao buscar lojas: ${responseStores.status}`);
        }
        const dataStores: StoresType[] = await responseStores.json();
        if (Array.isArray(dataStores)) {
          setStores(dataStores);
        } else {
          console.error("Resposta inválida da API:", dataStores);
        }
      } catch (error) {
        console.error("Erro ao buscar categoria e lojas:", error);
      }
    }

    if (category) {
      fetchCategoryNameAndStores();
    }
  }, [category, token]);

  return (
    <div className="h-full">
      <div className="h-full">
        <Header />
        <h1 className="font-semibold text-center text-2xl my-4">
          {categoryName?.nome || "Categoria não encontrada"}
        </h1>

        {stores.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">
            Nenhuma loja encontrada nesta categoria.
          </p>
        ) : (
          <div>
            {stores.map((store) => (
              <CardStore
                key={store.id}
                store={store}
                categories={categoryName}
                corMap={corMap}
              />
            ))}
          </div>
        )}
      </div>
      <Menu type="Cliente" />
    </div>
  );
}
