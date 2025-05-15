import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CustomSelect } from "../../components/CustomSelect";

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

  const [selectedCategories, setSelectedCategories] = useState<CategoryType[]>(
    []
  );
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
    <div className="h-full p-6 flex flex-col justify-center gap-10">
      <div className="grid gap-4">
        <CustomSelect
          type="checkbox"
          title="Selecione suas categorias preferidas"
          values={categories}
          name="category"
          onChange={(selected) => {
            if (Array.isArray(selected)) {
              const selectedOptions = selected as Option[];
              setSelectedCategories(selectedOptions);
            } else if (selected) {
              setSelectedCategories([selected as Option]);
            } else {
              setSelectedCategories([]);
            }
          }}
        />
      </div>

      <button
        className="mt-6 bg-amber-600 text-white py-2 px-4 rounded"
        onClick={handleRegisterCategoryOfUser}
      >
        Salvar Preferências
      </button>
    </div>
  );
}
