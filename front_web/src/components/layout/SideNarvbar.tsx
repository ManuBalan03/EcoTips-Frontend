
import { Link } from 'react-router-dom';
import '../layout/SideNarvbar.css'
import LogoutLink from '../common/Buttons/LogoutButton';

const SideNarvbar = () => {
  return (
    <div className="narvbar-lateral">
      <ul className='actions-user'>
        <li>
          <Link to="/perfil" className="ruta">Perfil</Link>
        </li>
        <li>
          <Link to="/notificaciones" className="ruta">Notificaciones</Link>
        </li>
        <li>
          <Link to="/map" className="ruta">Centros de reciclaje</Link>
        </li>
        
      </ul>


      <ul>
        <li><LogoutLink variant="text" /></li>
      </ul>
    </div>
  )
}

export default SideNarvbar