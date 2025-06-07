import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import person from "../../../public/profile.jpg";
import { Header } from "../../components/Header";

type AssessmentType = {
  id: string;
  cliente: string;
  loja: string;
  nota: string;
  comentario: string;
  criacao: string;
};

export function Assessment() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { idStore } = useParams();
  const [comments, setComments] = useState<AssessmentType[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/lojas/${idStore}/avaliacoes/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data:{ results: AssessmentType[] } = await response.json();
        console.log(data.results);

        if (response.ok) {
          setComments(data.results);
        } else {
          console.log("Erro no response", data);
        }
      } catch (error) {
        console.error("Erro ao buscar dados da api", error);
      }
    }

    loadData();
  }, [idStore, token]);

  const transformationStringForDate = (dateIso: string) => {
    const data = new Date(dateIso);
    return data.toLocaleString();
  };

  const renderStars = (rating: string) => {
    const numRating = parseInt(rating);
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <FaStar
          key={i}
          className={i < numRating ? "text-amber-600" : "text-gray-300"}
        />
      ));
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-200">
      <Header title="Avaliações" />

      <div className="bg-white flex-1">
        {comments.map((comment) => (
          <div key={comment.id} className="border-b border-amber-600/25 p-6">
            <div className="flex items-center gap-1 mb-2">
              {renderStars(comment.nota)}
            </div>
            <p className="mb-3">{comment.comentario}</p>
            <div className="flex items-center gap-2">
              <img src={person} alt="User" className="rounded-full w-10 h-10" />
              <div className="flex flex-col gap-1">
                <p className="font-medium text-zinc-800">{comment.cliente}</p>
                <p className="text-gray-400 text-sm">
                  {transformationStringForDate(comment.criacao)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="w-full p-4 bg-neutral-50 rounded-t-[5px] shadow-[0px_-2px_4px_rgba(0,0,0,0.1)] flex justify-center">
        <button
          className="w-64 h-11 bg-amber-600 rounded-[100px] text-white font-medium"
          onClick={() => navigate(`/comments/${idStore}`)}
        >
          Avaliar
        </button>
      </div>
    </div>
  );
}
