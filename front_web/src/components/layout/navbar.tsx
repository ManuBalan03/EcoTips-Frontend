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
                    <div className="logo-container">
                        <span className="logo-text"><a className='TextLogo'> <Link to="/"><img className='logoimg' src={img} alt='logo'/></Link></a></span>
                    </div>
                    <div className="search-container">
                        <div className="search-bar">
                            <FiSearch className="search-icon" />
                            <input 
                                type="text" 
                                placeholder="Busqueda..." 
                                className="search-input"
                            />
                        </div>
                    </div>
                    <div className="menu-container">
                        <FiMenu className="menu-icon" />
                    </div>
                </nav>
            </header>

            <main className="main-page">
                {children}
            </main>
        </>
    );
}

export default DefaultLayout;