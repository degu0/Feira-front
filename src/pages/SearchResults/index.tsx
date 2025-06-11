import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CardProduct } from "../../components/CardProduct";
import { SearchInput } from "../../components/SearchInput";
import { FaArrowLeft } from "react-icons/fa6";
import { Menu } from "../../components/Menu";
import { CardStore } from "../../components/CardStore";

type ProductType = {
  id: string;
  nome: string;
  categorias: number[];
  imagem: string;
  favoritado: boolean;
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

export function SearchResults() {
  const token = localStorage.getItem("token");

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

        const allCategoryIds = [
          ...new Set([
            ...data.produtos.flatMap((p: ProductType) => p.categorias),
            ...data.lojas.flatMap((l: StoreType) => l.categorias),
          ]),
        ];        

        const categoryPromises = allCategoryIds.map(async (id: number) => {
          const response = await fetch(
            `http://127.0.0.1:8000/api/categorias/${id}/`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (!response.ok) throw new Error(`Failed to fetch category ${id}`);
          const categoryData: CategoryType[] = await response.json();
          return { id, name: categoryData?.nome || "Desconhecida" };
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
      <header className="sticky top-0 z-10 bg-gray-200 px-4 py-3 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-neutral-50 rounded-[5px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] 
                    flex items-center justify-center cursor-pointer hover:bg-neutral-100 transition-colors"
          >
            <FaArrowLeft className="w-5 h-5 text-amber-600" />
          </button>
          <div className="flex-1">
            <SearchInput />
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 pb-20">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">Buscando produtos...</p>
          </div>
        ) : products.length > 0 || stores.length > 0 ? (
          <>
            <h1 className="text-xl font-semibold px-4 py-3 text-zinc-800">
              Resultados para "{query}"
            </h1>

            {products.length > 0 && (
              <>
                <h2 className="text-lg font-semibold px-4 text-zinc-800">
                  Produtos
                </h2>
                <div className="grid grid-cols-2 gap-4 px-4">
                  {products.map((product) => (
                    <CardProduct
                      key={product.id}
                      id={product.id}
                      nome={product.nome}
                      categoria={
                        categories[product.categorias[0]] ||
                        "Categoria desconhecida"
                      }
                      imagem={product.imagem}
                      favoritado={product.favoritado}
                    />
                  ))}
                </div>
              </>
            )}

            {stores.length > 0 && (
              <>
                <h2 className="text-lg font-semibold px-4 pt-6 text-zinc-800">
                  Lojas
                </h2>
                {stores.slice(0, 3).map((store) => (
                  <CardStore
                    key={store.id}
                    store={store}
                    categories={categories}
                    corMap={corMap}
                  />
                ))}
              </>
            )}
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
