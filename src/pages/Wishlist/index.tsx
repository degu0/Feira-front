import { useEffect, useState } from "react";
import { FaArrowLeft, FaTrashAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { Menu } from "../../components/Menu";

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
};

export function Wishlist() {
  const navigate = useNavigate();
  const storedUserJSON = localStorage.getItem("user");

  const [mostrarProdutos, setMostrarProdutos] = useState(false);
  const [lojasFavoritas, setLojasFavoritas] = useState<StoreType[]>([]);
  const [produtosFavoritos, setProdutosFavoritos] = useState<ProductType[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        if (!storedUserJSON) return;

        const parsedUser: { id: string } = JSON.parse(storedUserJSON);

        const responseFavoritosLojas = await fetch(
          `http://localhost:3000/lojasFavoritas?cliente=${parsedUser.id}`
        );
        const dataFavoritosLoja: FavoritesStoreType[] =
          await responseFavoritosLojas.json();

        const lojasPromises = dataFavoritosLoja.map((data) =>
          fetch(`http://localhost:3000/lojas?id=${data.loja}`).then((res) =>
            res.json()
          )
        );
        const lojas = await Promise.all(lojasPromises);
        setLojasFavoritas(lojas.flat());

        const responseFavoritosProdutos = await fetch(
          `http://localhost:3000/produtosFavoritos?cliente=${parsedUser.id}`
        );
        const dataFavoritosProdutos: FavoritesProductType[] =
          await responseFavoritosProdutos.json();

        const produtosPromises = dataFavoritosProdutos.map((data) =>
          fetch(`http://localhost:3000/produtos?id=${data.produto}`).then(
            (res) => res.json()
          )
        );
        const produtos = await Promise.all(produtosPromises);
        setProdutosFavoritos(produtos.flat());
      } catch (error) {
        console.error("Erro ao buscar dados", error);
      }
    }

    loadData();
  }, [storedUserJSON]);

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col justify-between">
      <header className="p-4 flex items-center gap-4 shadow-sm">
        <FaArrowLeft
          onClick={() => navigate(-1)}
          className="text-xl text-orange-700 cursor-pointer bg-white roudend-lg"
        />
        <h2 className="text-lg font-semibold text-orange-700">Favoritos</h2>
      </header>
      <div className="flex bg-[#FAFAFA]  px-4 border-b border-gray-200">
        <button
          onClick={() => setMostrarProdutos(false)}
          className={`flex-1 py-3 text-sm font-medium ${
            !mostrarProdutos
              ? "text-orange-700 border-b-2 border-orange-700"
            : "text-gray-500"
          }`}
        >
          Lojas
        </button>
        <button
          onClick={() => setMostrarProdutos(true)}
          className={`flex-1 py-3 text-sm font-medium ${
            mostrarProdutos
              ? "text-orange-700 border-b-2 border-orange-700"
              : "text-gray-500"
          }`}
        >
          Produtos
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {mostrarProdutos ? (
          <ul className="space-y-4">
            {lojasFavoritas.map((loja) => (
              <li
                key={loja.id}
                className="bg-white p-4 rounded-lg shadow-sm flex items-center gap-4"
              >
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
                  <span className="text-sm">📷</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-800">
                    {loja.nome}
                  </h3>
                  <button className="text-orange-600 text-xs flex items-center gap-1 mt-1">
                    <FaTrashAlt className="text-xs" />
                    Remover dos favoritos
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <ul className="space-y-4">
            {produtosFavoritos.map((produto) => (
              <li
                key={produto.id}
                className="bg-white p-4 rounded-lg shadow-sm flex items-center gap-4"
              >
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
                  <span className="text-sm">📷</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-800">
                    {produto.nome}
                  </h3>
                  <button className="text-orange-600 text-xs flex items-center gap-1 mt-1">
                    <FaTrashAlt className="text-xs" />
                    Remover dos favoritos
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <Menu />
    </div>
  );
}
