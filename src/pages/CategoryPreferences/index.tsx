import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CustomSelect } from "../../components/CustomSelect";
import logo from "../../../public/logo.png";

type CategoryType = {
  id: string;
  nome: string;
};

type UserType = {
  id: string
}

type Option = {
  id: string;
  nome: string;
};

export function CategoryPreferences() {
  const token = localStorage.getItem("token");
  const { id: userId } = useParams();
  const navigate = useNavigate();

  const [selectedCategories, setSelectedCategories] = useState<CategoryType[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/categorias/",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data: {results: CategoryType[]} = await response.json();
        if (response.ok && Array.isArray(data.results)) {
          setCategories(data.results);
        } else {
          console.error("Erro na resposta da API:", data);
        }
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
      }
    }

    loadData();
  }, [token]);

  const handleRegisterCategoryOfUser = async () => {
    navigate("/");
    // if (!userId) {
    //   console.error("ID do usuário não encontrado.");
    //   return;
    // }

    // const categoryIds = selectedCategories.map((c) => c.id);
    

    // try {
    //   const res = await fetch("http://127.0.0.1:8000/api/cliente/", {
    //     method: "PUT",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({
    //       userId,
    //       categoryIds,
    //     }),
    //   });

    //   if (res.ok) {
    //     console.log("Categorias registradas com sucesso!");
    //   } else {
    //     console.error("Erro ao registrar categorias.");
    //   }
    // } catch (err) {
    //   console.error("Erro ao enviar categorias:", err);
    // }
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
          className="bg-amber-600 hover:bg-amber-700 text-white text-lg font-semibold py-3 rounded-full w-full mt-6 shadow-md transition duration-300"
          onClick={handleRegisterCategoryOfUser}
        >
          Gerar minhas recomendações
        </button>
      </div>
    </div>
  );
}
