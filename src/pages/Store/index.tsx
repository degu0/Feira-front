import { useEffect, useState } from "react";
import { Menu } from "../../components/Menu";
import banner from "../../../public/banner.jpg";
import loja from "../../../public/loja.jpg";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaStar } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { CardProduct } from "../../components/CardProduct";

type StoreType = {
  id: string;
  nome: string;
  categoria: string;
  lojista: string;
  localizacao: string;
  horario_funcionamento: string;
  cor: string;
  produtos: string[];
};

type ProductType = {
  id: string;
  nome: string;
};

type CategoryNameType = {
  id: string;
  nome: string;
};

export function Store() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [store, setStore] = useState<StoreType | null>(null);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [categoryName, setCategoryName] = useState<CategoryNameType | null>(
    null
  );

  const corMap: Record<string, string> = {
    vermelho: "bg-red-500",
    azul: "bg-blue-500",
    amarelo: "bg-yellow-500",
    rosa: "bg-pink-500",
    roxo: "bg-purple-500",
  };

  useEffect(() => {
    async function fetchStoreProductAndCategoryName() {
      try {
        const responseStore = await fetch(
          `http://localhost:3000/lojas?id=${id}`
        );
        if (!responseStore.ok) {
          throw new Error(`Erro ao buscar lojas: ${responseStore.status}`);
        }
        const dataStore: StoreType[] = await responseStore.json();
        const lojaEncontrada = dataStore[0];
        setStore(lojaEncontrada);

        const produtosEncontrados = await Promise.all(
          lojaEncontrada.produtos.map(async (idProduct) => {
            const response = await fetch(
              `http://localhost:3000/produtos?id=${idProduct}`
            );
            if (!response.ok) {
              throw new Error(`Erro ao buscar produto: ${response.status}`);
            }
            const data: ProductType[] = await response.json();
            return data[0];
          })
        );
        setProducts(produtosEncontrados);

        const responseCategory = await fetch(
          `http://localhost:3000/categoria?id=${lojaEncontrada.categoria}`
        );
        if (!responseCategory.ok) {
          throw new Error(
            `Erro ao buscar categoria: ${responseCategory.status}`
          );
        }
        const dataCategoryName: CategoryNameType =
          await responseCategory.json();
        setCategoryName(dataCategoryName[0]);
      } catch (error) {
        console.error("Erro ao buscar categoria e loja:", error);
      }
    }

    if (id) {
      fetchStoreProductAndCategoryName();
    }
  }, [id]);

  return (
    <div className="h-full">
      <div className="h-full">
        <div
          className="flex-1 bg-center bg-cover bg-no-repeat h-3/12"
          style={{ backgroundImage: `url(${banner})` }}
        >
          <FaArrowLeft
            onClick={() => navigate(-1)}
            className="text-3xl absolute top-4 left-3"
          />
          <img
            src={loja}
            alt="Imagem de perfil"
            className="w-20 rounded-full absolute top-44 left-39"
          />
        </div>
        <div className="mt-15 flex">
          <ul className="m-4 space-y-2">
            <p className="text-xl font-bold">{store?.nome}</p>
            <li className="flex items-center">
              <div
                className={`w-4 h-4 rounded-full ${corMap[store?.cor]} mr-3`}
              ></div>
              Setor {store?.cor} | {categoryName?.nome}
            </li>
            <li>{store?.localizacao}</li>
            <li className="flex items-center gap-2">
              <FaStar className="text-amber-500" /> 4.5
            </li>
          </ul>
          <div
            className="w-5 h-7 flex justify-center items-center 
          border-amber-600 border-1 roudend-lg cursor-pointer"
            onClick={() => navigate(`/store/details/${id}`)}
          >
            <IoIosArrowForward className="text-amber-600" />
          </div>
        </div>
        <div className="p-4 flex flex-col gap-5">
          <h1 className="text-xl font-semibold">Produtos</h1>
          <div className="grid grid-cols-2 gap-5">
            {products.map((product) => (
              <CardProduct
                key={product.id}
                id={product.id}
                nome={product.nome}
              />
            ))}
          </div>
        </div>
      </div>
      <Menu />
    </div>
  );
}
