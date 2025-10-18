import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import '../geolocalizacion/FormularioAgregar.css'
import { IoMdCloseCircleOutline } from "react-icons/io";
import { PuntoVerdeDTO } from '../../../api/types/CordenadasType';
import { data, FormEncType, useNavigate } from 'react-router-dom';
import { postPuntoVerde } from '../../../api/services/UserServices/PuntosVerdeService';

type Props = {
  ocultarForm: (value: boolean) => void;
};

const FormularioAgregar = ({ocultarForm}: Props) => {
  const navigate = useNavigate();

  const [data, setData] = useState<PuntoVerdeDTO>({
    nombre: "",
    descripcion: "",
    latitud: 0,
    longitud: 0,
    direccion: "",
    tipo_residuo: "",
    imagen_url: ""
  })
 
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const {name,value } = e.target;
    if (name === "latitud" || name === "longitud") {
      if (value === "" || /^-?\d*\.?\d*$/.test(value)) {
      setData({ ...data, [name]: value });
    }
  } else {
    setData({ ...data, [name]: value });
  }
  }

  const handleSubmmit = async(e :  FormEvent) =>{
    e.preventDefault();

    console.log('form data subnited: ', data)

    try{
      await postPuntoVerde(data);
      ocultarForm(false); 
      navigate(0);
    }catch(e){
      console.error("Error al enviar los datos:", e);
    }

  }
  
  return (
    <div className="contenedor-formulario">
      <div className='forumulario-card'>
        <div className='boton de cierre'> 
        <IoMdCloseCircleOutline  className = 'button-cierre' onClick={() => ocultarForm(false)}/>
        </div>
        <div className='formulario'>
          <form onSubmit={handleSubmmit}>
            <label > Nombre del centro de reciclaje: </label>
            <input type="text" placeholder="Nombre" name='nombre' value={data.nombre} onChange={handleChange} required/>
            <label >  Descripcion: </label>
            <input type="text" placeholder="Descripcion" name='descripcion' value={data.descripcion} onChange={handleChange} required/>
            <label >  Direccion: </label>
            <input type="text" placeholder="Direccion" name='direccion' value={data.direccion} onChange={handleChange} required/>
            <label >  Latitud: </label>
            <input type="number" placeholder="Latitud" name='latitud' value={data.latitud} onChange={handleChange} required/>
            <label >  Longitud: </label>
            <input type="number" placeholder="Longitud" name='longitud' value={data.longitud} onChange={handleChange} required/>
            <label >  Categoria: </label>
            <select className='categorias' name='tipo_residuo' value={data.tipo_residuo} onChange={handleChange} required>
              <option value={""} >Selecciona</option>
              <option value={"PAPEL"} >Papel o Cartón</option>
              <option value={"VIDRIO"}>Vidrio</option>
              <option value={"PLASTICO"}>Plastico</option>
              <option value={"ORGANICO"}>Organico</option>
              <option value={"PELIGROSO"}>Peligroso</option>
              <option value={"ELECTRONICO"}>Electronico</option>
            </select>
            <label >  Imagen: </label>
            <input type="text" placeholder="Introduce la url de la imagen"  name='imagen_url' value={data.imagen_url} onChange={handleChange} required/>
            <button type="submit">Enviar</button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default FormularioAgregar;
