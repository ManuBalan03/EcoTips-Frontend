
import { Link } from 'react-router-dom';
import '../layout/SideNarvbar.css'
import LogoutButton from '../common/Buttons/LogoutButton';

const SideNarvbar = () => {
  return (
    <div className="narvbar-lateral">
      <ul>
          <li>
              <LogoutButton variant="text" />
          </li>
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
    </div>
  )
}

export default SideNarvbar