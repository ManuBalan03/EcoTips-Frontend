import '../pages/LandingPage.css';
import { Link } from "react-router-dom";
import img from "../../assets/img1.png";

interface DefaultLayoutProps {
    children: React.ReactNode;
}

function DefaultLayout({children}: DefaultLayoutProps) {
    return (
        <>
            <header>
                <nav className='Navegacion'>
                    <div className='Logo'>
                        {/* CORREGIDO: Solo usar Link */}
                        <Link to="/" className='TextLogo'>
                            <img className='logoimg' src={img} alt='logo'/>
                        </Link>
                    </div>
                    <ul>
                        {/* CORREGIDO: Solo usar Link con className */}
                        <li>
                            <Link to="/login" className='InicioSesion'>
                                Iniciar sesión
                            </Link>
                        </li>
                        <li>
                            <Link to="/signup" className='Registro'>
                                Registrarse
                            </Link>
                        </li>
                    </ul>
                </nav>
            </header>
            <main>{children}</main>
        </>
    );
}

export default DefaultLayout;