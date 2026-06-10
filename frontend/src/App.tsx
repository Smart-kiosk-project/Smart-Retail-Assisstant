import { BrowserRouter, Routes, Route } from "react-router-dom";
import AvatarPage from "./pages/AvatarPage";
import BillingPage from "./pages/BillingPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AvatarPage />} />
        <Route path="/billing" element={<BillingPage />} />
      </Routes>
    </BrowserRouter>
  );
}