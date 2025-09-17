import Navbar from "../components/Navbar";
import "../styles/edit-profile.css";

export default function EditProfile() {
    return (
        <div>
            <Navbar />
            <main className="edit-profile">
                <h1>Editar Perfil</h1>
                <form className="profile-form">
                    <input type="text" placeholder="Nombre" />
                    <input type="email" placeholder="Correo" />
                    <input type="password" placeholder="Nueva contraseña" />
                    <button type="submit">Guardar Cambios</button>
                </form>
            </main>
        </div>
    );
}
