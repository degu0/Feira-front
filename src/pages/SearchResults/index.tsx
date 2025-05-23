import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CardProduct } from "../../components/CardProduct";
import { SearchInput } from "../../components/SearchInput";
import { FaArrowLeft } from "react-icons/fa6";
import { Menu } from "../../components/Menu";

type ProductType = {
  id: string;
  nome: string;
  categoria: number;
  imagem: string;
};

type CategoryType = {
  id: number;
  nome: string;
};

export function SearchResults() {
  const navigate = useNavigate();
  const { searchTerm } = useParams<{ searchTerm: string }>();
  const [products, setProducts] = useState<ProductType[]>([]);
  const [categories, setCategories] = useState<Record<number, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const query = searchTerm || "";

  useEffect(() => {
    async function fetchProductsAndCategories() {
      try {
        setIsLoading(true);
        const res = await fetch(
          `http://localhost:3001/produtos?nome=${encodeURIComponent(query)}`
        );
        
        if (!res.ok) throw new Error("Failed to fetch products");
        
        const data: ProductType[] = await res.json();

        if (!Array.isArray(data)) {
          throw new Error("Invalid products data format");
        }
        setProducts(data);
        console.log(data);
        

        const categoryIds = [...new Set(data.map(p => p.categoria))];
        const categoryPromises = categoryIds.map(async id => {
          const response = await fetch(`http://localhost:3001/categoria?id=${id}`);
          if (!response.ok) throw new Error(`Failed to fetch category ${id}`);
          const categoryData: CategoryType[] = await response.json();
          return { id, name: categoryData[0]?.nome || "Unknown" };
        });

        const categoryResults = await Promise.all(categoryPromises);
        const categoryMap = categoryResults.reduce((acc, curr) => {
          acc[curr.id] = curr.name;
          return acc;
        }, {} as Record<number, string>);

        setCategories(categoryMap);

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProductsAndCategories();
  }, [query]);

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
                  categoria={categories[product.categoria] || "Categoria desconhecida"}
                  imagem={product.imagem}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center px-4">
            <p className="text-gray-500 text-lg">
              Nenhum produto encontrado para "{query}"
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

      <Menu />
    </div>
  );
}