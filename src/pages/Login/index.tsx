import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContextProvider";
import logo from "../../../public/logo.png";

type UserType = {
  id: string;
  email: string;
  tipoUsuario: string;
};

export function Login() {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");

    try {
      const res = await fetch("http://127.0.0.1:8000/token/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password }),
      });
      const data = await res.json();

      if (res.ok && data) {
        localStorage.setItem("token", data.access);
        const resUser = await fetch(`http://127.0.0.1:8000/api/meu-perfil/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.access}`,
          },
        });

        const users: UserType[] = await resUser.json();
        const userInfo = users.cliente || users.lojista;
        const dataUser = {
          id: userInfo.id,
          tipo: users.cliente ? "Cliente" : "Lojista",
        };

        localStorage.setItem("user", JSON.stringify(dataUser));
        setUser(dataUser);
        navigate("/");
      } else {
        setErro("Email ou senha incorretos.");
      }
    } catch (error) {
      console.log("Erro no login:", error);
      setErro("Erro ao tentar fazer login.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-6 bg-white text-lg">
      <img src={logo} alt="Logo do aplicativo" className="w-52 h-24" />
      <form onSubmit={handleLogin} className="my-30 flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="min-w-60 mb-3 px-4 py-2 rounded-lg outline-1 outline-offset-[-0.50px] outline-amber-600"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="password">Senha</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="min-w-60 mb-3 px-4 py-2 rounded-lg outline-1 outline-offset-[-0.50px] outline-amber-600"
          />
        </div>

        {erro && <p className="text-red-500">{erro}</p>}

        <div className="flex items-center justify-center">
          <button
            type="submit"
            className="w-64 h-11 relative bg-amber-600 text-white rounded-[100px] text-lg font-medium mb-2"
          >
            Login
          </button>
        </div>

        <p className="text-base">
          Ainda não possui uma conta?{" "}
          <Link to="/register" className="font-bold">
            Cadastre-se
          </Link>
        </p>
      </form>
    </div>
  );
}
