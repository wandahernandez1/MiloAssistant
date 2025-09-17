import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <header className="navbar">
            <div className="navbar-left">
                <span>MiloAssistant</span>
            </div>
            <nav className="navbar-right">
                <ul>
                    <li><Link to="/funcionalidades">Funcionalidades</Link></li>
                    <li><Link to="/como-usar-milo">Como usar Milo</Link></li>
                    <li><Link to="/novedades">Novedades</Link></li>
                    <li className="profile-menu-container"></li>
                </ul>
            </nav>
        </header>
    );
}
