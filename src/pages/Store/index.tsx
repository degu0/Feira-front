import { useEffect, useState } from "react";
import { Menu } from "../../components/Menu";
import { useNavigate, useParams } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { CardProduct } from "../../components/CardProduct";
import { Header } from "../../components/Header";
import logo from "../../../public/loja.jpg"
import banner from "../../../public/banner.jpg"

type StoreType = {
  id: string;
  nome: string;
  logo: string;
  banner: string;
  categorias: string[];
  lojista: string;
  localizacao: string;
  horario_funcionamento: string;
  setor: string;
  produtos: string[];
  nota_media: number;
};

type ProductType = {
  id: string;
  nome: string;
  imagem: string;
};

type CategoryNameType = { nome: string }[];

export function Store() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { id } = useParams();
  const [store, setStore] = useState<StoreType | null>(null);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [categoryNames, setCategoryNames] = useState<string[]>([]);

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
    async function fetchStoreProductAndCategories() {
      try {
        const responseStore = await fetch(
          `http://127.0.0.1:8000/api/lojas/${id}/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!responseStore.ok) throw new Error(`Erro ao buscar loja`);
        const dataStore: StoreType[] = await responseStore.json();
        setStore(dataStore);

        const responseProducts = await fetch(
          `http://127.0.0.1:8000/api/lojas/${id}/produtos/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!responseProducts.ok) throw new Error(`Erro ao buscar produto`);
        const dataProducts: ProductType[] = await responseProducts.json();
        setProducts(dataProducts);

        const responseCategorisName = await fetch(
          `http://127.0.0.1:8000/api/lojas/${id}/categorias/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!responseCategorisName.ok) throw new Error("Erro ao buscar categoria");
        const dataCategories: CategoryNameType = await responseCategorisName.json();
        const categoryNames = dataCategories.map((category) => category.nome);
        setCategoryNames(categoryNames);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    }

    if (id) fetchStoreProductAndCategories();
  }, [id, token]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div
        className="relative h-48 w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${banner})` }}
      >
        <Header />
        <img
          src={logo}
          alt="Imagem da loja"
          className="w-24 h-24 rounded-full absolute bottom-[-2rem] left-1/2 transform -translate-x-1/2 border-4 border-white shadow-md"
        />
      </div>

      <div className="mt-14 px-4 flex items-start justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold">{store?.nome}</h2>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div
              className={`w-3 h-3 rounded-full ${corMap[store?.setor ?? ""]}`}
            ></div>
            <span>
              Setor {store?.setor} | {categoryNames.join(", ")}
            </span>
          </div>
          <p className="text-sm text-gray-500">{store?.localizacao}</p>
          <div className="flex items-center gap-1 text-sm text-amber-600">
            <FaStar className="text-md" />
            <span>{store?.nota_media ? store?.nota_media : 5 }</span>
          </div>
        </div>

        <button
          onClick={() => navigate(`/store/details/${id}`)}
          className="p-2 border border-amber-600 rounded-md hover:bg-amber-50 transition"
        >
          <IoIosArrowForward className="text-amber-600 text-xl" />
        </button>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold mb-3">Produtos</h3>
        <div className="grid grid-cols-2 gap-4">
          {products.map((product) => (
            <CardProduct
              key={product.id}
              id={product.id}
              nome={product.nome}
              imagem={product.imagem}
              heart
            />
          ))}
        </div>
      </div>

      <Menu type="Cliente" />
    </div>
  );
}
