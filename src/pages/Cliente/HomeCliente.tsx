import { useEffect, useState } from "react";
import { CardProduct } from "../../components/CardProduct";
import { Menu } from "../../components/Menu";
import map from "../../../public/map.png";
import { SearchInput } from "../../components/SearchInput";
import { FaRegHeart, FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import loja from "../../../public/loja.jpg";

type ProductType = {
  id: string;
  nome: string;
  categoria: number;
  imagem: string;
};

type CategoryNameType = {
  id: string;
  nome: string;
};

type StoresType = {
  id: string;
  nome: string;
  categoria: number;
  cor: string;
  localizacao: string;
};

export function HomeCliente() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [scrolled, setScrolled] = useState(false);
  const [categories, setCategories] = useState<Record<number, string>>({});
  const [stores, setStores] = useState<StoresType[]>([]);

  const corMap: Record<string, string> = {
    vermelho: "bg-red-500",
    azul: "bg-blue-500",
    amarelo: "bg-yellow-500",
    rosa: "bg-pink-500",
    roxo: "bg-purple-500",
  };

  useEffect(() => {
    async function loadData() {
      try {
        const responseProduct = await fetch("http://localhost:3001/produtos");
        const dataProduct: ProductType[] = await responseProduct.json();

        if (!responseProduct.ok || !Array.isArray(dataProduct)) {
          throw new Error("Invalid products response");
        }
        setProducts(dataProduct);

        const responseStores = await fetch("http://localhost:3001/lojas");
        const dataStores: StoresType[] = await responseStores.json();

        if (!responseStores.ok || !Array.isArray(dataStores)) {
          throw new Error("Invalid stores response");
        }
        setStores(dataStores);

        const categoryIds = [...new Set(dataProduct.map((p) => p.categoria))];
        const categoryPromises = categoryIds.map(async (id) => {
          const response = await fetch(
            `http://localhost:3001/categoria?id=${id}`
          );
          if (!response.ok) throw new Error(`Failed to fetch category ${id}`);
          const data: CategoryNameType[] = await response.json();
          return { id, name: data[0]?.nome || "Unknown" };
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
  }, []);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 350);
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="h-screen flex flex-col">
      <div
        className="flex-1 bg-center bg-cover bg-no-repeat"
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

      <div className="h-[50%] px-4 py-2 bg-white overflow-y-auto flex flex-col gap-10">
        <div>
          <h2 className="text-2xl font-semibold mb-3">Lojas recomendados</h2>
          {stores.slice(0, 3).map((store) => (
            <Link
              key={store.id}
              to={`/store/${store.id}`}
              className="py-2 px-4 flex items-center justify-between"
            >
              <div className="mr-5">
                <img
                  src={loja}
                  alt="Imagem de perfil"
                  className="w-20 h-20 rounded-[5px]"
                />
              </div>
              <div className="flex-1 border-b border-amber-600/25 py-2">
                <div className="flex justify-between items-center">
                  <p className="text-lg font-semibold">{store.nome}</p>
                  <FaRegHeart className="text-amber-600" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div
                      className={`w-3 h-3 rounded-full ${corMap[store?.cor]}`}
                    ></div>
                    <span>
                      Setor {store?.cor} | {categories[store.categoria]}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{store?.localizacao}</p>
                  <div className="flex items-center gap-1 text-sm text-amber-600">
                    <FaStar className="text-md" />
                    <span>4.5</span>
                  </div>
                </div>
              </div>
            </Link>
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
                  categories[prod.categoria] || "Categoria desconhecida"
                }
                imagem={prod.imagem}
              />
            ))}
          </div>
        </div>
      </div>

      <Menu />
    </div>
  );
}
