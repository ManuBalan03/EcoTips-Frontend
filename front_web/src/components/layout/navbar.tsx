import './nav.css';
import { Link } from "react-router-dom";
import img from "../../assets/img1.png";
import { FiSearch } from "react-icons/fi";
import { FiMenu } from "react-icons/fi";
import { FiBell } from "react-icons/fi";
import { useState } from 'react';
import SideNarvbar from './SideNarvbar';




interface DefaultLayoutProps {
    children: React.ReactNode;
}

function DefaultLayout({children}: DefaultLayoutProps) {
    const [activeNarvbar, setActiveNarvbar] = useState(false);

  function handleNarvbar() {
    setActiveNarvbar(!activeNarvbar);
  }
    return (
        <>
            <header>
                <nav className="navbar">
                    <div className="logo-container">                      
                        <img className='logoimg' src={img} alt='logo'/> 
                        <span className='TextLogo'><Link to="/" >EcoTips</Link></span>
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
                        <Link to="/notifications" className="notification-icon">
                            <FiBell />
                        </Link>
                        <FiMenu className="menu-icon" onClick={handleNarvbar}/>
                    </div>
                </nav>
            </header>
            {activeNarvbar && <SideNarvbar />}
            <main className="main-page">
                {children}
            </main>
        </>
    );
}

export default DefaultLayout;