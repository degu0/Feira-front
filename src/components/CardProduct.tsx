import { NavLink } from "react-router-dom";
import jeans from "../../public/Jeans.jpg";
import { FaRegHeart, FaStar } from "react-icons/fa";

type CardProductProps = {
  id: string;
  nome: string;
  categoria: number;
};

export const CardProduct: React.FC<CardProductProps> = ({
  id,
  nome,
  categoria,
}) => {
  return (
    <NavLink
      to={`/product/${id}`}
      className="w-36 border-1 border-gray-400 rounded-lg"
    >
      <div className="w-full h-30 bg-center bg-cover bg-no-repeat relative" style={{ backgroundImage: `url(${jeans})` }}>
        <FaRegHeart className="absolute top-2 right-2" />
      </div>
      <div className="p-3">
        <ul className="flex flex-col gap-2">
          <li className="text-md font-semibold">{nome}</li>
          <div className="text-sm">
            <li className="text-gray-600">{categoria}</li>
            <li className="font-semibold flex items-center gap-1">
              <FaStar className="text-amber-500" />
              {categoria}
            </li>
          </div>
        </ul>
      </div>
    </NavLink>
  );
};
