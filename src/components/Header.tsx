import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

type HeaderProps = {
    title?: string;
    className?: string;
};

export const Header: React.FC<HeaderProps> = ({ title, className = "" }) => {
    const navigate = useNavigate();
    
    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <header className={`text-amber-600 font-semibold flex items-center gap-4 p-4 ${className}`}>
            <button
                aria-label="Voltar"
                onClick={handleGoBack}
                className="w-10 h-10 bg-neutral-50 rounded-[5px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] 
                flex items-center justify-center cursor-pointer"
            >
                <FaArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-semibold">{title}</h1>
        </header>
    );
};