import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Menu } from "../../components/Menu";
import { FaRegHeart, FaStar } from "react-icons/fa";
import loja from "../../../public/loja.jpg";
import { Header } from "../../components/Header";

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

  const corMap: Record<string, string> = {
    1: "bg-red-500",
    2: "bg-yellow-500",
    3: "bg-green-500",
    4: "bg-purple-500",
    5: "bg-brown-500",
    6: "bg-violet-500",
    7: "bg-orange-500",
    8: "bg-pink-500",
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
        const dataCategoryName: CategoryNameType = await responseCategory.json();
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
              <Link
                key={store.id}
                to={`/store/${store.id}`}
                className="py-2 px-4 flex items-center justify-between"
              >
                <div className="mr-5">
                  <img
                    src={loja}
                    alt="Imagem de perfil"
                    className="w-20 h-20 rounded-[5px]"
                  />
                </div>
                <div className="flex-1 border-b border-amber-600/25 py-2">
                  <div className="flex justify-between items-center">
                    <p className="text-lg font-semibold">{store.nome}</p>
                    <FaRegHeart className="text-amber-600" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div
                        className={`w-3 h-3 rounded-full ${corMap[store?.setor]}`}
                      ></div>
                      <span>
                        Setor {store?.setor} | {categoryName?.nome}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {store?.localizacao}
                    </p>
                    <div className="flex items-center gap-1 text-sm text-amber-600">
                      <FaStar className="text-md" />
                      <span>4.5</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <Menu type="Cliente" />
    </div>
  );
}
