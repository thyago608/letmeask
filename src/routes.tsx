import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "pages/Home";
import { NewRoom } from "pages/NewRoom";

export function RoutesApp() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="new" element={<NewRoom />} />
      </Routes>
    </BrowserRouter>
  );
}
