import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContextProvider";

export function Login() {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const mockUsers = [
      { email: "cliente@email.com", password: "123", type: "cliente" },
      { email: "feirante@email.com", password: "123", type: "lojista" },
    ];

    const foundUser = mockUsers.find(
      (user) => user.email === email && user.password === password
    );
    if (foundUser) {
      localStorage.setItem("user", JSON.stringify(foundUser));
      setUser(foundUser);
      navigate("/");
    } else {
      setErro("Email ou senha inválidos.");
    }
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <form
        onSubmit={handleLogin}
        className="flex flex-col items-center gap-5 border-2 rounded-2xl p-10"
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="login-name">Email:</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            name="login-name"
            className="p-2 border-black border-1 rounded"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="login-password">Senha:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            name="login-password"
            className="p-2 border-black border-1 rounded"
          />
        </div>
        <button type="submit" className="p-2 bg-amber-700 rounded text-white">
          Cadastrar
        </button>
      </form>
    </div>
  );
}
