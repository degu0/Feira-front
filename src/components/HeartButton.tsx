import { useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";


type HeartButtonProps = {
  id: string;
  favoritedInitially?: boolean;
  tipo: "Loja" | "Produto";
  hide?: boolean;
};

export const HeartButton: React.FC<HeartButtonProps> = ({
  id,
  favoritedInitially,
  tipo,
  hide,
}) => {
  if (hide) return null;

  const token = localStorage.getItem("token");
  const userData = localStorage.getItem("user");
  const userId = userData ? JSON.parse(userData)?.id : null;

  const [favoritado, setFavoritado] = useState(favoritedInitially);

  useEffect(() => {
    setFavoritado(favoritedInitially);
  }, [favoritedInitially]);

  const handleFavoritar = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!token || !userId) return;

    const baseUrlPost =
      tipo === "Loja"
        ? `http://127.0.0.1:8000/api/lojas_favoritas/`
        : `http://127.0.0.1:8000/api/produtos_favoritos/`;
    const baseUrlDelete =
      tipo === "Loja"
        ? `http://127.0.0.1:8000/api/clientes/${userId}/lojas_favoritas/${id}/`
        : `http://127.0.0.1:8000/api/clientes/${userId}/produtos_favoritos/${id}/`;

    try {
      if (!favoritado) {
        const response = await fetch(baseUrlPost, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            cliente: userId,
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
        const response = await fetch(baseUrlDelete, {
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
      console.error("Erro ao processar favorito:", error);
    }
  };

  return (
    <button onClick={handleFavoritar} className="absolute top-2 right-2 z-0">
      {favoritado ? (
        <FaHeart className="text-amber-600 text-2xl" />
      ) : (
        <FaRegHeart className="text-amber-600 text-2xl" />
      )}
    </button>
  );
};
