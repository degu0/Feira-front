import { Route, Routes } from "react-router-dom";
import { Test } from "../pages/Cliente/test";

export function LojistaRoutes() {
  return (
    <Routes>
      <Route path="/test" element={<Test />} />
    </Routes>
  );
}
