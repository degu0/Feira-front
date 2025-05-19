import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Menu } from "../../components/Menu";
import { FaArrowLeft, FaStar } from "react-icons/fa";
import loja from "../../../public/loja.jpg";

type StoreType = {
  id: string;
  nome: string;
  descricao: string;
  categoria: string;
  lojista: string;
  localizacao: string;
  redes_sociais: string;
  horario_funcionamento: string;
  cor: string;
  produtos: string[];
};

export function Details() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [store, setStore] = useState<StoreType | null>(null);

  useEffect(() => {
    async function fetchStoreDetails() {
      try {
        const responseStore = await fetch(
          `http://localhost:3000/lojas?id=${id}`
        );
        if (!responseStore.ok) {
          throw new Error(`Erro ao buscar lojas: ${responseStore.status}`);
        }
        const dataStore: StoreType[] = await responseStore.json();
        const lojaEncontrada = dataStore[0];
        setStore(lojaEncontrada);
      } catch (error) {
        console.error("Erro ao buscar categoria e loja:", error);
      }
    }

    if (id) {
      fetchStoreDetails();
    }
  }, [id]);

  return (
    <div className="h-full">
      <div className="h-full">
        <div className="w-full flex items-center justify-start gap-10 mt-3">
          <FaArrowLeft
            onClick={() => navigate(-1)}
            className="text-xl ml-5 text-amber-600"
          />
          <h2 className="text-amber-600 font-semibold">Detelhes da loja</h2>
        </div>
        <div className="my-15 flex">
          <ul className="w-full m-4 space-y-2">
            <p className="text-xl font-bold flex items-center gap-5">
              <img src={loja} alt="logo da loja" className="w-20 rounded-lg" />
              {store?.nome}
            </p>
            <li className="flex justify-between items-center">
              <p>Avaliações</p>
              <p>4.5 de 5</p>
            </li>
            <li className="flex justify-between items-center">
              <p>Produtos</p>
              <p>4.5 de 5</p>
            </li>
            <li className="flex justify-between items-center">
              <p>Endereço</p>
              <p>{store?.localizacao}</p>
            </li>
            <li className="flex justify-between items-center">
              <p>Aderiu</p>
              <p>10 semanas</p>
            </li>
            <li className="flex justify-between items-center">
              <p>Descrição</p>
              <p>{store?.descricao}</p>
            </li>
            <div>
                <h2 className="font-semibold text-lg">Redes Sociais</h2>
              <li className="flex justify-between items-center">
                <p>Instagram</p>
                <p>{store?.redes_sociais}</p>
              </li>
            </div>
          </ul>
        </div>
      </div>
      <Menu />
    </div>
  );
}
