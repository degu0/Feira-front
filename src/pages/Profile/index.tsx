import { Menu } from "../../components/Menu";
import profile from "../../../public/profile.jpg";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoPeople } from "react-icons/go";
import { CiCalendar, CiLocationOn } from "react-icons/ci";
import { MdLogout, MdOutlineMailOutline } from "react-icons/md";
import { FiPhone } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { Header } from "../../components/Header";
import { BsThreeDotsVertical } from "react-icons/bs";

type UserType = {
  id: string;
  nome: string;
  genero: string;
  email: string;
  telefone: string;
  tipo: string;
  faixa_etaria: string;
};

type ApiResponse = {
  cliente?: UserType;
  lojista?: UserType;
};

export function Profile() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const userData = localStorage.getItem("user");
  const userType = userData ? JSON.parse(userData).tipo : "Cliente";

  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<UserType>({
    id: "",
    nome: "",
    genero: "",
    email: "",
    telefone: "",
    tipo: "",
    faixa_etaria: "",
  });

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/meu-perfil/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data: ApiResponse = await response.json();

        if (response.ok && data) {
          if (userType === "Lojista" && data.lojista) {
            setUser(data.lojista);
          } else if (data.cliente) {
            setUser(data.cliente);
          }
        } else {
          console.error("Erro no fetch de dados da usuário:", data);
        }
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
      }
    }

    if (token) loadData();
  }, [token, userType]);

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

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex items-center justify-end p-4 w-full">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-8 h-8"
        >
          <BsThreeDotsVertical className="w-full h-full text-amber-600" />
        </button>
      </div>
      {isOpen && (
        <div className="absolute left-58 top-6 rounded-md bg-white shadow-lg z-10 text-amber-600">
          <ul className="py-1">
            <li
              onClick={() => {
                navigate("/login");
              }}
              className="px-8 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
            >
              <MdLogout /> <span className="text-zinc-800">Sair</span>
            </li>
          </ul>
        </div>
      )}
      <div className="h-screen bg-white rounded-lg px-6">
        <div className="flex items-center gap-5">
          <img src={profile} className="w-28 h-28 rounded-lg" />
          <p className="text-zinc-800 text-xl font-bold leading-3">{user.nome}</p>
        </div>
        <ul>
          <li className="flex justify-start items-center gap-20 border-b border-amber-600/25 py-5">
            <div className="flex items-center gap-2 w-[160px]">
              <GoPeople className="text-amber-600 text-3xl" />
              <p className="text-zinc-800 text-base font-medium leading-3 w-full">
                Tipo de usuário
              </p>
            </div>
            <p className="text-amber-600 text-sm font-medium">{userType}</p>
          </li>

          {userType === "Cliente" && (
            <>
              <li className="flex justify-start items-center gap-20 border-b border-amber-600/25 py-5">
                <div className="flex items-center gap-2 w-[160px]">
                  <GoPeople className="text-amber-600 text-3xl" />
                  <p className="text-zinc-800 text-base font-medium leading-3">Gênero</p>
                </div>
                <p className="text-amber-600 text-sm font-medium">
                  {user.genero}
                </p>
              </li>
              <li className="flex justify-start items-center gap-20 border-b border-amber-600/25 py-5">
                <div className="flex items-center gap-2 w-[160px]">
                  <FiPhone className="text-amber-600 text-3xl" />
                  <p className="text-zinc-800 text-base font-medium leading-3">
                    Telefone
                  </p>
                </div>
                <p className="text-amber-600 text-sm font-medium">
                  {user.telefone}
                </p>
              </li>
            </>
          )}

          <li className="flex justify-start items-center gap-20 border-b border-amber-600/25 py-5">
            <div className="flex items-center gap-2 w-[160px]">
              <CiCalendar className="text-amber-600 text-3xl" />
              <p className="text-zinc-800 text-base font-medium leading-3">Idade</p>
            </div>
            <p className="text-amber-600 text-sm font-medium">
              {calcularIdade(user.faixa_etaria)} anos
            </p>
          </li>

          <li className="flex justify-start items-center gap-20 border-b border-amber-600/25 py-5">
            <div className="flex items-center gap-2 w-[160px]">
              <CiLocationOn className="text-amber-600 text-3xl" />
              <p className="text-zinc-800 text-base font-medium leading-3">Endereço</p>
            </div>
            <p className="text-amber-600 text-sm font-medium">Caruaru</p>
          </li>

          <li className="flex justify-start items-center gap-20 py-5">
            <div className="flex items-center gap-2 w-[160px]">
              <MdOutlineMailOutline className="text-amber-600 text-3xl" />
              <p className="text-zinc-800 text-base font-medium leading-3">Email</p>
            </div>
            <p className="text-amber-600 text-sm font-medium">{user.email}</p>
          </li>

          {userType === "Cliente" && (
            <li className="flex justify-between items-center gap-2 py-5">
              <div className="flex items-center gap-3 text-lg">
                <FaHeart className="text-amber-600 text-3xl" />
                <p>Favoritos</p>
              </div>
              <button
                onClick={() => navigate(`/wishlist`)}
                className="p-2 border border-amber-600 rounded-md hover:bg-amber-50 transition"
              >
                <IoIosArrowForward className="text-amber-600 text-xl" />
              </button>
            </li>
          )}
        </ul>
      </div>
      <Menu type={userType === "Cliente" ? "Cliente" : "Lojista"} />
    </div>
  );
}
