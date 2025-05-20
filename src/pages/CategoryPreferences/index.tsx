import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CustomSelect } from "../../components/CustomSelect";
import logo from "../../../public/logo.png";

type CategoryType = {
  id: string;
  nome: string;
};

type Option = {
  id: string;
  nome: string;
};

export function CategoryPreferences() {
  const { id: userId } = useParams();
  const navigate = useNavigate();

  const [selectedCategories, setSelectedCategories] = useState<CategoryType[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch("http://localhost:3000/categoria");
        const data: CategoryType[] = await response.json();
        if (response.ok && Array.isArray(data)) {
          setCategories(data);
        } else {
          console.error("Erro na resposta da API:", data);
        }
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
      }
    }

    loadData();
  }, []);

  const handleRegisterCategoryOfUser = async () => {
    if (!userId) {
      console.error("ID do usuário não encontrado.");
      return;
    }

    const categoryIds = selectedCategories.map((c) => c.id);

    try {
      const res = await fetch("http://localhost:3000/user-categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          categoryIds,
        }),
      });

      if (res.ok) {
        console.log("Categorias registradas com sucesso!");
        navigate("/");
      } else {
        console.error("Erro ao registrar categorias.");
      }
    } catch (err) {
      console.error("Erro ao enviar categorias:", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-10 bg-gradient-to-b from-orange-100 to-white">
      <img src={logo} alt="Logo do aplicativo" className="w-24 mb-8" />

      <div className="w-full max-w-md">
        <CustomSelect
          type="checkbox"
          title="Selecione suas categorias preferidas"
          values={categories}
          name="category"
          onChange={(selected) => {
            if (Array.isArray(selected)) {
              setSelectedCategories(selected as Option[]);
            } else if (selected) {
              setSelectedCategories([selected as Option]);
            } else {
              setSelectedCategories([]);
            }
          }}
        />
        <button
          className="bg-orange-600 hover:bg-orange-700 text-white text-lg font-semibold py-3 rounded-full w-full mt-6 shadow-md transition duration-300"
          onClick={handleRegisterCategoryOfUser}
        >
          Gerar minhas recomendações
        </button>
      </div>
    </div>
  );
}
