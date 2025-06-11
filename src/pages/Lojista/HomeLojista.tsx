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
  const [quantidadeDeFavoritos, setQuantidadeFavoritos] = useState("")

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
    async function fetchStoreProductAndCategories() {
      try {
        const responseStore = await fetch(
          `http://127.0.0.1:8000/api/lojistas/${idLojista}/loja/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!responseStore.ok) throw new Error(`Erro ao buscar loja`);
        const dataStore: StoreType = await responseStore.json();
        console.log(dataStore);
        
        
        setStore(dataStore);
  
        const idStore = {
          id: dataStore.id,
        };
        localStorage.setItem("store", JSON.stringify(idStore));
  
        const responseCategorisName = await fetch(
          `http://127.0.0.1:8000/api/lojas/${dataStore.id}/categorias/`,
          {
            method: "GET",
            headers: {
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
  
        const responseProducts = await fetch(
          `http://127.0.0.1:8000/api/lojas/${dataStore.id}/produtos/`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!responseProducts.ok) throw new Error(`Erro ao buscar produto`);
        const dataProducts: ProductType[] = await responseProducts.json();
        
        setProducts(dataProducts);

        const responseQuantidadeLikes = await fetch(
          `http://127.0.0.1:8000/api/lojas/${dataStore.id}/favoritas/`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!responseQuantidadeLikes.ok) throw new Error(`Erro ao buscar produto`);
        const dataLikes = await responseQuantidadeLikes.json();
        setQuantidadeFavoritos(dataLikes.length.toString());
        
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    }
  
    if (idLojista && token) {
      fetchStoreProductAndCategories();
    }
  }, [token, idLojista]);
  

  return (
    <div className="min-h-screen bg-gray-200">
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
              <h3 className="text-zinc-800">Quantidade de Gostei</h3>
              <p className="text-sm text-gray-500">(por semestre)</p>
            </div>
            <h1 className="text-4xl text-green-600 text-end">{quantidadeDeFavoritos}</h1>
          </div>
          <div className="min-w-[220px] bg-white rounded shadow p-5 flex flex-col gap-5">
            <div>
              <h3 className="text-zinc-800">Quantidade de Interações</h3>
              <p className="text-sm text-gray-500">(por semestre)</p>
            </div>
            <h1 className="text-4xl text-red-600 text-end">842</h1>
          </div>
        </div>
      </div>

      <div className="bg-white rounded shadow p-6 pb-28">
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
          <div className="my-5">
            <h3 className="text-xl font-semibold mb-3">Produtos mais vistos</h3>
            <div className="grid grid-cols-2 gap-4">
              {products.map((product) => (
                <CardProduct
                  key={product.id}
                  id={product.id}
                  nome={product.nome}
                  imagem={`http://127.0.0.1:8000${product.imagem}`}
                  esconderFavorito={true}             
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
