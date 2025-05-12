import { Route, Routes } from "react-router-dom";
import { Test } from "../pages/Cliente/test";

export function ClienteRoutes() {
  return (
    <Routes>
      <Route path="/test" element={<Test />} />
    </Routes>
  );
}
