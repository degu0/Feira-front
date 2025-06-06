import { Header } from "../../components/Header";
import perfil from "../../../public/profile.jpg";

export function SwitchProfiles() {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col justify-between">
      <Header title="Trocar Perfil da Loja" />
      <div className="bg-white h-screen p-4 flex flex-col gap-10">
        <div>
          <h2 className="font-semibold text-xl">Perfis</h2>
          <p className="text-center text-lg">
            Selecione o perfil que deseja gerenciar
          </p>
        </div>

        <div className="flex items-center justify-between p-5 border-b border-amber-600/25">
          <div className="flex items-center gap-5">
            <img src={perfil} className="h-10 w-10 rounded-lg" />
            <h2>loja</h2>
          </div>
          <button>Trocar</button>
        </div>
      </div>
    </div>
  );
}
