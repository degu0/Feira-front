import { useNavigate } from "react-router-dom";
import logo from "../../../../public/logo.png";
import { useEffect, useState, useRef } from "react";
import IMask from "imask";

type CategoryType = {
  id: string;
  nome: string;
};

type UserType = {
  id: string;
  email: string;
  tipoUsuario: string;
};

export function Information() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [nome, setNome] = useState("");
  const [storeCategory, setStoreCategory] = useState("");
  const [descricao, setDescricao] = useState("");
  const [horarioFuncionamento, setHorarioFuncionamento] = useState("");
  const [id, setId] = useState("");

  const horarioRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const resUser = await fetch(`http://127.0.0.1:8000/api/meu-perfil/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const users: UserType[] = await resUser.json();
        setId(users.lojista.id);

        const response = await fetch("http://127.0.0.1:8000/api/categorias/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data: { results: CategoryType[] } = await response.json();
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

  useEffect(() => {
    if (horarioRef.current) {
      const maskOptions = {
        mask: "00:00 - 00:00",
      };
      const mask = IMask(horarioRef.current, maskOptions);
      mask.on("accept", () => {
        setHorarioFuncionamento(mask.value);
      });

      return () => {
        mask.destroy();
      };
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const information = {
      nome,
      categorias: [parseInt(storeCategory)],
      descricao,
      lojista: parseInt(id),
      produtos: [],
      horario_funcionamento: horarioFuncionamento,
    };
    localStorage.setItem("store", JSON.stringify(information));
    navigate("/store/register/address");
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-6 bg-white">
      <img src={logo} alt="Logo do aplicativo" className="w-50 mb-15" />
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md flex flex-col gap-3"
      >
        <h2 className="font-semibold text-xl mb-4">Informações da loja</h2>

        <div className="flex flex-col gap-2">
          <label htmlFor="nome">Nome da Loja</label>
          <input
            id="nome"
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full mb-3 p-3 border border-orange-500 rounded-md"
            placeholder="Escreva nome da loja"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="category">Categoria da Loja</label>
          <select
            id="category"
            value={storeCategory}
            onChange={(e) => setStoreCategory(e.target.value)}
            className="w-full mb-3 p-3 border border-orange-500 rounded-md"
          >
            <option value="" disabled>
              Selecione uma categoria
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="horarioFuncionamento">Horario de funcionamento</label>
          <input
            id="horarioFuncionamento"
            type="text"
            ref={horarioRef}
            value={horarioFuncionamento}
            onChange={() => {}} // valor controlado pela máscara
            placeholder="00:00 - 00:00"
            className="w-full mb-3 p-3 border border-orange-500 rounded-md"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-lg font-medium">Descrição da loja</label>
          <textarea
            id="descricao"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Escreva sua avaliação aqui..."
            className="border border-amber-600 rounded-lg p-3 min-h-[100px]"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-orange-500 text-white py-3 rounded-full mt-4"
        >
          Próximo
        </button>
      </form>

      <div className="flex items-center justify-center gap-4 mt-6 fixed bottom-10 left-40">
        <div className="border-none rounded-full bg-amber-600 w-3 h-3" />
        <div className="border-none rounded-full bg-gray-200 w-3 h-3" />
        <div className="border-none rounded-full bg-gray-200 w-3 h-3" />
        <div className="border-none rounded-full bg-gray-200 w-3 h-3" />
      </div>
    </div>
  );
}
