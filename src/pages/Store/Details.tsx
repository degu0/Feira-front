import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Menu } from "../../components/Menu";
import { FaInstagram, FaRegStar, FaWhatsapp } from "react-icons/fa";
import loja from "../../../public/loja.jpg";
import {
  IoCubeOutline,
  IoDocumentTextOutline,
  IoLocationOutline,
} from "react-icons/io5";
import { MdOutlineWatchLater } from "react-icons/md";
import { IoIosArrowForward } from "react-icons/io";
import { Header } from "../../components/Header";
import { TbWorld } from "react-icons/tb";
import { PiWatch } from "react-icons/pi";
import { HiOutlineSquares2X2 } from "react-icons/hi2";

type StoreType = {
  id: string;
  nome: string;
  descricao: string;
  categoria: string;
  lojista: string;
  localizacao: string;
  horario_funcionamento: string;
  cor: string;
  produtos: string[];
  WhatsApp: string;
  Website: string;
  Instagram: string;
};

export function Details() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { id } = useParams();
  const [store, setStore] = useState<StoreType | null>(null);

  useEffect(() => {
    async function fetchStoreDetails() {
      try {
        const responseStore = await fetch(
          `http://127.0.0.1:8000/api/lojas/${id}/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!responseStore.ok) {
          throw new Error(`Erro ao buscar lojas: ${responseStore.status}`);
        }
        const dataStore: StoreType[] = await responseStore.json();
        setStore(dataStore);
      } catch (error) {
        console.error("Erro ao buscar categoria e loja:", error);
      }
    }

    if (id) {
      fetchStoreDetails();
    }
  }, [id, token]);

  return (
    <div className="bg-gray-200 h-full">
      <div className="h-full">
        <Header title="Detalhes da loja" />
        <div className="h-screen flex bg-white">
          <ul className="w-full m-4 space-y-2">
            <p className="text-xl font-bold flex items-center gap-5">
              <img
                src={loja}
                alt="logo da loja"
                className="w-32 h-32 rounded-lg"
              />
              {store?.nome}
            </p>
            <div className="px-2">
              <li className="flex justify-between items-center py-5 border-b border-amber-600/25 ">
                <div className="flex items-center gap-5">
                  <FaRegStar className="text-amber-600 text-3xl" />
                  <p className="text-zinc-800">Avaliações</p>
                </div>
                <div className="w-1/2 flex items-center justify-between">
                  <p className="text-amber-600 font-medium text-sm">
                    Avalie primeiro
                  </p>
                  <button
                    onClick={() => navigate(`/assessment/${id}`)}
                    className="p-2 border border-amber-600 rounded-md hover:bg-amber-50 transition"
                  >
                    <IoIosArrowForward className="text-amber-600 text-xl" />
                  </button>
                </div>
              </li>
              <li className="flex justify-start items-center gap-6 py-5 border-b border-amber-600/25">
                <div className="flex items-center gap-2 w-[160px]">
                  <IoCubeOutline className="text-amber-600 text-3xl" />
                  <p className="text-zinc-800 text-base font-medium">
                    Produtos
                  </p>
                </div>
                <p className="text-amber-600 text-sm font-medium">
                  {store?.produtos.length}
                </p>
              </li>

              <li className="flex justify-start gap-6 items-center py-5 border-b border-amber-600/25">
                <div className="flex items-center gap-2 w-[160px]">
                  <IoLocationOutline className="text-amber-600 text-3xl" />
                  <p className="text-zinc-800 text-base font-medium">
                    Endereço
                  </p>
                </div>
                <p className="text-zinc-800 text-sm font-medium">
                  <span className="text-amber-600">Setor {store?.setor} </span>-{" "}
                  {store?.localizacao}
                </p>
              </li>

              <li className="flex justify-start gap-6 items-center py-5 border-b border-amber-600/25">
                <div className="flex items-center gap-2 w-[160px]">
                  <MdOutlineWatchLater className="text-amber-600 text-3xl" />
                  <p className="text-zinc-800 text-base font-medium">Aderiu</p>
                </div>
                <p className="text-amber-600 text-sm font-medium">10 semanas</p>
              </li>
              <li className="flex justify-start gap-6 items-center py-5 border-b border-amber-600/25">
                <div className="flex items-center gap-2 w-[160px]">
                  <HiOutlineSquares2X2 className="text-amber-600 text-3xl" />
                  <p className="text-zinc-800 text-base font-medium">
                    Categorias
                  </p>
                </div>
                <p className="text-zinc-800 text-sm font-medium flex gap-1">
                  <span className="bg-gray-200 p-1 rounded-lg">Bebes</span>
                  <span className="bg-gray-200 p-1 rounded-lg">Bebes</span>
                </p>
              </li>
              <li className="flex justify-start gap-6 items-center py-5 border-b border-amber-600/25">
                <div className="flex items-center gap-2 w-[160px]">
                  <PiWatch className="text-amber-600 text-3xl" />
                  <p className="text-zinc-800 text-base font-medium">
                    Horário de <br /> Funcionamento
                  </p>
                </div>
                <p className="text-zinc-800 text-sm font-medium flex flex-col gap-1">
                  <span>
                    <span className="text-amber-600">Das</span> 4:00{" "}
                  </span>
                  <span>
                    <span className="text-amber-600">Às</span> 15:00
                  </span>
                </p>
              </li>

              <li className="flex justify-start gap-6 items-center py-5">
                <div className="flex items-center gap-2 w-[160px]">
                  <IoDocumentTextOutline className="text-amber-600 text-3xl" />
                  <p className="text-zinc-800 text-base font-medium">
                    Descrição
                  </p>
                </div>
                <p className="text-zinc-800 text-sm font-medium">
                  {store?.descricao}
                </p>
              </li>
              <div className="flex flex-col gap-6 my-7">
                <h2 className="font-semibold text-xl">Redes Sociais</h2>
                <li className="flex justify-start gap-6 items-center">
                  <div className="flex items-center gap-2 w-[160px]">
                    <FaWhatsapp className="text-amber-600 text-3xl" />
                    <p>Whatsapp</p>
                  </div>
                  <p className="text-amber-600">{store?.WhatsApp}</p>
                </li>
                <li className="flex justify-start gap-6 items-center">
                  <div className="flex items-center gap-2 w-[160px]">
                    <FaInstagram className="text-amber-600 text-3xl" />
                    <p>Instagram</p>
                  </div>
                  <p className="text-amber-600">{store?.Instagram}</p>
                </li>
                <li className="flex justify-start gap-6 items-center">
                  <div className="flex items-center gap-2 w-[160px]">
                    <TbWorld className="text-amber-600 text-3xl" />
                    <p>WebSite</p>
                  </div>
                  <p className="text-amber-600">{store?.Website}</p>
                </li>
              </div>
            </div>
          </ul>
        </div>
      </div>
      <Menu type="Cliente" />
    </div>
  );
}
