import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "pages/Home";
import { NewRoom } from "pages/NewRoom";
import { Room } from "pages/Room";

export function RoutesApp() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="rooms/new" element={<NewRoom />} />
        <Route path="rooms/:id" element={<Room />} />
      </Routes>
    </BrowserRouter>
  );
}
