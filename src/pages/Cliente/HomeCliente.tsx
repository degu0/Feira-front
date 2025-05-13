import { useEffect, useState } from "react";
import { CardProduct } from "../../components/CardProduct";
import { Menu } from "../../components/Menu";

type ProductType = {
  id: string;
  nome: string;
};

export function HomeCliente() {
  const [products, setProducts] = useState<ProductType[]>([]);

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

  return (
    <div>
      Home Cliente
      <div className="grid grid-cols-5 gap-4">
        {products.map((prod) => (
          <CardProduct key={prod.id} id={prod.id} nome={prod.nome} />
        ))}
      </div>
      <Menu />
    </div>
  );
}
