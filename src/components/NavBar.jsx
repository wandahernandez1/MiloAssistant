import { Link } from "react-router-dom";
import ProfileMenu from "./ProfileMenu";
import FunctionalitiesMenu from "./FunctionalitiesMenu";

export default function Navbar({ showProfile }) {
    return (
        <header className="navbar">
            <div className="navbar-left">
                <span>MiloAssistant</span>
            </div>
            <nav className="navbar-right">
                <ul className="nav-links">
                    <li>
                        <FunctionalitiesMenu />
                    </li>
                    <li><Link to="/como-usar-milo">Como usar Milo</Link></li>
                    <li><Link to="/novedades">Novedades</Link></li>
                    {showProfile && (
                        <li className="profile-menu-wrapper">
                            <ProfileMenu />
                        </li>
                    )}
                </ul>
            </nav>
        </header>
    );
}

