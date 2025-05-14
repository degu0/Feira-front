import { useEffect, useState } from "react";
import { CardProduct } from "../../components/CardProduct";
import { Menu } from "../../components/Menu";
import map from "../../../public/map.png";
import { Link } from "react-router-dom";
import { SearchInput } from "../../components/SearchInput";

type ProductType = {
  id: string;
  nome: string;
  categoria: number;
};

export function HomeCliente() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const responseProduct = await fetch("http://localhost:3000/produtos");
        const data: ProductType[] = await responseProduct.json();

        if (responseProduct.ok) {
          if (Array.isArray(data)) {
            setProducts(data);
          } else {
            console.error("Resposta inválida da API:", data);
          }
        } else {
          console.error("Erro no fetch de dados dos produtos:", data);
        }
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    function handleScroll() {
      const isScrolled = window.scrollY > 350;
      setScrolled(isScrolled);
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
          className={`fixed w-full h-32 z-50 
        flex justify-between pt-3 ${
          scrolled ? "bg-white shadow" : "bg-transparent"
        }`}
        >
          <Link to="/search" className="w-[80%]">
            <SearchInput />
          </Link>
          <Link to="/profile" className="px-4 pt-5">
            <div className="p-5 rounded-full bg-amber-600" />
          </Link>
        </div>
      </div>

      <div className="h-[50%] px-4 py-2 bg-white">
        <div className="grid grid-cols-2 gap-4">
          {products.map((prod) => (
            <CardProduct
              key={prod.id}
              id={prod.id}
              nome={prod.nome}
              categoria={prod.categoria}
            />
          ))}
        </div>
      </div>

      <Menu />
    </div>
  );
}
