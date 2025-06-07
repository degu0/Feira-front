import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiCamera } from "react-icons/fi"; // Ícone de câmera
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
      <img src={appLogo} alt="Logo do aplicativo" className="w-52 mb-15" />
      <form onSubmit={handleLogin} className="w-full max-w-md flex flex-col gap-5">
        <h2 className="font-semibold text-lg mb-4">Informações da loja</h2>

        <div className="mb-4">
          <label htmlFor="logo" className="font-medium text-zinc-800 mb-1 block">
            Logo da Loja
          </label>
          <div className="relative w-24 h-24">
            <input
              id="logo"
              type="file"
              accept="image/*"
              onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
            />
            <div className="w-full h-full bg-zinc-300 rounded-lg flex items-center justify-center hover:bg-orange-200 transition-colors">
              <FiCamera className="text-white text-5xl" />
            </div>
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="capa" className="font-medium text-zinc-800 mb-1 block">
            Foto da Capa de Perfil
          </label>
          <div className="relative w-24 h-24">
            <input
              id="capa"
              type="file"
              accept="image/*"
              onChange={(e) => setCapaFile(e.target.files?.[0] || null)}
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
            />
            <div className="w-full h-full bg-zinc-300 rounded-lg flex items-center justify-center hover:bg-orange-200 transition-colors">
              <FiCamera className="text-white text-5xl" />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center mt-12">
          <button
            type="submit"
            className="w-64 h-11 relative bg-amber-600 text-white rounded-[100px] text-lg font-medium mb-2"
          >
            Cadastrar
          </button>
        </div>
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
