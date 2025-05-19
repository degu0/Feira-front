import { Menu } from "../../components/Menu";
import profile from "../../../public/profile.png";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type UserType = {
  id: string;
  nome: string;
  genero: string;
  email: string;
  telefone: string;
  tipoUsuario: string;
  data_nascimento: string;
};

export function Profile() {
  const [user, setUser] = useState<UserType>({
    id: "",
    nome: "",
    genero: "",
    email: "",
    telefone: "",
    tipoUsuario: "",
    data_nascimento: ""
  });
  const storedUserJSON = localStorage.getItem("user");

  useEffect(() => {
    async function loadData() {
      try {
        const parsedUser: { id: string } = JSON.parse(storedUserJSON);
        const response = await fetch(
          `http://localhost:3000/user?id=${parsedUser.id}`
        );
        const data: UserType[] = await response.json();
        console.log(data);

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
  }, [storedUserJSON]);

  function calcularIdade(dataNascimento: string): number {
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
  
    let idade = hoje.getFullYear() - nascimento.getFullYear();
  
    const mesAtual = hoje.getMonth();
    const diaAtual = hoje.getDate();
    const mesNascimento = nascimento.getMonth();
    const diaNascimento = nascimento.getDate();
  
    if (
      mesAtual < mesNascimento ||
      (mesAtual === mesNascimento && diaAtual < diaNascimento)
    ) {
      idade--;
    }
  
    return idade;
  }

  console.log(calcularIdade("2025-05-14"))

  return (
    <div>
      <div className="p-4">
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
            <li className="flex items-center justify-evenly">
              <p>Tipo de usuario</p> <p>{user.tipoUsuario}</p>
            </li>
            <li className="flex items-center justify-evenly">
              <p>Genero</p> <p>{user.genero}</p>
            </li>
            <li className="flex items-center justify-evenly">
              <p>Idade</p> <p>{calcularIdade(user.data_nascimento)}</p>
            </li>
            <li className="flex items-center justify-evenly">
              <p>Endereço</p> <p>Caruaru</p>
            </li>
            <li className="flex items-center justify-evenly">
              <p>Email</p> <p>{user.email}</p>
            </li>
            <li className="flex items-center justify-evenly">
              <p>Telefone</p> <p>{user.telefone}</p>
            </li>
          </ul>
        </div>
        <div>
          <Link to="/wishlist" className="text-blue-600 underline">
            {" "}
            Favoritos
          </Link>
        </div>
      </div>
      <Menu />
    </div>
  );
}
