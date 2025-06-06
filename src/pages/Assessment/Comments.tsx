import { FaStar } from "react-icons/fa";
import { Header } from "../../components/Header";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

export function Comments() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { idStore } = useParams();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const idCliente = user.id;

  const [comentario, setComentario] = useState("");
  const [nota, setNota] = useState("");
  
  const handleAssesmentRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    

    const formData = new FormData();
    formData.append("cliente", String(idCliente));
    formData.append("loja", String(idStore));
    formData.append("comentario", comentario);
    formData.append("nota", nota);

    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/avaliacoes/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        navigate(`/assessment/${idStore}`)
      }
    } catch (error) {
      console.error("Erro ao enviar dados:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-200">
      <Header title="Avaliar" />

      <div className="flex-1 flex h-screen">
        <form
          onSubmit={handleAssesmentRegister}
          className="bg-white rounded-lg p-6 w-full max-w-md flex flex-col gap-10 shadow-md h-screen"
        >
          <div className="flex flex-col gap-6 mt-15">
            <div className="flex justify-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <label key={star}>
                  <input
                    type="radio"
                    name="nota"
                    value={star}
                    checked={nota === String(star)}
                    onChange={(e) => setNota(e.target.value)}
                    className="hidden"
                  />
                  <FaStar
                    className={`text-2xl cursor-pointer ${
                      Number(nota) >= star
                        ? "text-amber-600"
                        : "text-gray-400"
                    }`}
                  />
                </label>
              ))}
            </div>
            <p className="text-lg font-medium text-center">
              Que nota você dá para a loja?
            </p>
          </div>

          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-2">
              <label className="text-lg font-medium">Deixe um comentário</label>
              <textarea
                id="comentario"
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                placeholder="Escreva sua avaliação aqui..."
                className="border border-amber-600 rounded-lg p-3 min-h-[250px]"
              />
            </div>

            <button
              type="submit"
              className="w-full h-11 bg-amber-600 rounded-[100px] text-white font-medium hover:bg-amber-700 transition-colors"
            >
              Enviar Avaliação
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
