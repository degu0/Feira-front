import { NavLink } from "react-router-dom";
import { FaRegHeart } from "react-icons/fa";

type CardProductProps = {
  id: string;
  nome: string;
  categoria?: string;
  imagem: string;
};

export const CardProduct: React.FC<CardProductProps> = ({
  id,
  nome,
  categoria,
  imagem
}) => {
  return (
    <NavLink
      to={`/product/${id}`}
      className="w-44 h-64 relative block"
    >
      <img
        src={imagem}
        alt={nome}
        className="w-44 h-44 absolute top-0 left-0 rounded-tl-[5px] rounded-tr-[5px] object-cover"
      />

      <div className="w-44 h-64 absolute top-0 left-0 rounded-[5px] border border-amber-600/25 pointer-events-none" />


      <div className="absolute top-[178px] left-3 text-zinc-800 text-base font-semibold leading-6">
        {nome}
      </div>

      <div className="absolute top-[210px] left-3 text-gray-600 text-sm font-semibold leading-6">
        {categoria}
      </div>

      <div className="w-7 h-10 absolute top-2 right-2 overflow-hidden">
          <FaRegHeart className="text-amber-600 text-2xl" />
      </div>
    </NavLink>
  );
};
