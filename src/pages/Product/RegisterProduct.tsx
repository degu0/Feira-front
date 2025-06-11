import { IoDocumentTextOutline } from "react-icons/io5";
import { Header } from "../../components/Header";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiCamera } from "react-icons/fi";

type CategoryType = {
  id: string;
  nome: string;
};

export function RegisterProduct() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const store = JSON.parse(localStorage.getItem("store") || "{}");
  const idStore = store.id;

  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [composicao, setComposicao] = useState("");
  const [cor, setCor] = useState("");
  const [category, setCategory] = useState("");
  const [loja, setLoja] = useState(`${idStore}`);
  const [imagem, setImagem] = useState<File | null>(null);

  const optionColors = [
    "vermelho",
    "azul",
    "verde",
    "amarelo",
    "laranja",
    "roxo",
    "rosa",
    "preto",
    "branco",
    "cinza",
    "marrom",
  ];

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/categorias/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data: CategoryType[] = await response.json();

        if (Array.isArray(data)) {
          setCategories(data);
        } else {
          console.error("Resposta inválida da API:", data);
        }
      } catch (error) {
        console.error("Erro ao buscar categorias:", error);
      }
    }

    fetchCategories();
  }, [token]);

  const handleProduto = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("nome", nome);
    formData.append("descricao", descricao);
    formData.append("loja", loja);
    formData.append("categorias", category);
    formData.append("cor", cor);
    formData.append("composicao", composicao);
    if (imagem) formData.append("imagem", imagem);

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/produtos/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        alert("Produto cadastrado com sucesso!");
        navigate("/productList");
      } else {
        console.error("Erro ao cadastrar produto");
      }
    } catch (error) {
      console.error("Erro ao enviar dados:", error);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-200">
      <Header title="Cadastro de Produtos" />
      <form
        onSubmit={handleProduto}
        className="flex-1 overflow-y-auto bg-white px-4 pt-4 pb-36 flex flex-col gap-6"
      >
        <div className="border-b border-amber-600 pb-5 flex flex-col gap-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="nome" className="font-medium">
              Nome do Produto
            </label>
            <input
              id="nome"
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="min-w-60 mb-3 px-4 py-2 rounded-lg outline-1 outline-offset-[-0.50px] outline-amber-600"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="categoria" className="font-medium">
              Categoria
            </label>
            <select
              id="categoria"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="min-w-60 mb-3 px-4 py-2 rounded-lg outline-1 outline-offset-[-0.50px] outline-amber-600"
            >
              <option value="">Selecione</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nome}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex flex-col gap-2 border-b border-amber-600 pb-5">
          <div className="flex items-center gap-2">
            <IoDocumentTextOutline className="w-6 h-6 text-amber-600" />
            <label htmlFor="descricao" className="font-medium">
              Descrição do produto
            </label>
          </div>
          <textarea
            id="descricao"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Escreva sua avaliação aqui..."
            className="border border-amber-600 rounded-lg p-3 min-h-[100px]"
          />
        </div>

        <div className="flex flex-col gap-2 border-b border-amber-600 pb-5">
          <h2 className="text-xl font-semibold">Adicionar imagem</h2>

          <div className="flex items-center gap-4">
            <div className="relative w-24 h-24">
              <input
                id="imagem"
                type="file"
                accept="image/*"
                onChange={(e) => setImagem(e.target.files?.[0] || null)}
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
              />
              <div className="w-full h-full bg-zinc-300 rounded-lg flex items-center justify-center hover:bg-orange-200 transition-colors">
                <FiCamera className="text-white text-5xl" />
              </div>
            </div>
            {imagem && (
              <span className="text-zinc-700 text-sm">{imagem.name}</span>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <h2 className="text-xl font-semibold">Informcações Adicionais</h2>
          <div className="flex flex-col gap-2">
            <label htmlFor="composicao" className="font-medium">
              Composição
            </label>
            <input
              id="composicao"
              type="text"
              value={composicao}
              onChange={(e) => setComposicao(e.target.value)}
              className="min-w-60 mb-3 px-4 py-2 rounded-lg outline-1 outline-offset-[-0.50px] outline-amber-600"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="cor" className="font-medium">
              Cor
            </label>
            <select
              id="cor"
              value={cor}
              onChange={(e) => setCor(e.target.value)}
              className="min-w-60 mb-3 px-4 py-2 rounded-lg outline-1 outline-offset-[-0.50px] outline-amber-600"
            >
              <option value="">Selecione</option>
              {optionColors.map((color, index) => (
                <option key={index} value={color}>
                  {color}
                </option>
              ))}
            </select>
          </div>
        </div>
      </form>

      <div className="fixed bottom-0 left-15 w-full p-4">
        <button
          type="submit"
          onClick={handleProduto}
          className="w-64 h-11 relative bg-amber-600 text-white rounded-[100px] text-lg font-medium mb-2"
        >
          Cadastrar
        </button>
      </div>
    </div>
  );
}
