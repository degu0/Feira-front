import { useEffect, useState } from "react";
import { Menu } from "../../components/Menu";
import { Chart } from "react-google-charts";

type StoreType = {
  id: string;
  logo: string;
  banner: string;
};


const lojaCurtidasData = [
  ["Tipo", "Curtidas"],
  ["Locais", 50],
  ["Turistas", 30],
];

const produtosMaisVistosData = [
  ["Produto", "Visualizações"],
  ["Sapato Nike", 100],
  ["Chinelo", 80],
  ["Short de Praia", 120],
  ["Chinelo 2", 60],
];

const categoriasMaisAcessadasData = [
  ["Categoria", "Acessos"],
  ["Calçados", 220],
  ["Moda Íntima", 45],
  ["Moda Praia", 90],
  ["Moda Masculina", 130],
];

export function AnalyticsDashboard() {
  const token = localStorage.getItem("token");
  const [store, setStore] = useState<StoreType | null>(null);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const idLojista = user.id;

  useEffect(() => {
    async function fetchStore() {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/lojas/2/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("Erro ao buscar loja");
        const data: StoreType = await response.json();
        setStore(data);
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      }
    }

    fetchStore();
  }, [token]);

  return (
    <div className="bg-gray-200 min-h-screen">
      <div
        className="relative h-32 w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${store?.banner})` }}
      >
        <img
          src={store?.logo}
          alt="Logo da loja"
          className="w-24 h-24 rounded-full absolute bottom-[-2rem] left-1/2 transform -translate-x-1/2 border-4 border-white shadow-md bg-white object-cover"
        />
      </div>

      <div className="w-full h-20 bg-white flex items-center justify-center">
        <h1 className="text-2xl font-semibold mt-3">Relatórios</h1>
      </div>

      <div className="px-5 mt-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-amber-600 font-medium">Resumo de Desempenho</p>
          <p className="text-gray-500 text-sm text-center">
            Período de <br /> 01/05 a 30/05/2025
          </p>
        </div>
        <div className="grid grid-cols-2 gap-5">
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <p className="text-sm">Visualizações da loja</p>
            <h2 className="text-4xl text-green-500 mt-3">8001</h2>
          </div>
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <p className="text-sm">Interações de usuários</p>
            <h2 className="text-4xl text-green-500">+10%</h2>
          </div>
        </div>
      </div>
      <div className="bg-white mt-6 p-5 h-screen">
        <h2 className="text-lg font-semibold mb-4">Relatórios de desempenho</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-4">
          <div className="bg-white rounded-lg p-4 shadow">
            <h2 className="text-xl font-semibold mb-2">Curtidas da Loja</h2>
            <Chart
              chartType="PieChart"
              width="100%"
              height="300px"
              data={lojaCurtidasData}
              options={{
                colors: ["#d97706", "#78350f"],
              }}
            />
          </div>

          <div className="bg-white rounded-lg p-4 shadow">
            <h2 className="text-xl font-semibold mb-2">Produtos mais vistos</h2>
            <Chart
              chartType="BarChart"
              width="100%"
              height="300px"
              data={produtosMaisVistosData}
              options={{
                colors: ["#d97706"],
              }}
            />
          </div>

          <div className="bg-white rounded-lg p-4 shadow">
            <h2 className="text-xl font-semibold mb-2">
              Categorias mais acessadas
            </h2>
            <Chart
              chartType="ColumnChart"
              width="100%"
              height="300px"
              data={categoriasMaisAcessadasData}
              options={{
                colors: ["#78350f"],
              }}
            />
          </div>
        </div>
      </div>

      <Menu type="Lojista" />
    </div>
  );
}
