import { useEffect, useState } from "react";
import { CardProduct } from "../../components/CardProduct";
import { Menu } from "../../components/Menu";
import map from "../../../public/map.png";
import { SearchInput } from "../../components/SearchInput";
import { CardStore } from "../../components/CardStore";

type ProductType = {
  id: string;
  nome: string;
  categorias: number[];
  imagem: string;
  favoritado: boolean;
};

type CategoryNameType = {
  id: string;
  nome: string;
};

type StoresType = {
  id: string;
  nome: string;
  logo: string;
  categorias: number[];
  setor: string;
  cor?: string;
  localizacao: string;
  nota_media: number;
};

export function HomeCliente() {
  const token = localStorage.getItem("token");

  const [products, setProducts] = useState<ProductType[]>([]);
  const [scrolled, setScrolled] = useState(false);
  const [categories, setCategories] = useState<Record<number, string>>({});
  
  const [stores, setStores] = useState<StoresType[]>([]);

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
    async function loadData() {
      try {
        const responseProduct = await fetch(
          "http://127.0.0.1:8000/api/produtos-recomendados/",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const dataProduct: ProductType[] = await responseProduct.json();

        if (!responseProduct.ok || !Array.isArray(dataProduct)) {
          throw new Error("Invalid products response");
        }
        setProducts(dataProduct);

        const responseStores = await fetch(
          "http://127.0.0.1:8000/api/lojas-recomendadas/",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const dataStores: StoresType[] = await responseStores.json();
        

        if (!responseStores.ok || !Array.isArray(dataStores)) {
          throw new Error("Invalid stores response");
        }

        setStores(dataStores);
        

        const allCategoryIds = [
          ...new Set([
            ...dataProduct.flatMap((p) => p.categorias),
            ...dataStores.flatMap((s) => s.categorias),
          ]),
        ];
        

        const categoryPromises = allCategoryIds.map(async (id) => {
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
          const data: CategoryNameType = await response.json();
          return { id, name: data.nome || "Unknown" };
        });

        const categoryResults = await Promise.all(categoryPromises);
        const categoryMap = categoryResults.reduce((acc, curr) => {
          acc[curr.id] = curr.name;
          return acc;
        }, {} as Record<number, string>);

        setCategories(categoryMap);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    }

    loadData();
  }, [token]);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 350);
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <div
        className="h-120 bg-center bg-cover bg-no-repeat"
        style={{ backgroundImage: `url(${map})` }}
      >
        <div
          className={`fixed w-full h-28 z-50 flex justify-center pt-6 transition-colors ${
            scrolled ? "bg-white shadow" : "bg-transparent"
          }`}
        >
          <SearchInput />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-2 bg-white flex flex-col gap-10 pb-28">
        <div>
          <h2 className="text-2xl font-semibold mb-3">Lojas recomendados</h2>
          {stores.slice(0, 3).map((store) => (
            <CardStore
              key={store.id}
              store={store}
              categories={categories}
              corMap={corMap}
            />
          ))}
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-3">Produtos recomendados</h2>
          <div className="grid grid-cols-2 gap-4">
            {products.slice(0, 8).map((prod) => (
              <CardProduct
                key={prod.id}
                id={prod.id}
                nome={prod.nome}
                categoria={
                  categories[prod.categorias[0]] || "Categoria desconhecida"
                }
                imagem={prod.imagem}
                favoritado={prod.favoritado}
              />
            ))}
          </div>
        </div>
      </div>

      <Menu type="Cliente" />
    </div>
  );
}
