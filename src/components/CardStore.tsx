import { NavLink } from "react-router-dom";
import { HeartButton } from "./HeartButton";
import { FaStar } from "react-icons/fa";

type CardStoreProps = {
  store: {
    id: string;
    nome: string;
    logo: string;
    categorias: number[];
    setor: string;
    cor?: string;
    localizacao: string;
    nota_media?: number;
  };
  categories: Record<number, string>;
  corMap: Record<string, string>;
};

export const CardStore = ({ store, categories, corMap }: CardStoreProps) => {
  return (
    <NavLink
      to={`/store/${store.id}`}
      className="py-2 px-4 flex items-center justify-between"
    >
      <div className="mr-5">
        <img
          src={store.logo}
          alt="Imagem de perfil"
          className="w-20 h-20 rounded-[5px]"
        />
      </div>
      <div className="flex-1 border-b border-amber-600/25 py-2">
        <div className="flex justify-between items-center relative z-0">
          <p className="text-lg font-semibold">{store.nome}</p>
          <HeartButton id={store.id} tipo="Loja" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className={`w-3 h-3 rounded-full ${corMap[store.setor]}`} />
            <span>
              Setor {store.cor || store.setor} |{" "}
              {store.categorias.map((id) => categories[id]).join(", ")}
            </span>
          </div>
          <p className="text-sm text-gray-500">{store.localizacao}</p>
          <div className="flex items-center gap-1 text-sm text-amber-600">
            <FaStar className="text-md" />
            <span className="text-black">{store.nota_media ?? 5}</span>
          </div>
        </div>
      </div>
    </NavLink>
  );
};
