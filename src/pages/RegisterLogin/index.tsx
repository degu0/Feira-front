import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CustomSelect } from "../../components/CustomSelect";
import { useEffect } from "react";

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
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <h1 className="text-2xl font-bold mb-4">Cadastro de Usuário</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center gap-5 border-2 rounded-2xl p-10"
      >
        <div className="flex flex-col gap-1">
          <label>Nome:</label>
          <input {...register("nome")} className="p-2 border rounded" />
          {errors.nome && <p className="text-red-500">{errors.nome.message}</p>}
        </div>
        <div className="flex flex-col gap-1">
          <label>Data de nascimento:</label>
          <input type="date" {...register("data_nascimento")} className="p-2 border rounded" />
          {errors.data_nascimento && <p className="text-red-500">{errors.data_nascimento.message}</p>}
        </div>
        <div className="flex flex-col gap-1">
          <label>Tipo de Usuário:</label>
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
          <label>Gênero:</label>
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
          <input type="email" {...register("email")} className="p-2 border rounded" />
          {errors.email && <p className="text-red-500">{errors.email.message}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label>Senha:</label>
          <input type="password" {...register("senha")} className="p-2 border rounded" />
          {errors.senha && <p className="text-red-500">{errors.senha.message}</p>}
        </div>

        <button type="submit" className="p-2 bg-blue-600 text-white rounded">
          Cadastrar
        </button>
      </form>
    </div>
  );
}
