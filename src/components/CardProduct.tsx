import { NavLink } from "react-router-dom";
import jeans from "../../public/Jeans.jpg"

type CardProductProps = {
    id: string;
    nome: string;
}

export const CardProduct: React.FC<CardProductProps> = ({id, nome}) => {
    return(
        <NavLink to={`/product/${id}`} className="w-25 border-black border-2 rounded p-2">
            <div>
                <img src={jeans} alt="Imagem do produto" />
            </div>
            <div>
                <ul>
                    <li>{id}</li>
                    <li>{nome}</li>
                </ul>
            </div>
        </NavLink>
    )
}