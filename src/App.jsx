import { Routes, Route } from "react-router-dom";
import '@fortawesome/fontawesome-free/css/all.min.css';

import Home from "./pages/Home";
import Login from "./pages/Login";
import RegisterPage from "./pages/RegisterPage";

import Dashboard from "./pages/Dashboard";
import Notes from "./pages/Notes";
import EditProfile from "./pages/EditProfile";
import ComoUsarMilo from "./pages/ComoUsarMilo";
import Novedades from "./pages/Novedades";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/notes" element={<Notes />} />
      <Route path="/edit-profile" element={<EditProfile />} />
      <Route path="/como-usar-milo" element={<ComoUsarMilo />} />
      <Route path="/novedades" element={<Novedades />} />
    </Routes>

  );
}

export default App;
