import { useEffect, useState } from "react";
import { CardProduct } from "../../components/CardProduct";
import { Menu } from "../../components/Menu";
import map from "../../../public/map.png";
import logo from "../../../public/loja.jpg";
import { SearchInput } from "../../components/SearchInput";
import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import { HeartButton } from "../../components/HeartButton";

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
  logo: string;
  categoria: number;
  setor: string;
  localizacao: string;
  nota_media: number;
};

export function HomeCliente() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const idCliente = user.idCliente;

  const [products, setProducts] = useState<ProductType[]>([]);
  const [scrolled, setScrolled] = useState(false);
  const [categories, setCategories] = useState<Record<number, string>>({});
  const [stores, setStores] = useState<StoresType[]>([]);

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
    async function loadData() {
      try {
        const responseProduct = await fetch(
          "http://127.0.0.1:8000/api/produtos/",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const dataProduct: { results: ProductType[] } =
          await responseProduct.json();

        if (!responseProduct.ok || !Array.isArray(dataProduct.results)) {
          throw new Error("Invalid products response");
        }
        setProducts(dataProduct.results);

        const responseStores = await fetch("http://127.0.0.1:8000/api/lojas/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const dataStores: { results: StoresType[] } =
          await responseStores.json();

        if (!responseStores.ok || !Array.isArray(dataStores.results)) {
          throw new Error("Invalid stores response");
        }

        setStores(dataStores.results);

        const allCategoryIds = [
          ...new Set([
            ...dataProduct.results.flatMap((p) => p.categorias),
            ...dataStores.results.flatMap((s) => s.categorias),
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
                  src={logo}
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
                      className={`w-3 h-3 rounded-full ${corMap[store?.setor]}`}
                    ></div>
                    <span>
                      Setor {store?.cor} |{" "}
                      {store.categorias.map((id) => categories[id]).join(", ")}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{store?.localizacao}</p>
                  <div className="flex items-center gap-1 text-sm text-amber-600">
                    <FaStar className="text-md" />
                    <span className="text-black">{store?.nota_media ? store?.nota_media : 5}</span>
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
                heart
              />
            ))}
          </div>
        </div>
      </div>

      <Menu type="Cliente" />
    </div>
  );
}
