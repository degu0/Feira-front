import {  FaStar } from "react-icons/fa";
import { Header } from "../../components/Header";


export function Comments() {

  return (
    <div className="min-h-screen flex flex-col bg-gray-200">
    <Header title="Avaliar" />
      
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6 w-full max-w-md flex flex-col gap-6 shadow-md">
          <div className="flex flex-col gap-2">
            <p className="text-lg font-medium text-center">Que nota você dá para a loja?</p>
            <div className="flex justify-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar 
                  key={star} 
                  className="text-amber-600 text-2xl cursor-pointer" 
                />
              ))}
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-lg font-medium">Deixe um comentário</label>
            <textarea 
              className="border border-gray-300 rounded-lg p-3 min-h-[100px]"
              placeholder="Escreva sua avaliação aqui..."
            />
          </div>
          
          <button 
            className="w-full h-11 bg-amber-600 rounded-[100px] text-white font-medium hover:bg-amber-700 transition-colors"
          >
            Enviar Avaliação
          </button>
        </div>
      </div>
    </div>
  );
}