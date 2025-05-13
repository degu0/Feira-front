import { Menu } from "../../components/Menu";
import profile from "../../../public/profile.png";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type UserType = {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  tipo: string;
};

export function Profile() {
  const [user, setUser] = useState<UserType>({
    id: "",
    nome: "",
    email: "",
    telefone: "",
    tipo: "",
  });

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch("http://localhost:3000/clientes?id=1");
        const data: UserType[] = await response.json();

        if (response.ok && data.length > 0) {
          setUser(data[0]);
        } else {
          console.error("Erro no fetch de dados da usuario:", data);
        }
      } catch (error) {
        console.error("Erro ao buscar usuario:", error);
      }
    }
    loadData();
  }, []);

  return (
    <div>
      <div>
        <div className="flex items-center gap-5">
          <img
            src={profile}
            alt="Imagem de perfil"
            className="w-20 rounded-full"
          />
          <p>{user.nome}</p>
        </div>
        <div>
          <ul>
            <li>{user.email}</li>
            <li>{user.telefone}</li>
            <li>{user.tipo}</li>
          </ul>
        </div>
        <div>
          <Link to="/wishlist" className="text-blue-600 underline"> Favoritos</Link>
        </div>
      </div>
      <Menu />
    </div>
  );
}
