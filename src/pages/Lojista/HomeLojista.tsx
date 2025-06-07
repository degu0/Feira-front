import { FaStar } from "react-icons/fa";
import { CardProduct } from "../../components/CardProduct";
import { Menu } from "../../components/Menu";
import { useEffect, useState } from "react";
import { Chart } from "react-google-charts";

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

const lojaViewsData = [
  ["Tipo", "Visualizações"],
  ["Locais", 120],
  ["Turistas", 80],
];

export function HomeLojista() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const idLojista = user.id;
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
          `http://127.0.0.1:8000/api/lojas/2/`,
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
          `http://127.0.0.1:8000/api/lojas/2/produtos/`,
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
          `http://127.0.0.1:8000/api/lojas/2/categorias/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!responseCategorisName.ok)
          throw new Error("Erro ao buscar categoria");
        const dataCategories: CategoryNameType =
          await responseCategorisName.json();
        const categoryNames = dataCategories.map((category) => category.nome);
        setCategoryNames(categoryNames);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    }

    fetchStoreProductAndCategories();
  }, [token]);

  return (
    <div className="bg-gray-200">
      <div
        className="relative h-32 w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${store?.banner})` }}
      >
        <img
          src={store?.logo}
          alt="Imagem da loja"
          className="w-24 h-24 rounded-full absolute bottom-[-2rem] left-1/2 transform -translate-x-1/2 border-4 border-white shadow-md"
        />
      </div>

      <div className="mt-3 px-4 pt-8 pb-5 flex items-start justify-between bg-white rounded-lg shadow">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold">{store?.nome}</h2>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div
              className={`w-3 h-3 rounded-full ${corMap[store?.setor]}`}
            ></div>
            <span>
              Setor {store?.setor} | {categoryNames.join(", ")}
            </span>
          </div>
          <p className="text-sm text-gray-500">{store?.localizacao}</p>
        </div>
      </div>
      <div className="overflow-x-auto font-medium">
        <div className="flex gap-4 p-4 whitespace-nowrap">
          <div className="min-w-[200px] bg-white rounded shadow p-5 flex flex-col gap-5">
            <div>
              <h3 className="text-zinc-800">Visualização do Perfil</h3>
              <p className="text-sm text-gray-500">(por semestre)</p>
            </div>
            <h1 className="text-4xl text-green-600 text-end">1102</h1>
          </div>
          <div className="min-w-[200px] bg-white rounded shadow p-5  flex flex-col gap-5">
            <div>
              <h3>Quantidade de Interações</h3>
              <p className="text-sm text-gray-500">(por semestre)</p>
            </div>
            <h1 className="text-4xl text-red-600 text-end">842</h1>
          </div>
        </div>
      </div>

      <div className="bg-white rounded shadow p-4">
        <div className=" text-xl font-semibold border-b border-amber-600/25">
          <h2>Perfil do Público</h2>
          <Chart
            chartType="PieChart"
            width="100%"
            height="300px"
            data={lojaViewsData}
            options={{
              colors: ["#d97706", "#78350f"],
            }}
          />
        </div>
        <div>
          <div className="">
            <h3 className="text-xl font-semibold mb-3">Produtos mais vistos</h3>
            <div className="grid grid-cols-2 gap-4">
              {products.map((product) => (
                <CardProduct
                  key={product.id}
                  id={product.id}
                  nome={product.nome}
                  imagem={product.imagem}
                  heart={false}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <Menu type="Lojista" />
    </div>
  );
}
