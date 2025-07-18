import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContextProvider";
import { HomeCliente } from "../pages/Cliente/HomeCliente";
import { HomeLojista } from "../pages/Lojista/HomeLojista";

export const HomeWrapper = () => {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/login" />;
  if ("Cliente".includes(user.tipo)) {
    return <HomeCliente />;
  }  
  if (user.tipo === "Lojista") return <HomeLojista />;

  return <Navigate to="/unauthorized" />;
};
