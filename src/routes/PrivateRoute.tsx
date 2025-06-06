import { Navigate } from "react-router-dom";
import { useContext, ReactNode } from "react";
import { AuthContext } from "../context/AuthContextProvider";

type PrivateRouteProps = {
  children: ReactNode;
  roles?: string[];
};

export function PrivateRoute({ children, roles }: PrivateRouteProps) {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/login" replace />;
  
  if (roles && !roles.includes(user.tipo)) return <Navigate to="/unauthorized" replace />;

  return <>{children}</>;
}
