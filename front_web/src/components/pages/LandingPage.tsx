import './LandingPage.css'
// import "../layout/Defaultlayout.css";
import { Link } from "react-router-dom";

import img from "../../assets/img1.png";
import PostCard from '../home/PostCard';

interface DefaultLayoutProps {
  children: React.ReactNode;
}
export const LandingPage = ({children}: DefaultLayoutProps) => {
  return (
    <div>
      <nav className='Navegacion'>
        <div className='Logo'> <img className='logoimg' src={img} width="50" height="80" alt='logo'/><Link to="/" className='TextLogo'>EcoTips</Link></div>
          <ul>
            <li><Link to="/login" className='InicioSesion'>Iniciar Sesión</Link></li>
            <li><Link to="/signup" className='Registro'>Registrarse</Link> </li>
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
      <PostCard userName='Jazmin Dzib' text='Tip de reciclaje: ¡No tires esas botellas de plástico! Puedes transformarlas en lindas macetas para tus plantas. Solo corta la parte superior, haz unos agujeros en la base para el drenaje, decóralas a tu gusto, ¡y listo! Es una forma económica y ecológica de darle vida a tus espacios. ♻️🌼 #Recicla #HazloTúMismo #MacetasSustentables' />
    </div>
    

  );
}

export default LandingPage;
