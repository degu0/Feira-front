import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import jeans from "../../../public/Jeans.jpg";
import { FaArrowLeftLong } from "react-icons/fa6";
import { CustomCheckbox } from "../../components/CustomCheckbox";

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
  const navigate = useNavigate();
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
    if (!id) return;

    async function fetchProductAndCategory() {
      try {
        const responseProduct = await fetch(
          `http://localhost:3000/produtos?id=${id}`
        );
        const dataProduct: ProductType[] = await responseProduct.json();

        if (!responseProduct.ok || dataProduct.length === 0) {
          console.error("Erro no fetch de dados dos produtos:", dataProduct);
          return;
        }

        const product = dataProduct[0];
        setProduct(product);

        const responseCategory = await fetch(
          `http://localhost:3000/categoria?id=${product.categoria}`
        );
        const dataCategory: CategoryType[] = await responseCategory.json();

        if (responseCategory.ok && dataCategory.length > 0) {
          setCategory(dataCategory[0]);
        } else {
          console.error("Erro no fetch de dados da categoria:", dataCategory);
        }
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    }

    fetchProductAndCategory();
  }, [id]);

  return (
    <div className="h-screen flex flex-col">
      <div
        className="flex-1 bg-center bg-cover bg-no-repeat"
        style={{ backgroundImage: `url(${jeans})` }}
      >
        <div
          className="bg-gray-200 rounded-full text-2xl w-10 h-10 flex items-center justify-center m-3"
          onClick={() => navigate(-1)}
        >
          <FaArrowLeftLong />
        </div>
      </div>
      <div className="h-[50%] overflow-y-auto px-4 py-2 bg-white">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <p className="text-4xl font-semibold">{product.nome}</p>
            <CustomCheckbox />
          </div>
          <p className="text-xl">{product.descricao}</p>
          <p className="text-lg">{category.nome}</p>
          <div className="flex justify-between">
            <p className="text-lg">{product.cor}</p>
            <p className="text-lg">{product.composicao}</p>
          </div>
        </div>
        <div className="fixed bottom-0 left-0 w-full flex justify-center mb-5">
          <button className="bg-amber-600 w-[90%] rounded-lg p-5 text-white">
            Direção para loja
          </button>
        </div>
      </div>
    </div>
  );
}
