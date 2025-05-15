import { Route, Routes } from "react-router-dom";
import { Login } from "../pages/Login";
import { PrivateRoute } from "./PrivateRoute";
import { HomeWrapper } from "../wrappers/HomeWrapper";
import { LojistaRoutes } from "./LojistaRoutes";
import { ClienteRoutes } from "./ClienteRoutes";
import { Profile } from "../pages/Profile";
import { Product } from "../pages/Product";
import { Search } from "../pages/Search";
import { SearchResults } from "../pages/SearchResults";
import { CadastroLogin } from "../pages/RegisterLogin";
import { CategoryPreferences } from "../pages/CategoryPreferences";
import { Unauthorized } from "../pages/Unauthorized";

export function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<CadastroLogin />} />
      <Route path="/categoryPreferences/:id" element={<CategoryPreferences />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/product/:id" element={<Product />} />
      <Route path="/search" element={<Search />} />
      <Route path="/search/:searchTerm" element={<SearchResults />} />

      <Route
        path="/"
        element={
          <PrivateRoute>
            <HomeWrapper />
          </PrivateRoute>
        }
      />
      <Route
        path="/lojista"
        element={
          <PrivateRoute roles={["lojista"]}>
            <LojistaRoutes />
          </PrivateRoute>
        }
      />
      <Route
        path="/cliente"
        element={
          <PrivateRoute roles={["Turista", "Local"]}>
            <ClienteRoutes />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
