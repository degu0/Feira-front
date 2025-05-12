import { BrowserRouter } from "react-router-dom";
import { AppRouter } from "./routes";
import {AuthContextProvider } from "./context/AuthContextProvider";

export function App() {
  return (
    <AuthContextProvider>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </AuthContextProvider>
  );
}
