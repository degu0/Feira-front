import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { CardProduct } from "../../components/CardProduct";
import { SearchInput } from "../../components/SearchInput";
import { FaArrowLeft, FaStar } from "react-icons/fa6";
import { Menu } from "../../components/Menu";
import { HeartButton } from "../../components/HeartButton";

type ProductType = {
  id: string;
  nome: string;
  categoria: number;
  imagem: string;
};

type StoreType = {
  id: string;
  nome: string;
  logo: string;
  setor: string;
  localizacao: string;
  nota_media?: number;
  categorias: number[];
};

type CategoryType = {
  id: number;
  nome: string;
};

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

export function SearchResults() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const idCliente = user.idCliente;
  const navigate = useNavigate();
  const { searchTerm } = useParams<{ searchTerm: string }>();
  const [products, setProducts] = useState<ProductType[]>([]);
  const [stores, setStores] = useState<StoreType[]>([]);
  const [categories, setCategories] = useState<Record<number, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const query = searchTerm || "";

  useEffect(() => {
    async function fetchProductsAndCategories() {
      try {
        setIsLoading(true);
        const res = await fetch(
          `http://127.0.0.1:8000/api/pesquisa/?nome=${encodeURIComponent(
            query
          )}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch products");

        const data = await res.json();

        setProducts(data.produtos || []);
        setStores(data.lojas || []);
        console.log("Produtos:", data.produtos);
        console.log("Lojas:", data.lojas);

        const allCategoryIds = [
          ...new Set([
            ...data.produtos.map((p: ProductType) => p.categoria),
            ...(data.lojas?.flatMap((l: StoreType) => l.categorias) || []),
          ]),
        ];

        const categoryPromises = allCategoryIds.map(async (id: number) => {
          const response = await fetch(
            `http://127.0.0.1:8000/api/categoria?id=${id}`
          );
          if (!response.ok) throw new Error(`Failed to fetch category ${id}`);
          const categoryData: CategoryType[] = await response.json();
          return { id, name: categoryData[0]?.nome || "Desconhecida" };
        });

        const categoryResults = await Promise.all(categoryPromises);
        const categoryMap = categoryResults.reduce((acc, curr) => {
          acc[curr.id] = curr.name;
          return acc;
        }, {} as Record<number, string>);

        setCategories(categoryMap);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProductsAndCategories();
  }, [query, token]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="sticky top-0 z-10 bg-white px-4 py-3 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-neutral-50 rounded-[5px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] 
                    flex items-center justify-center cursor-pointer hover:bg-neutral-100 transition-colors"
          >
            <FaArrowLeft className="w-5 h-5 text-amber-600" />
          </button>
          <div className="flex-1">
            <SearchInput defaultValue={query} />
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 pb-20">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">Buscando produtos...</p>
          </div>
        ) : products.length > 0 ? (
          <>
            <h1 className="text-lg font-semibold px-4 py-3 text-gray-800">
              Resultados para "{query}"
            </h1>
            <div className="grid grid-cols-2 gap-4 px-4">
              {products.map((product) => (
                <CardProduct
                  key={product.id}
                  id={product.id}
                  nome={product.nome}
                  categoria={
                    categories[product.categoria] || "Categoria desconhecida"
                  }
                  imagem={product.imagem}
                  heart
                />
              ))}
            </div>
          </>
        ) : stores.length > 0 ? (
          <>
            <h1 className="text-lg font-semibold px-4 py-3 text-gray-800">
              Lojas encontradas para "{query}"
            </h1>
            {stores.slice(0, 3).map((store) => (
              <Link
                key={store.id}
                to={`/store/${store.id}`}
                className="py-2 px-4 flex items-center justify-between"
              >
                <div className="mr-5">
                  <img
                    src={store.logo}
                    alt="Imagem de perfil"
                    className="w-20 h-20 rounded-[5px]"
                  />
                </div>
                <div className="flex-1 border-b border-amber-600/25 py-2">
                  <div className="flex justify-between items-center">
                    <p className="text-lg font-semibold">{store.nome}</p>
                    <HeartButton
                      idCliente={idCliente}
                      id={store.id}
                      tipo="Loja"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          corMap[store.setor] || "bg-gray-400"
                        }`}
                      />
                      <span>
                        Setor {store.setor} |{" "}
                        {store.categorias
                          .map((id) => categories[id] || "Desconhecida")
                          .join(", ")}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{store.localizacao}</p>
                    <div className="flex items-center gap-1 text-sm text-amber-600">
                      <FaStar className="text-md" />
                      <span>{store.nota_media ?? 5}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center px-4">
            <p className="text-gray-500 text-lg">
              Nenhum resultado encontrado para "{query}"
            </p>
            <button
              onClick={() => navigate(-1)}
              className="mt-4 text-amber-600 font-medium"
            >
              Voltar
            </button>
          </div>
        )}
      </main>

      <Menu type="Cliente" />
    </div>
  );
}
