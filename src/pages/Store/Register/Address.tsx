import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../../../public/logo.png";

type SetoresType = {
  id: string;
  nome: string;
};

export function Address() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [setores, setSetores] = useState<SetoresType[]>([]);

  const [rua, setRua] = useState("");
  const [numeroLoja, setNumeroLoja] = useState("");
  const [quadra, setQuadra] = useState("");
  const [setor, setSetor] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/setores/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data: { results: SetoresType[] } = await response.json();
        if (response.ok && Array.isArray(data.results)) {
          setSetores(data.results);
        } else {
          console.error("Erro na resposta da API:", data);
        }
      } catch (error) {
        console.error("Erro ao buscar setores:", error);
      }
    }

    loadData();
  }, [token]);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const address = {
      localizacao: `${rua} ${numeroLoja} ${quadra}`,
      setor: Number(setor),
    };
    const updateDate = {
      ...JSON.parse(localStorage.getItem("store") || "{}"),
      ...address,
    };
    localStorage.setItem("store", JSON.stringify(updateDate));
    navigate("/store/register/contact");
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-6 bg-white">
      <img src={logo} alt="Logo do aplicativo" className="w-50 mb-15" />
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md flex flex-col gap-5"
      >
        <h2 className="font-semibold text-lg">Endereço e Localização</h2>

        <div className="flex flex-col gap-2">
          <label htmlFor="rua">Rua</label>
          <input
            id="rua"
            type="text"
            value={rua}
            onChange={(e) => setRua(e.target.value)}
            className="w-full mb-3 p-3 border border-orange-500 rounded-md"
            placeholder="Escreva o nome da rua"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="numeroLoja">Número da loja/box</label>
          <input
            id="numeroLoja"
            type="number"
            value={numeroLoja}
            onChange={(e) => setNumeroLoja(e.target.value)}
            className="w-full mb-3 p-3 border border-orange-500 rounded-md"
            placeholder="Escreva o numoro da loja/box"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="quadra">Quadra</label>
          <input
            id="quadra"
            type="text"
            value={quadra}
            onChange={(e) => setQuadra(e.target.value)}
            className="w-full mb-3 p-3 border border-orange-500 rounded-md"
            placeholder="Escreva o numero da quadro"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="setor">Setor</label>
          <select
            id="setor"
            value={setor}
            onChange={(e) => setSetor(e.target.value)}
            className="w-full mb-3 p-3 border border-orange-500 rounded-md"
          >
            <option value="">Selecione</option>
            {setores.map((setor) => (
              <option key={setor.id} value={setor.id}>
                {setor.nome}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-orange-500 text-white py-3 rounded-full mt-4"
        >
          Próximo
        </button>
      </form>

      <div className="flex items-center justify-center gap-4 fixed bottom-10 left-40">
        <div className="border-none rounded-full bg-gray-200 w-3 h-3" />
        <div className="border-none rounded-full bg-amber-600 w-3 h-3" />
        <div className="border-none rounded-full bg-gray-200 w-3 h-3" />
        <div className="border-none rounded-full bg-gray-200 w-3 h-3" />
      </div>
    </div>
  );
}
