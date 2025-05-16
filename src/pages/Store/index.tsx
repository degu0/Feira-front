import { useEffect, useState } from "react";
import { Menu } from "../../components/Menu";
import banner from "../../../public/banner.jpg";
import loja from "../../../public/loja.jpg";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

type StoreType = {
  id: string;
  nome: string;
  descricao: string;
  categoria: string;
  lojista: string;
  localizacao: string;
  redes_sociais: string;
  horario_funcionamento: string;
  produtos: string[];
};

type CategoryNameType = {
  id: string;
  nome: string;
};

export function Store() {
    const navigate = useNavigate();
  const { id } = useParams();
  const [store, setStore] = useState<StoreType | null>(null);
  const [categoryName, setCategoryName] = useState<CategoryNameType | null>(null);

  useEffect(() => {
    async function fetchStoreAndCategoryName() {
      try {
        const responseStore = await fetch(`http://localhost:3000/lojas?id=${id}`);
        if (!responseStore.ok) {
          throw new Error(`Erro ao buscar lojas: ${responseStore.status}`);
        }
        const dataStore: StoreType[] = await responseStore.json();
        const lojaEncontrada = dataStore[0]; 
        setStore(lojaEncontrada);

        const responseCategory = await fetch(`http://localhost:3000/categoria?id=${lojaEncontrada.categoria}`);
        if (!responseCategory.ok) {
          throw new Error(`Erro ao buscar categoria: ${responseCategory.status}`);
        }
        const dataCategoryName: CategoryNameType = await responseCategory.json();
        setCategoryName(dataCategoryName[0]);
      } catch (error) {
        console.error("Erro ao buscar categoria e loja:", error);
      }
    }

    if (id) {
      fetchStoreAndCategoryName();
    }
  }, [id]);

  return (
    <div className="h-full">
      <div className="h-full">
        <div className="flex-1 bg-center bg-cover bg-no-repeat h-3/12"
        style={{ backgroundImage: `url(${banner})` }}>
            <FaArrowLeft onClick={() => navigate(-1)} className="text-3xl absolute top-4 left-3"/>
          <img
            src={loja}
            alt="Imagem de perfil"
            className="w-20 rounded-full absolute top-44 left-39"
          />
        </div>
        <div className="my-15">
          <ul className="m-4 space-y-2">
          <p className="text-xl font-bold">{store?.nome}</p>
            <li><strong>Categoria:</strong> {categoryName?.nome}</li>
            <li><strong>Descrição:</strong> {store?.descricao}</li>
            <li><strong>Localização:</strong> {store?.localizacao}</li>
            <li><strong>Redes Sociais:</strong> {store?.redes_sociais}</li>
            <li><strong>Horários:</strong> {store?.horario_funcionamento}</li>
          </ul>
        </div>
      </div>
      <Menu />
    </div>
  );
}
