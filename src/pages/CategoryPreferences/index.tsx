import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CustomSelect } from "../../components/CustomSelect";
import logo from "../../../public/logo.png";

type CategoryType = {
  id: string;
  nome: string;
};

type UserType = {
  id: string;
};

type Option = {
  id: string;
  nome: string;
};

export function CategoryPreferences() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [selectedCategories, setSelectedCategories] = useState<CategoryType[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [profile, setProfile] = useState<UserType | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/categorias/", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data: CategoryType[] = await response.json();
        if (response.ok && Array.isArray(data)) {
          setCategories(data);
        } else {
          console.error("Erro na resposta da API de categorias:", data);
        }

        const responseProfile = await fetch("http://127.0.0.1:8000/api/meu-perfil/", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const dataProfile = await responseProfile.json();

        if (responseProfile.ok && dataProfile.cliente && dataProfile.cliente.id) {
          setProfile({ id: dataProfile.cliente.id });
        } else {
          console.error("Erro na resposta da API de perfil:", dataProfile);
        }
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    }

    loadData();
  }, [token]);

  const handleRegisterCategoryOfUser = async () => {
    if (!profile?.id) {
      console.error("ID do usuário não encontrado.");
      return;
    }

    const categoryIds = selectedCategories.map((c) => c.id);

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/clientes/${profile.id}/`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          categorias_preferidas: categoryIds,
        }),
      });

      if (res.ok) {
        navigate("/login");
      } else {
        const errData = await res.json();
        console.error("Erro ao registrar categorias:", errData);
      }
    } catch (err) {
      console.error("Erro ao enviar categorias:", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-10 bg-white">
      <img src={logo} alt="Logo do aplicativo" className="w-54 mb-8" />

      <div className="w-full max-w-md flex flex-col gap-10">
        <CustomSelect
          type="checkbox"
          title="Selecione suas categorias preferidas"
          values={categories}
          name="category"
          image
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
        <div className="flex items-center justify-center">
          <button
            className="w-64 h-11 relative bg-amber-600 text-white rounded-[100px] text-lg font-medium mb-2"
            onClick={handleRegisterCategoryOfUser}
          >
            Visualizar lojas
          </button>
        </div>
      </div>
    </div>
  );
}
