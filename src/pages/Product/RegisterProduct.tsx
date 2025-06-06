import { IoDocumentTextOutline } from "react-icons/io5";
import { Header } from "../../components/Header";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type CategoryType = {
  id: string;
  nome: string;
};

export function RegisterProduct() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [composicao, setComposicao] = useState("");
  const [cor, setCor] = useState("");
  const [category, setCategory] = useState("");
  const [loja, setLoja] = useState("2");
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

        const data: { results: CategoryType[] } = await response.json();

        if (Array.isArray(data.results)) {
          setCategories(data.results);
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
              className="w-full p-3 border border-orange-500 rounded-md"
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
              className="w-full p-3 border border-orange-500 rounded-md"
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
            className="border border-amber-600 rounded-lg p-3 min-h-[180px]"
          />
        </div>

        <div className="flex flex-col gap-2 border-b border-amber-600 pb-5">
          <h2 className="text-xl font-semibold">Adicionar imagem</h2>
          <input
            id="imagem"
            type="file"
            onChange={(e) =>
              setImagem(e.target.files ? e.target.files[0] : null)
            }
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-semibold
              file:bg-orange-100 file:text-orange-700
              hover:file:bg-orange-200
            "
          />
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
              className="w-full p-3 border border-orange-500 rounded-md"
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
              className="w-full p-3 border border-orange-500 rounded-md"
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

      <div className="fixed bottom-0 left-0 w-full p-4">
        <button
          type="submit"
          onClick={handleProduto}
          className="bg-orange-500 text-white w-full py-3 rounded-full text-lg font-semibold"
        >
          Cadastrar
        </button>
      </div>
    </div>
  );
}
