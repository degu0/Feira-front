import { useState } from "react";
import { useNavigate } from "react-router-dom";
import appLogo from "../../../../public/logo.png";

export function Images() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [capaFile, setCapaFile] = useState<File | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const storedData = JSON.parse(localStorage.getItem("store") || "{}");

    const formData = new FormData();

    Object.entries(storedData).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => formData.append(`${key}[]`, v));
      } else {
        formData.append(key, value);
      }
    });
    if (logoFile) formData.append("logo", logoFile);
    if (capaFile) formData.append("banner", capaFile);


    try {
      const response = await fetch("http://127.0.0.1:8000/api/lojas/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erro ao enviar dados:", errorData);
        return;
      }
      localStorage.removeItem("store");

      navigate("/login");
    } catch (error) {
      console.error("Erro na requisição:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-6 bg-white text-lg">
      <img src={appLogo} alt="Logo do aplicativo" className="w-50 mb-15" />
      <form onSubmit={handleLogin} className="w-full max-w-md flex flex-col gap-5">
        <h2 className="font-semibold text-lg mb-4">Informações da loja</h2>

        <div className="mb-4">
          <label htmlFor="logo" className="block mb-1">
            Logo da Loja
          </label>
          <input
            id="logo"
            type="file"
            accept="image/*"
            onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-semibold
              file:bg-gray-200 file:text-black
              file:h-24
              hover:file:bg-orange-200"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="capa" className="block mb-1">
            Foto da Capa de Perfil
          </label>
          <input
            id="capa"
            type="file"
            accept="image/*"
            onChange={(e) => setCapaFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-semibold
              file:bg-gray-200 file:text-black
              file:h-24
              hover:file:bg-orange-200"
          />
        </div>

        <button
          type="submit"
          className="bg-orange-500 text-white w-full py-3 rounded-full"
        >
          Cadastrar
        </button>
      </form>

      <div className="flex items-center justify-center gap-4 mt-6 fixed bottom-10 left-40">
        <div className="border-none rounded-full bg-gray-200 w-3 h-3" />
        <div className="border-none rounded-full bg-gray-200 w-3 h-3" />
        <div className="border-none rounded-full bg-gray-200 w-3 h-3" />
        <div className="border-none rounded-full bg-amber-600 w-3 h-3" />
      </div>
    </div>
  );
}
