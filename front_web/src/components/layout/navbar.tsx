import './nav.css';
import { Link } from "react-router-dom";
import img from "../../assets/img1.png";
import { FiSearch } from "react-icons/fi";
import { FiMenu } from "react-icons/fi";

interface DefaultLayoutProps {
    children: React.ReactNode;
}

function DefaultLayout({children}: DefaultLayoutProps) {
    return (
        <>
            <header>
                <nav className="navbar">
                  <div className='Logo'> <img className='logoimg' src={img} alt='logo'/> <a className='TextLogo'> <Link to="/"> </Link></a></div>
                  <div className="search-bar">
                    <FiSearch className="search-icon" />
                    <input type="text" placeholder="Busqueda..." />
                  </div>
                  <div>
                    <FiMenu className="menu-icon" />
                  </div>
                </nav>
            </header>

            <main> {children} </main>
            </>

    );
}
export default DefaultLayout;