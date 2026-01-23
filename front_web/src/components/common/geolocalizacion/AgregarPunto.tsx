
import '../geolocalizacion/AgregaPunto.css';

type Props = {
  mostrarForm: (value: boolean) => void;
};
const AgregarPunto= ({mostrarForm}: Props) => {
  

  const handClick = () =>{
  mostrarForm(true);

  }
  
  return (
    <div className='agregar-conteiner'>
      <h3>Ayúdanos a mejorar el mapa: comparte un centro de reciclaje que conozcas.
      </h3>     
      <button className='agregar' onClick={handClick} > Agregar </button>
    </div>
  );
};


export default AgregarPunto