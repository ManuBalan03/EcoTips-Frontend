import './LandingPage.css'
// import "../layout/Defaultlayout.css";
import { Link } from "react-router-dom";

import img from "../../assets/img1.png";
interface DefaultLayoutProps {
  children: React.ReactNode;
}
export const LandingPage = ({children}: DefaultLayoutProps) => {
  return (
    <div>
      <nav className='Navegacion'>
        <div className='Logo'> <img className='logoimg' src={img} alt='logo'/> <a className='TextLogo'> <Link to="/">EcoTips</Link></a></div>
          <ul>
            <li><a className='InicioSesion' href=" " ><Link to="/login">Iniciar Sesión</Link></a></li>
            <li><a className='Registro' href=" "><Link to="/signup">Registrarse</Link> </a></li>
          </ul>
      </nav>
      <main> {children} </main>
      <section>
        <div className='Contenido'>
          <div className='Texto'>
            <p>
            EcoTips es una innovadora <span> plataforma de reciclaje inteligente </span>  diseñada para fomentar la 
            conciencia ambiental y el compromiso con el cuidado del planeta. Su principal objetivo es brindar a los usuarios un 
            espacio interactivo donde puedan compartir, consultar y acceder fácilmente a información práctica y confiable sobre reciclaje.
            </p>

            <p>
            A través de esta plataforma, se busca promover hábitos sostenibles en la vida diaria, educando sobre la correcta clasificación de residuos, 
            el aprovechamiento de materiales reciclables y la reducción del impacto ambiental. Además, EcoTips permite a la comunidad contribuir con consejos, 
            experiencias y buenas prácticas, creando así una red colaborativa de aprendizaje y acción ecológica.
            </p>      
            <button className='Empieza-ahora'> Empieza ahora</button> 
          </div>
          <div className='ImagenLP'><img src={img} alt='imagen'/> </div>
        </div>
      </section>
    </div>
    

  );
}

export default LandingPage;
