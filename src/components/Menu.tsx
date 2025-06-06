import { FiPackage, FiPieChart } from "react-icons/fi";
import { GoHome } from "react-icons/go";
import { HiOutlineSquares2X2 } from "react-icons/hi2";
import { RxPerson } from "react-icons/rx";
import { Link } from "react-router-dom";

type MenuProps = {
  type: string;
};

export const Menu: React.FC<MenuProps> = ({ type }) => {
  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-md flex justify-around items-center h-20 z-50 text-2xl">
      <Link
        to="/"
        className="flex flex-col items-center gap-1 text-black"
      >
        <GoHome className="text-amber-700" />
        <span className="text-xs">Inicio</span>
      </Link>

      {type === "Cliente" && (
        <Link
          to="/category"
          className="flex flex-col items-center gap-1 text-black"
        >
          <HiOutlineSquares2X2 className="text-amber-700" />
          <span className="text-xs">Categorias</span>
        </Link>
      )}

      {type === "Lojista" && (
        <>
          <Link
            to="/dashboard"
            className="flex flex-col items-center gap-1 text-black"
          >
            <FiPieChart className="text-amber-700" />
            <span className="text-xs">Relatórios</span>
          </Link>
          <Link
            to="/productList"
            className="flex flex-col items-center gap-1 text-black"
          >
            <FiPackage  className="text-amber-700" />
            <span className="text-xs">Meus Produtos</span>
          </Link>
        </>
      )}

      <Link
        to="/profile"
        className="flex flex-col items-center gap-1 text-black"
      >
        <RxPerson className="text-amber-700" />
        <span className="text-xs">Perfil</span>
      </Link>
    </nav>
  );
};

