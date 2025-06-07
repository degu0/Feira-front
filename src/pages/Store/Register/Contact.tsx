import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import IMask from "imask";
import appLogo from "../../../../public/logo.png";

export function Contact() {
  const navigate = useNavigate();

  const [whatsapp, setWhatsapp] = useState("");
  const [instagram, setInstagram] = useState("");
  const [website, setWebsite] = useState("");

  const whatsappRef = useRef<HTMLInputElement>(null);
  const instagramRef = useRef<HTMLInputElement>(null);
  const websiteRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Máscara para WhatsApp (telefone brasileiro)
    if (whatsappRef.current) {
      IMask(whatsappRef.current, {
        mask: "(00) 00000-0000",
      });
    }

    // Máscara para Instagram (obrigatório @ no início)
    if (instagramRef.current) {
      IMask(instagramRef.current, {
        mask: /^[a-zA-Z0-9_.]{0,29}$/,
        prepare: function (str) {
          // Garante que o valor começa com '@'
          if (!str.startsWith("@")) {
            return "@" + str.replace(/^@+/, "");
          }
          return str;
        },
        commit: function (value, masked) {
          // Remove espaços extras
          masked._value = value.trim();
        },
      });
    }

    // Máscara simples para Website (URL)
    if (websiteRef.current) {
      IMask(websiteRef.current, {
        mask: [
          {
            mask: "http://",
            lazy: false,
            placeholderChar: " ",
          },
          {
            mask: "https://",
            lazy: false,
            placeholderChar: " ",
          },
          {
            mask: "http://www.******************",
            definitions: {
              "*": /[a-zA-Z0-9\-\.]/,
            },
            lazy: false,
          },
          {
            mask: "https://www.******************",
            definitions: {
              "*": /[a-zA-Z0-9\-\.]/,
            },
            lazy: false,
          },
        ],
        // Você pode ajustar o padrão da máscara de URL para algo mais flexível
      });
    }
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const contact = {
      WhatsApp: whatsapp,
      Instagram: instagram,
      Website: website,
    };
    const updateDate = {
      ...JSON.parse(localStorage.getItem("store") || "{}"),
      ...contact,
    };
    localStorage.setItem("store", JSON.stringify(updateDate));
    navigate("/store/register/images");
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-6 bg-white text-lg">
      <img src={appLogo} alt="Logo do aplicativo" className="w-52 mb-15" />

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md flex flex-col gap-5"
      >
        <h2 className="font-semibold text-lg mb-4">Contatos e Redes Sociais</h2>

        <div className="flex flex-col gap-2 mb-4">
          <label htmlFor="whatsapp">Número de Whatsapp</label>
          <input
            id="whatsapp"
            type="tel"
            ref={whatsappRef}
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            className="min-w-60 mb-3 px-4 py-2 rounded-lg outline-1 outline-offset-[-0.50px] outline-amber-600"
            placeholder="(99) 99999-9999"
          />
        </div>

        <div className="flex flex-col gap-2 mb-4">
          <label htmlFor="instagram">Instagram / Facebook</label>
          <input
            id="instagram"
            type="text"
            ref={instagramRef}
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
            className="min-w-60 mb-3 px-4 py-2 rounded-lg outline-1 outline-offset-[-0.50px] outline-amber-600"
            placeholder="@usuario"
          />
        </div>

        <div className="flex flex-col gap-2 mb-6">
          <label htmlFor="website">Website</label>
          <input
            id="website"
            type="text"
            ref={websiteRef}
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            className="min-w-60 mb-3 px-4 py-2 rounded-lg outline-1 outline-offset-[-0.50px] outline-amber-600"
            placeholder="https://exemplo.com"
          />
        </div>

        <div className="flex items-center justify-center">
          <button
            type="submit"
            className="w-64 h-11 relative bg-amber-600 text-white rounded-[100px] text-lg font-medium mb-2"
          >
            Próximo
          </button>
        </div>
      </form>

      <div className="flex items-center justify-center gap-4 mt-6 fixed bottom-10 left-40">
        <div className="border-none rounded-full bg-gray-200 w-3 h-3" />
        <div className="border-none rounded-full bg-gray-200 w-3 h-3" />
        <div className="border-none rounded-full bg-amber-600 w-3 h-3" />
        <div className="border-none rounded-full bg-gray-200 w-3 h-3" />
      </div>
    </div>
  );
}
