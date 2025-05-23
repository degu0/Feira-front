import { GoHome } from "react-icons/go";
import { HiOutlineSquares2X2 } from "react-icons/hi2";
import { RxPerson } from "react-icons/rx";
import { Link } from "react-router-dom";

export const Menu = () => {
  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-md flex justify-around items-center h-16 z-50 text-2xl">
      <Link
        to="/"
        className="flex flex-col items-center text-gray-700 hover:text-blue-500"
      >
        <GoHome className="text-amber-700" />
        <span className="text-xs">Home</span>
      </Link>
      <Link
        to="/category"
        className="flex flex-col items-center text-gray-700 hover:text-blue-500"
      >
        <HiOutlineSquares2X2 className="text-amber-700" />
        <span className="text-xs">Categoria</span>
      </Link>
      <Link
        to="/profile"
        className="flex flex-col items-center text-gray-700 hover:text-blue-500"
      >
        <RxPerson className="text-amber-700" />
        <span className="text-xs">Perfil</span>
      </Link>
    </nav>
  );
};
