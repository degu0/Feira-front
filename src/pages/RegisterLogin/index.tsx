import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CustomSelect } from "../../components/CustomSelect";
import { useEffect } from "react";
import logo from "../../../public/logo.png";

const FormSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  tipoUsuario: z.string().min(1, "Selecione um tipo de usuário"),
  genero: z.string().min(1, "Selecione o gênero"),
  data_nascimento: z.string().min(1, "Data de nascimento é obrigatória"),
  email: z.string().email("Email inválido"),
  senha: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

type FormData = z.infer<typeof FormSchema>;

export function CadastroLogin() {
  const navigate = useNavigate();

  const typeOfPublic = [
    { id: "Local", nome: "Local" },
    { id: "Turistas", nome: "Turistas" },
    { id: "Trabalhadores Locais", nome: "Trabalhadores Locais" },
  ];

  const genders = [
    { id: "Masculino", nome: "Masculino" },
    { id: "Feminino", nome: "Feminino" },
    { id: "Não Binário", nome: "Não Binário" },
    { id: "Prefere não dizer", nome: "Prefere não dizer" },
  ];

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(FormSchema),
  });
  
  useEffect(() => {
    register("tipoUsuario");
    register("genero");
  }, [register]);

  const tipoUsuarioValue = watch("tipoUsuario");
  const generoValue = watch("genero");

  const onSubmit = async (data: FormData) => {
    try {
      const userId = Math.floor(Math.random() * 10000).toString();

      const res = await fetch("http://localhost:3000/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: userId,
          ...data,
        }),
      });

      if (res.ok) {
        navigate(`/categoryPreferences/${userId}`);
      }
    } catch (error) {
      console.error("Erro no cadastro:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-6 bg-white">
      <img src={logo} alt="Logo do aplicativo" className="w-24 mb-6" />
      <form
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-1">
          <label>Nome:</label>
          <input {...register("nome")} className="w-full mb-3 p-3 border border-orange-500 rounded-md" />
          {errors.nome && <p className="text-red-500">{errors.nome.message}</p>}
        </div>
        <div className="flex flex-col gap-1">
          <label>Data de nascimento:</label>
          <input type="date" {...register("data_nascimento")} className="w-full mb-3 p-3 border border-orange-500 rounded-md" />
          {errors.data_nascimento && <p className="text-red-500">{errors.data_nascimento.message}</p>}
        </div>
        <div className="flex flex-col gap-1">
          <label className="block mb-1 text-gray-700">Tipo de Usuário:</label>
          <CustomSelect
            type="radio"
            values={typeOfPublic}
            name="typeOfPublic"
            onChange={(selected) => {
              if (!Array.isArray(selected)) {
                setValue("tipoUsuario", selected.id, { shouldValidate: true });
              }
            }}
          />
          {errors.tipoUsuario && <p className="text-red-500">{errors.tipoUsuario.message}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label className="block mb-1 text-gray-700">Gênero:</label>
          <CustomSelect
            type="radio"
            values={genders}
            name="genders"
            onChange={(selected) => {
              if (!Array.isArray(selected)) {
                setValue("genero", selected.id, { shouldValidate: true });
              }
            }}
          />
          {errors.genero && <p className="text-red-500">{errors.genero.message}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label>Email:</label>
          <input type="email" {...register("email")} className="w-full mb-3 p-3 border border-orange-500 rounded-md" />
          {errors.email && <p className="text-red-500">{errors.email.message}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label>Senha:</label>
          <input type="password" {...register("senha")} className="w-full mb-3 p-3 border border-orange-500 rounded-md" />
          {errors.senha && <p className="text-red-500">{errors.senha.message}</p>}
        </div>

        <button type="submit" className="bg-orange-500 text-white w-full py-3 rounded-full">
          Cadastrar
        </button>
      </form>
    </div>
  );
}
