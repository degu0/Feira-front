import { useEffect, useState } from "react";
import { Menu } from "../../components/Menu";
import { IoIosSearch } from "react-icons/io";
import { Link, NavLink } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import imagem from "../../../public/Jeans.jpg";

type ProductType = {
  id: string;
  nome: string;
  imagem: string;
};

export function ProductList() {
  const token = localStorage.getItem("token");
  const [products, setProducts] = useState<ProductType[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductType[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/lojas/2/produtos/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data: ProductType[] = await response.json();

        if (Array.isArray(data)) {
          setProducts(data);
          setFilteredProducts(data);
        } else {
          console.error("Resposta inválida da API:", data);
        }
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    }

    fetchProducts();
  }, [token]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    if (value) {
      const filtered = products.filter((item) =>
        item.nome.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative pb-24">
      <div className="bg-gray-200 py-6 px-5">
        <div className="relative w-full">
          <button className="absolute right-4 top-1/2 transform -translate-y-1/2 text-amber-600">
            <IoIosSearch size={24} />
          </button>
          <input
            type="text"
            onChange={handleInputChange}
            className="border-none rounded-full text-black w-full p-3 pr-10 bg-neutral-50 shadow-md"
            placeholder="Pesquisar produto"
          />
        </div>
      </div>

      <div className="bg-white px-4 flex-1 overflow-y-auto">
        {filteredProducts.length === 0 ? (
          <p className="text-center text-gray-500 mt-10 text-xl">
            Nenhum produto cadastrado.
          </p>
        ) : (
          <div className="flex flex-col gap-4 mt-4">
            {filteredProducts.map((product) => (
              <NavLink
                to={`/product/${product.id}`}
              >
                <div
                  key={product.id}
                  className="py-2 px-4 flex items-center gap-4 border-b border-amber-600/25"
                >
                  <img
                    src={imagem}
                    alt="Imagem do produto"
                    className="w-20 h-20 rounded-md object-cover"
                  />
                  <p className="text-lg font-semibold">{product.nome}</p>
                </div>
              </NavLink>
            ))}
          </div>
        )}
      </div>
      <Link
        to="/product/register"
        className="fixed bottom-24 right-5 z-50 w-16 h-16 bg-amber-600 rounded-2xl flex items-center justify-center shadow-lg"
      >
        <FaPlus className="text-white w-6 h-6" />
      </Link>
      <Menu type="Lojista" />
    </div>
  );
}
