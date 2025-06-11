import { useEffect, useState } from "react";
import rota from "../../../public/rota.png";

type DirectionsModalProps = {
  storeId: string;
  isOpen: boolean;
  onClose: () => void;
  token: string | null;
};

type MapaType = {
  id: number;
  loja: number;
  mapa: string;
};

export function DirectionsModal({
  storeId,
  isOpen,
  onClose,
  token,
}: DirectionsModalProps) {
  const [mapaImage, setMapaImage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMapaImage() {
      if (!storeId || !isOpen) return;

      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/mapa/${storeId}/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          console.error("Erro ao buscar mapa");
          return;
        }

        const data: MapaType = await response.json();

        setMapaImage(data.mapa);
      } catch (error) {
        console.error("Erro na requisição do mapa:", error);
      }
    }

    fetchMapaImage();
  }, [storeId, isOpen, token]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 bg-opacity-50">
      <div className="bg-white p-4 rounded-xl w-[90%] max-w-md">
        <h2 className="text-xl font-semibold mb-2">Mapa da Loja</h2>

        <div className="flex items-center justify-center">
          {" "}
          {rota ? (
            <img
              src={rota}
              alt="Mapa da loja"
              className="w-1/2 object-cover rounded mb-4"
            />
          ) : (
            <p className="text-gray-500">Carregando mapa...</p>
          )}
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-amber-600 text-white px-4 py-2 rounded"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
