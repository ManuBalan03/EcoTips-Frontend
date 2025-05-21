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
                 <div className='Logo'>  <a className='TextLogo'> <Link to="/"><img className='logoimg' src={img} alt='logo'/> </Link></a></div>
                    <ul>
                        <li> <a className='InicioSesion' href="" ><Link to="/login">Iniciar sesión</Link></a> </li>
                        <li><a className='Registro' href=" "><Link to="/signup">Registrarse</Link></a></li>
                    </ul>
                </nav>
            </header>
            <main> {children} </main>
            </>

    );
}
export default DefaultLayout;