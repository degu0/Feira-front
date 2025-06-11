import { useEffect, useState } from "react";
import { FaStar, FaTrashAlt } from "react-icons/fa";
import { Menu } from "../../components/Menu";
import { Header } from "../../components/Header";
import StoreImage from "../../../public/loja.jpg";
import { Link } from "react-router-dom";

type FavoritesStoreType = {
  id: string;
  cliente: string;
  loja: string;
};

type FavoritesProductType = {
  id: string;
  cliente: string;
  produto: string;
};

type StoreType = {
  id: string;
  nome: string;
  nota_media: string;
  categorias?: number[]; // Adicionado
};

type ProductType = {
  id: string;
  nome: string;
  imagem: string;
};

type CategoryNameType = {
  id: number;
  nome: string;
};

export function Wishlist() {
  const token = localStorage.getItem("token");
  const storedUserJSON = localStorage.getItem("user");
  const userId = storedUserJSON ? JSON.parse(storedUserJSON)?.id : null;

  const [mostrarProdutos, setMostrarProdutos] = useState(false);
  const [lojasFavoritas, setLojasFavoritas] = useState<StoreType[]>([]);
  const [produtosFavoritos, setProdutosFavoritos] = useState<ProductType[]>([]);
  const [categories, setCategories] = useState<Record<number, string>>({});


  useEffect(() => {
    async function loadData() {
      try {
        if (!storedUserJSON) return;
        
        const responseFavoritosLojas = await fetch(
          `http://127.0.0.1:8000/api/clientes/${userId}/lojas_favoritas/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        const dataFavoritosLoja: FavoritesStoreType[]  =
          await responseFavoritosLojas.json();
          
        const lojas = await Promise.all(
          dataFavoritosLoja.map((data) =>
            fetch(`http://127.0.0.1:8000/api/lojas/${data.id}/`, {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }).then((res) => res.json())
          )
        );

        const lojasUnicas = lojas.filter(
          (loja, index, self) =>
            index === self.findIndex((l) => l.id === loja.id)
        );

        setLojasFavoritas(lojasUnicas);
        

        const responseFavoritosProdutos = await fetch(
          `http://127.0.0.1:8000/api/clientes/${userId}/produtos_favoritos/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const dataFavoritosProdutos: FavoritesProductType[] =
          await responseFavoritosProdutos.json();

        const produtos = await Promise.all(
          dataFavoritosProdutos.map((data) =>
            fetch(`http://127.0.0.1:8000/api/produtos/${data.id}/`, {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }).then((res) => res.json())
          )
        );

        const produtosUnicos = produtos.filter(
          (produto, index, self) =>
            index === self.findIndex((p) => p.id === produto.id)
        );
        setProdutosFavoritos(produtosUnicos);


        const allCategoryIds = [
          ...new Set(lojas.flatMap((s) => s.categorias ?? [])),
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
          const data: CategoryNameType = await response.json();
          return { id, name: data.nome || "Desconhecida" };
        });

        const categoryResults = await Promise.all(categoryPromises);
        const categoryMap = categoryResults.reduce((acc, curr) => {
          acc[curr.id] = curr.name;
          return acc;
        }, {} as Record<number, string>);

        setCategories(categoryMap);
      } catch (error) {
        console.error("Erro ao buscar dados", error);
      }
    }

    loadData();
  }, [storedUserJSON, token, userId]);

  return (
    <div className="bg-gray-100 min-h-screen h-full flex flex-col justify-between">
      <Header title="Favoritos" />
      <div className="flex bg-[#FAFAFA] px-4 border-b border-gray-200">
        <button
          onClick={() => setMostrarProdutos(false)}
          className={`flex-1 py-3 text-sm font-medium ${
            !mostrarProdutos
              ? "text-orange-700 border-b-2 border-orange-700"
              : "text-gray-500"
          }`}
        >
          Produtos
        </button>
        <button
          onClick={() => setMostrarProdutos(true)}
          className={`flex-1 py-3 text-sm font-medium ${
            mostrarProdutos
              ? "text-orange-700 border-b-2 border-orange-700"
              : "text-gray-500"
          }`}
        >
          Lojas
        </button>
      </div>

      <div className="bg-white flex-1 overflow-y-auto">
        {mostrarProdutos ? (
          <ul>
            {lojasFavoritas.map((loja) => (
              <Link
                to={`/store/${loja.id}`}
                key={`loja-${loja.id}`}
                className="bg-white p-4 flex items-center gap-4 border-b border-amber-600/25"
              >
                <div
                  className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center bg-center bg-cover bg-no-repeat"
                  style={{ backgroundImage: `url(${StoreImage})` }}
                />
                <div className="h-20 flex-1 flex flex-col justify-between">
                  <h3 className="text-base font-semibold text-gray-800">
                    {loja.nome}
                  </h3>
                  <span className="text-xs text-gray-500">
                    {(loja.categorias ?? [])
                      .map((id) => categories[id])
                      .filter(Boolean)
                      .join(", ")}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-amber-600">
                    <FaStar />
                    <span className="text-black ">
                      {loja?.nota_media ?? "5.0"}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </ul>
        ) : (
          <ul>
            {produtosFavoritos.map((produto) => (
              <Link
                to={`/product/${produto.id}`}
                key={`produto-${produto.id}`}
                className="bg-white p-4 flex items-center gap-4 border-b border-amber-600/25"
              >
                <div
                  className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center bg-center bg-cover bg-no-repeat"
                  style={{ backgroundImage: `url(${produto.imagem})` }}
                />
                <div className="h-20 flex-1 flex flex-col justify-between">
                  <h3 className="text-sm font-semibold text-gray-800">
                    {produto.nome}
                  </h3>
                </div>
              </Link>
            ))}
          </ul>
        )}
      </div>

      <Menu type="Cliente" />
    </div>
  );
}
