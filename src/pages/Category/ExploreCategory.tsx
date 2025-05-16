import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Menu } from "../../components/Menu";
import { FaRegHeart, FaStar } from "react-icons/fa";
import loja from "../../../public/loja.jpg";
import { FaArrowLeftLong } from "react-icons/fa6";

type CategoryNameType = {
  nome: string;
};

type StoresType = {
  id: string;
  nome: string;
};

export function ExploreCategory() {
  const navigate = useNavigate()
  const { category } = useParams();
  const [categoryName, setCategoryName] = useState<CategoryNameType>();
  const [stores, setStores] = useState<StoresType[]>([]);

  useEffect(() => {
    async function fetchCategoryNameAndStores() {
      try {
        const responseCategory = await fetch(
          `http://localhost:3000/categoria?id=${category}`
        );
        if (!responseCategory.ok) {
          throw new Error(
            `Erro ao buscar categoria: ${responseCategory.status}`
          );
        }
        const dataCategoryName: CategoryNameType =
          await responseCategory.json();
        setCategoryName(dataCategoryName[0]);

        const responseStores = await fetch(
          `http://localhost:3000/lojas?categoria=${category}`
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
  }, [category]);

  return (
    <div className="h-full">
      <div className="h-full">
        <div
          className="bg-gray-200 rounded-full text-2xl w-10 h-10 flex items-center justify-center m-3"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeftLong />
        </div>
        <h1 className="text-bold text-center text-xl my-4">
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
                className="py-10 px-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-6">
                  <div>
                    <img
                      src={loja}
                      alt="Imagem de perfil"
                      className="w-12 rounded-full"
                    />
                  </div>
                  <div>
                    <p className="text-lg font-semibold">{store.nome}</p>
                    <p className="flex items-center gap-2">
                      <FaStar className="text-amber-500" />
                      4.5
                    </p>
                  </div>
                </div>
                <div>
                  <FaRegHeart />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <Menu />
    </div>
  );
}
