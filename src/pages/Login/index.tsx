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
      const res = await fetch(
        `http://localhost:3001/user?email=${email}&senha=${password}`
      );

      const data: UserType[] = await res.json();

      if (res.ok && data.length > 0) {
        const apiUser = data[0];
        const user = {
          id: apiUser.id,
          email: apiUser.email,
          type: apiUser.tipoUsuario,
        };

        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
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
      <img src={logo} alt="Logo do aplicativo" className="w-28 mb-6" />
      <form onSubmit={handleLogin}>
        <div className="flex flex-col gap-2">
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-3 p-3 border border-orange-500 rounded-md"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="password">Senha:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-3 p-3 border border-orange-500 rounded-md"
          />
        </div>

        {erro && <p className="text-red-500">{erro}</p>}

        <button
          type="submit"
          className="bg-orange-500 text-white w-full py-3 rounded-full mb-2"
        >
          Faça login
        </button>

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
