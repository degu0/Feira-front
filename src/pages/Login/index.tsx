import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContextProvider";

type UserType = {
  email: string;
  tipoUsuario: string;
} 

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
        `http://localhost:3000/user?email=${email}&senha=${password}`
      );
  
      const data: UserType[] = await res.json();
  
      if (res.ok && data.length > 0) {
        const apiUser = data[0];
        const user = {
          email: apiUser.email,
          type: apiUser.tipoUsuario,
        };
      
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);
        navigate("/");
      }
      else {
        setErro("Email ou senha incorretos.");
      }
    } catch (error) {
      console.log("Erro no login:", error);
      setErro("Erro ao tentar fazer login.");
    }
  };  

  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <form
        onSubmit={handleLogin}
        className="flex flex-col items-center gap-5 border-2 rounded-2xl p-10"
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 border-black border-1 rounded"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="password">Senha:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 border-black border-1 rounded"
          />
        </div>

        {erro && <p className="text-red-500">{erro}</p>}

        <Link to="/register" className="text-blue-600 underline">
          Não possui conta?
        </Link>

        <button type="submit" className="p-2 bg-amber-700 rounded text-white">
          Entrar
        </button>
      </form>
    </div>
  );
}
