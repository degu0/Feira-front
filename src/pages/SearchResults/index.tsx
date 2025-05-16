import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CardProduct } from "../../components/CardProduct";
import { SearchInput } from "../../components/SearchInput";
import { FaArrowLeftLong } from "react-icons/fa6";

type ProductType = {
  id: string;
  nome: string;
  categoria: number;
};

export function SearchResults() {
  const navigate = useNavigate();
  const { searchTerm } = useParams<{ searchTerm: string }>();
  const [products, setProducts] = useState<ProductType[]>([]);
  const query = searchTerm || "";

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch(
          `http://localhost:3000/produtos?nome=${encodeURIComponent(query)}`
        );
        const data: ProductType[] = await res.json();

        if (!res.ok || !Array.isArray(data)) {
          console.error("Erro na resposta da API:", data);
          return;
        }

        setProducts(data);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    }

    fetchProducts();
  }, [query]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="p-4 flex justify-center items-center">
        <div className="px-4 pt-4 cursor-pointer" onClick={() => navigate("/")}>
          <FaArrowLeftLong className="text-2xl" />
        </div>
        <SearchInput />
      </header>

      <main className="flex-1 overflow-y-auto px-8 pb-4">
        {products.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {products.map((product) => (
              <CardProduct
                key={product.id}
                id={product.id}
                nome={product.nome}
                categoria={product.categoria}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-10">
            Nenhum produto encontrado.
          </p>
        )}
      </main>
    </div>
  );
}
