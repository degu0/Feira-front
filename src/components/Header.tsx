import React, { useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaArrowLeft } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import { useNavigate } from "react-router-dom";

type HeaderProps = {
  title?: string;
  className?: string;
  menu?: boolean;
};

export const Header: React.FC<HeaderProps> = ({
  title,
  className = "",
  menu,
}) => {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <header
      className={`text-amber-600 font-semibold flex items-center justify-between gap-4 p-4 ${className}`}
    >
      <div className="flex items-center gap-4">
        <button
          aria-label="Voltar"
          onClick={handleGoBack}
          className="w-10 h-10 bg-neutral-50 rounded-[5px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] 
                flex items-center justify-center cursor-pointer"
        >
          <FaArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-semibold">{title}</h1>
      </div>
      {menu && (
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className=""
        >
          <BsThreeDotsVertical className="w-6 h-10" />
        </button>
      )}
      {isOpen && (
        <div className="absolute left-58 top-6 rounded-md bg-white shadow-lg z-10 border">
          <ul className="py-1">
              <li
                onClick={() => {
                    navigate('/login')
                }}
                className="px-8 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
              >
                <MdLogout  /> Sair
              </li>
          </ul>
        </div>
      )}
    </header>
  );
};
