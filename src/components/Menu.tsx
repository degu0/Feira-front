import { Link } from "react-router-dom"

export const Menu = () => {
    return (
<nav className="fixed bottom-0 left-0 w-full bg-white border-t shadow-md flex justify-around items-center h-16 z-50">
      <Link to="/" className="flex flex-col items-center text-gray-700 hover:text-blue-500">
        <span className="text-xs">Home</span>
      </Link>
      <Link to="/profile" className="flex flex-col items-center text-gray-700 hover:text-blue-500">
        <span className="text-xs">Perfil</span>
      </Link>
    </nav>
    )
}
