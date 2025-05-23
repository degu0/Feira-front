import { useEffect, useState } from "react";
import { Menu } from "../../components/Menu";
import banner from "../../../public/banner.jpg";
import loja from "../../../public/loja.jpg";
import { useNavigate, useParams } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { CardProduct } from "../../components/CardProduct";
import { Header } from "../../components/Header";

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
  imagem: string
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
          `http://localhost:3001/lojas?id=${id}`
        );
        if (!responseStore.ok) throw new Error(`Erro ao buscar loja`);
        const dataStore: StoreType[] = await responseStore.json();
        const lojaEncontrada = dataStore[0];
        setStore(lojaEncontrada);

        const produtosEncontrados = await Promise.all(
          lojaEncontrada.produtos.map(async (idProduct) => {
            const response = await fetch(
              `http://localhost:3001/produtos?id=${idProduct}`
            );
            if (!response.ok) throw new Error(`Erro ao buscar produto`);
            const data: ProductType[] = await response.json();
            return data[0];
          })
        );
        setProducts(produtosEncontrados);

        const responseCategory = await fetch(
          `http://localhost:3001/categoria?id=${lojaEncontrada.categoria}`
        );
        if (!responseCategory.ok) throw new Error(`Erro ao buscar categoria`);
        const dataCategoryName: CategoryNameType[] =
          await responseCategory.json();
        setCategoryName(dataCategoryName[0]);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    }

    if (id) fetchStoreProductAndCategoryName();
  }, [id]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="relative h-48 w-full bg-cover bg-center" style={{ backgroundImage: `url(${banner})` }}>
        <Header />
        <img
          src={loja}
          alt="Imagem da loja"
          className="w-24 h-24 rounded-full absolute bottom-[-2rem] left-1/2 transform -translate-x-1/2 border-4 border-white shadow-md"
        />
      </div>

      <div className="mt-14 px-4 flex items-start justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold">{store?.nome}</h2>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className={`w-3 h-3 rounded-full ${corMap[store?.cor]}`}></div>
            <span>Setor {store?.cor} | {categoryName?.nome}</span>
          </div>
          <p className="text-sm text-gray-500">{store?.localizacao}</p>
          <div className="flex items-center gap-1 text-sm text-amber-600">
            <FaStar className="text-md" />
            <span>4.5</span>
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
            <CardProduct key={product.id} id={product.id} nome={product.nome} imagem={product.imagem} />
          ))}
        </div>
      </div>

      <Menu />
    </div>
  );
}
