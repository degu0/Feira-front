import { useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";

type HeartButtonProps = {
  id: string;
  idCliente: string;
  jáFavoritado?: boolean;
  tipo: string;
};

export const HeartButton: React.FC<HeartButtonProps> = ({
  id,
  idCliente,
  jáFavoritado = false,
  tipo,
}) => {
  const token = localStorage.getItem("token");
  const [favoritado, setFavoritado] = useState(jáFavoritado);

  const handleFavoritar = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (!token || !idCliente) return;

    try {
      const favoritoUrl =
        tipo === "Loja"
          ? "http://127.0.0.1:8000/api/lojas_favoritos/"
          : "http://127.0.0.1:8000/api/produtos_favoritos/";

      if (!favoritado) {
        const response = await fetch(favoritoUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            cliente: idCliente,
            ...(tipo === "Loja" ? { loja: id } : { produto: id }),
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Erro ao favoritar:", errorData);
          return;
        }

        setFavoritado(true);
      } else {
        const deleteUrl =
          tipo === "Loja"
            ? `http://127.0.0.1:8000/api/lojas_favoritos/${id}`
            : `http://127.0.0.1:8000/api/produtos_favoritos/${id}`;

        const response = await fetch(deleteUrl, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Erro ao desfavoritar:", errorData);
          return;
        }

        setFavoritado(false);
      }
    } catch (error) {
      console.error("Erro geral ao favoritar/desfavoritar:", error);
    }
  };

  return (
    <button onClick={handleFavoritar} className="absolute top-2 right-2 z-10">
      {favoritado ? (
        <FaHeart className="text-amber-600 text-2xl" />
      ) : (
        <FaRegHeart className="text-amber-600 text-2xl" />
      )}
    </button>
  );
};
