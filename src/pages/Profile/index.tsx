import { Menu } from "../../components/Menu";
import profile from "../../../public/profile.jpg";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoPeople } from "react-icons/go";
import { CiCalendar, CiLocationOn } from "react-icons/ci";
import { MdOutlineMailOutline } from "react-icons/md";
import { FiPhone } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { Header } from "../../components/Header";

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
  const navigate = useNavigate();
  const [user, setUser] = useState<UserType>({
    id: "",
    nome: "",
    genero: "",
    email: "",
    telefone: "",
    tipoUsuario: "",
    data_nascimento: "",
  });
  const storedUserJSON = localStorage.getItem("user");

  useEffect(() => {
    async function loadData() {
      try {
        const parsedUser: { id: string } = JSON.parse(storedUserJSON);
        const response = await fetch(
          `http://localhost:3001/user?id=${parsedUser.id}`
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

  console.log(calcularIdade("2025-05-14"));

  return (
    <div className="min-h-screen flex flex-col bg-gray-200">
      <Header title="Perfil" />
      <div className="h-screen bg-white roudend-lg p-4">
        <div className="flex items-center gap-3 text-lg font-semibold">
          <img src={profile} className="w-32 h-32 rounded-lg" />
          <p>{user.nome}</p>
        </div>
        <ul>
          <li className="flex justify-between items-center gap-2 border-b border-amber-600/25 py-5">
            <div className="flex items-center gap-5">
              <GoPeople className="text-amber-600 text-2xl" />
              <p className="text-zinc-800 text-base font-medium">
                Tipo de usuário
              </p>
            </div>
            <p className="text-amber-600 text-sm font-medium">
              {user.tipoUsuario}
            </p>
          </li>

          <li className="flex justify-between items-center gap-2 border-b border-amber-600/25 py-5">
            <div className="flex items-center gap-5">
              <GoPeople className="text-amber-600 text-2xl" />
              <p className="text-zinc-800 text-base font-medium">Gênero</p>
            </div>
            <p className="text-amber-600 text-sm font-medium">{user.genero}</p>
          </li>

          <li className="flex justify-between items-center gap-2 border-b border-amber-600/25 py-5">
            <div className="flex items-center gap-5">
              <CiCalendar className="text-amber-600 text-2xl" />
              <p className="text-zinc-800 text-base font-medium">Idade</p>
            </div>
            <p className="text-amber-600 text-sm font-medium">
              {calcularIdade(user.data_nascimento)}
            </p>
          </li>

          <li className="flex justify-between items-center gap-2 border-b border-amber-600/25 py-5">
            <div className="flex items-center gap-5">
              <CiLocationOn className="text-amber-600 text-2xl" />
              <p className="text-zinc-800 text-base font-medium">Endereço</p>
            </div>
            <p className="text-amber-600 text-sm font-medium">Caruaru</p>
          </li>

          <li className="flex justify-between items-center gap-2 border-b border-amber-600/25 py-5">
            <div className="flex items-center gap-5">
              <FiPhone className="text-amber-600 text-2xl" />
              <p className="text-zinc-800 text-base font-medium">Telefone</p>
            </div>
            <p className="text-amber-600 text-sm font-medium">
              {user.telefone}
            </p>
          </li>

          <li className="flex justify-between items-center gap-2 py-5">
            <div className="flex items-center gap-5">
              <MdOutlineMailOutline className="text-amber-600 text-2xl" />
              <p className="text-zinc-800 text-base font-medium">Email</p>
            </div>
            <p className="text-amber-600 text-sm font-medium">{user.email}</p>
          </li>

          <li className="flex justify-between items-center gap-2 py-5">
            <div className="flex items-center gap-1 text-lg">
              <FaHeart className="text-amber-600 text-2xl" />
              <p>Favoritos</p>
            </div>
            <button
              onClick={() => navigate(`/wishlist`)}
              className="p-2 border border-amber-600 rounded-md hover:bg-amber-50 transition"
            >
              <IoIosArrowForward className="text-amber-600 text-xl" />
            </button>
          </li>
        </ul>
      </div>
      <Menu />
    </div>
  );
}
