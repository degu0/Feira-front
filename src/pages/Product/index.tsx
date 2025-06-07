import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { CustomCheckbox } from "../../components/CustomCheckbox";
import { Header } from "../../components/Header";
import { DirectionsModal } from "./DirectProduct";
import jeans from "../../../public/Jeans.jpg";

type ProductType = {
  id: string;
  nome: string;
  descricao: string;
  categorias: number;
  cor: string;
  composicao: string;
  imagem: string;
};

type CategoryType = {
  nome: string;
};

export function Product() {
  const token = localStorage.getItem("token");
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userType = user.tipo;
  console.log(userType);

  const [product, setProduct] = useState<ProductType>({
    id: "",
    nome: "",
    descricao: "",
    categorias: 0,
    cor: "",
    composicao: "",
    imagem: "",
  });
  const [category, setCategory] = useState<CategoryType>({ nome: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const corMap: Record<string, string> = {
    Azul: "bg-blue-500",
    vermelho: "bg-red-500",
    amarelo: "bg-yellow-500",
    verde: "bg-green-500",
    roxo: "bg-purple-500",
    marrom: "bg-yellow-900",
    violeta: "bg-violet-500",
    laranja: "bg-orange-500",
    rosa: "bg-pink-500",
    preto: "bg-black",
  };

  useEffect(() => {
    if (!id) return;

    async function fetchProductAndCategory() {
      try {
        const responseProduct = await fetch(
          `http://127.0.0.1:8000/api/produtos/${id}/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!responseProduct.ok) throw new Error("Erro ao buscar produto");

        const dataProduct: ProductType = await responseProduct.json();
        console.log(dataProduct);

        setProduct(dataProduct);

        const responseCategory = await fetch(
          `http://127.0.0.1:8000/api/categorias/${dataProduct.categorias}/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!responseCategory.ok) throw new Error("Erro ao buscar categoria");

        const dataCategory: CategoryType = await responseCategory.json();
        setCategory(dataCategory);
      } catch (error) {
        console.error("Erro ao buscar produto ou categoria:", error);
      }
    }

    fetchProductAndCategory();
  }, [id, token]);

  return (
    <div className="h-screen flex flex-col bg-gray-200">
      <Header title={product.nome} />
      <div className="h-screen overflow-y-auto px-4 py-2 bg-white">
        <div className="flex flex-col gap-2">
          <div
            className="relative w-full h-96 bg-center bg-cover bg-no-repeat rounded-2xl"
            style={{ backgroundImage: `url(${jeans})` }}
          >
            {userType === "Cliente" && (
              <div className="absolute top-3 right-3">
                <CustomCheckbox />
              </div>
            )}
          </div>
          <div className="flex items-center justify-between">
            <p className="text-3xl font-semibold">{product.nome}</p>
          </div>
          <p className="text-gray-400">
            Categoria(s): <span className="text-gray-800">{category.nome}</span>
          </p>
          <p className="text-gray-400">
            Composição:{" "}
            <span className="text-gray-800">{product.composicao}</span>
          </p>
          <p className="text-gray-400 flex items-center gap-2">
            Cor:{" "}
            <div className={`w-6 h-6 rounded-lg ${corMap[product?.cor]}`} />
          </p>
          <p className="text-xl">{product.descricao}</p>
        </div>
        <DirectionsModal
          storeId={String(product.id)}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          token={token}
        />
        {userType === "Cliente" && (
          <div className="fixed bottom-0 left-0 w-full flex justify-center mb-5">
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-66 h-12 relative bg-amber-600 text-white rounded-[100px] text-lg font-medium mb-2"
            >
              Ver a localização da loja
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
