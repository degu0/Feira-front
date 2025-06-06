import { useEffect, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { Menu } from "../../components/Menu";
import { Header } from "../../components/Header";
import StoreImage from "../../../public/loja.jpg";
import { Link } from "react-router-dom";
import jeans from "../../../public/Jeans.jpg";

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
};

type ProductType = {
  id: string;
  nome: string;
  imagem: string;
};

export function Wishlist() {
  const token = localStorage.getItem("token");
  const storedUserJSON = localStorage.getItem("user");

  const [mostrarProdutos, setMostrarProdutos] = useState(false);
  const [lojasFavoritas, setLojasFavoritas] = useState<StoreType[]>([]);
  const [produtosFavoritos, setProdutosFavoritos] = useState<ProductType[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        if (!storedUserJSON) return;
        const responseFavoritosLojas = await fetch(
          `http://127.0.0.1:8000/api/lojas_favoritas/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const dataFavoritosLoja: { results: FavoritesStoreType[] } =
          await responseFavoritosLojas.json();

        const lojasPromises = dataFavoritosLoja.results.map((data) =>
          fetch(`http://127.0.0.1:8000/api/lojas/${data.loja}/`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }).then((res) => res.json())
        );
        const lojas = await Promise.all(lojasPromises);
        setLojasFavoritas(lojas);

        const responseFavoritosProdutos = await fetch(
          `http://127.0.0.1:8000/api/produtos_favoritos/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const dataFavoritosProdutos: { results: FavoritesProductType[] } =
          await responseFavoritosProdutos.json();

        const produtosPromises = dataFavoritosProdutos.results.map((data) =>
          fetch(`http://127.0.0.1:8000/api/produtos/${data.produto}/`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }).then((res) => res.json())
        );
        const produtos = await Promise.all(produtosPromises);
        const produtosUnicos = produtos.filter(
          (produto, index, self) =>
            index === self.findIndex((p) => p.id === produto.id)
        );
        setProdutosFavoritos(produtosUnicos);
      } catch (error) {
        console.error("Erro ao buscar dados", error);
      }
    }

    loadData();
  }, [storedUserJSON, token]);

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col justify-between">
      <Header title="Favoritos" />
      <div className="flex bg-[#FAFAFA]  px-4 border-b border-gray-200">
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
                  className="w-16 h-16 bg-gray-200 rounded-lg flex items-center 
                  justify-center text-gray-400 bg-center bg-cover bg-no-repeat"
                  style={{ backgroundImage: `url(${StoreImage})` }}
                />
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-800">
                    {loja.nome}
                  </h3>
                  <button className="text-orange-600 text-xs flex items-center gap-1 mt-1">
                    <FaTrashAlt className="text-xs" />
                    Remover dos favoritos
                  </button>
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
                  className="w-16 h-16 bg-gray-200 rounded-lg flex items-center 
                  justify-center text-gray-400 bg-center bg-cover bg-no-repeat"
                  style={{ backgroundImage: `url(${jeans})` }}
                />
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-800">
                    {produto.nome}
                  </h3>
                  <button className="text-orange-600 text-xs flex items-center gap-1 mt-1">
                    <FaTrashAlt className="text-xs" />
                    Remover dos favoritos
                  </button>
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
