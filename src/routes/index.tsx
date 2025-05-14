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

export function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={<h1>Acesso negado</h1>} />
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
          <PrivateRoute roles={["cliente"]}>
            <ClienteRoutes />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
