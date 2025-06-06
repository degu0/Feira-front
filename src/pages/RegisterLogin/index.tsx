import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect } from "react";
import logo from "../../../public/logo.png";

type UserType = {
  id: string;
  email: string;
};

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
    { id: "Turista", nome: "Turista" },
    { id: "Lojista", nome: "Feirante" },
  ];

  const genders = [
    { id: "Masculino", nome: "Masculino" },
    { id: "Feminino", nome: "Feminino" },
    { id: "Outro", nome: "Outro" },
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

  const onSubmit = async (formData: FormData) => {
    const { nome, email, senha, tipoUsuario, genero, data_nascimento } =
      formData;

    try {
      const registerUrl =
        tipoUsuario === "Lojista"
          ? "http://127.0.0.1:8000/api/criar-lojista/"
          : "http://127.0.0.1:8000/api/register/";

      const responseRegister = await fetch(registerUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          nome,
          senha,
        }),
      });

      if (!responseRegister.ok) {
        console.error("Erro ao registrar usuário");
        return;
      }

      const responseToken = await fetch("http://127.0.0.1:8000/token/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password: senha }),
      });

      const tokenData = await responseToken.json();
      localStorage.setItem("token", tokenData.access);

      const resUser = await fetch(`http://127.0.0.1:8000/api/meu-perfil/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenData.access}`,
        },
      });
      const users: UserType[] = await resUser.json();

      if (tipoUsuario === "Lojista") {
        const dataUser = {
          email: email,
          tipo: "Lojista",
        };
        localStorage.setItem("user", JSON.stringify(dataUser));
        navigate(`/store/register/information`);
      } else {
        await fetch(`http://127.0.0.1:8000/api/clientes/${users.cliente.id}/`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenData.access}`,
          },
          body: JSON.stringify({
            email,
            nome,
            cpf: "123",
            telefone: "123",
            faixa_etaria: "18-25",
            tipo: tipoUsuario,
            genero,
            categorias_desejadas: [1],
          }),
        });
        const dataUser = {
          email: email,
          tipo: tipoUsuario,
        };
        localStorage.setItem("user", JSON.stringify(dataUser));
        navigate(`/categoryPreferences/${email}`);
      }
    } catch (error) {
      console.error("Erro no cadastro:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-6 bg-white">
      <img src={logo} alt="Logo do aplicativo" className="w-52 h-24 mb-6" />
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label>Nome</label>
          <input
            {...register("nome")}
            className="min-w-85 mb-3 px-4 py-2 rounded-[5px] outline-1 outline-offset-[-0.50px] outline-amber-600"
          />
          {errors.nome && <p className="text-red-500">{errors.nome.message}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label>Data de nascimento</label>
          <input
            type="date"
            {...register("data_nascimento")}
            className="min-w-85 mb-3 px-4 py-2 rounded-[5px] outline-1 outline-offset-[-0.50px] outline-amber-600"
          />
          {errors.data_nascimento && (
            <p className="text-red-500">{errors.data_nascimento.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="block mb-1 text-gray-700">Tipo de Usuário</label>
          <div className="flex justify-between gap-10">
            {typeOfPublic.map((type) => (
              <label key={type.id} className="flex gap-2">
                <input
                  type="radio"
                  value={type.id}
                  {...register("tipoUsuario")}
                  className="accent-amber-600"
                />
                {type.nome}
              </label>
            ))}
          </div>
          {errors.tipoUsuario && (
            <p className="text-red-500">{errors.tipoUsuario.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="block mb-1 text-gray-700">Gênero</label>
          <div className="flex justify-between">
            {genders.map((gender) => (
              <label key={gender.id} className="flex items-center gap-2">
                <input
                  type="radio"
                  value={gender.id}
                  {...register("genero")}
                  className="accent-amber-600"
                />
                {gender.nome}
              </label>
            ))}
          </div>
          {errors.genero && (
            <p className="text-red-500">{errors.genero.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label>Email</label>
          <input
            type="email"
            {...register("email")}
            className="min-w-85 mb-3 px-4 py-2 rounded-[5px] outline-1 outline-offset-[-0.50px] outline-amber-600"
          />
          {errors.email && (
            <p className="text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label>Senha</label>
          <input
            type="password"
            {...register("senha")}
            className="min-w-85 mb-3 px-4 py-2 rounded-[5px] outline-1 outline-offset-[-0.50px] outline-amber-600"
          />
          {errors.senha && (
            <p className="text-red-500">{errors.senha.message}</p>
          )}
        </div>

        <div className="flex flex-col items-center">
          <button
            type="submit"
            className="w-64 h-11 relative bg-amber-600 text-white rounded-[100px] text-lg font-medium mb-5"
          >
            Cadastrar
          </button>
        </div>
      </form>
    </div>
  );
}
