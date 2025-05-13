import { useParams } from "react-router-dom";
import { Menu } from "../../components/Menu";
import { useEffect, useState } from "react";

type ProductType = {
  id: string;
  nome: string;
  descricao: string;
  categoria: number;
  cor: string;
  composicao: string;
};

type CategoryType = {
  nome: string;
};

export function Product() {
  const { id } = useParams();
  const [product, setProduct] = useState<ProductType>({
    id: "",
    nome: "",
    descricao: "",
    categoria: 0,
    cor: "",
    composicao: "",
  });
  const [category, setCategory] = useState<CategoryType>({ nome: "" });

  useEffect(() => {
    async function loadData() {
      try {
        const responseProduct = await fetch(
          `http://localhost:3000/produtos?id=${id}`
        );
        const dataProduct: ProductType[] = await responseProduct.json();
        const responseCategory = await fetch(
          `http://localhost:3000/categoria?id=${dataProduct[0]["categoria"]}`
        );
        const dataCategory: CategoryType[] = await responseCategory.json();

        if (responseProduct.ok && dataProduct.length > 0) {
          setProduct(dataProduct[0]);
          if (responseCategory.ok && dataCategory.length > 0) {
            setCategory(dataCategory[0]);
          } else {
            console.error(
              "Erro no fetch de dados dos categoria:",
              dataCategory
            );
          }
        } else {
          console.error("Erro no fetch de dados dos produtos:", dataProduct);
        }
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    }
    loadData();
  }, [id]);

  return (
    <div>
      <ul>
        <li>id: {product.id}</li>
        <li>nome: {product.nome}</li>
        <li>descricao: {product.descricao}</li>
        <li>categoria: {category.nome}</li>
        <li>cor: {product.cor}</li>
        <li>composicao: {product.composicao}</li>
      </ul>
      <Menu />
    </div>
  );
}
