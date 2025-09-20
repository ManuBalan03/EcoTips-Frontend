import React, { useState } from "react";
import DefaultLayout from "../components/layout/Defaultlayout";
import { registerUser } from "../api/services/UserService";
import { useNavigate } from "react-router-dom";
import "./Form.css";
import { Link } from "react-router-dom";

<Link to="/signup">Regístrate aquí</Link>

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    nombre: "",
    contraseña: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null); // Limpiar errores al editar
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      await registerUser(formData);
      alert("Usuario registrado exitosamente");
      navigate("/login");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Ocurrió un error inesperado");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DefaultLayout>
      <form className="form-container" onSubmit={handleSubmit}>
        <h1>Registrarse</h1>
        
        {error && <div className="error-message">{error}</div>}
        
        <label htmlFor="email">Email</label>
        <input 
          type="email" 
          name="email" 
          id="email" 
          placeholder="Email" 
          required 
          value={formData.email} 
          onChange={handleChange} 
        />

        <label htmlFor="nombre">Nombre de Usuario</label>
        <input 
          type="text" 
          name="nombre" 
          id="nombre" 
          placeholder="Nombre" 
          required 
          value={formData.nombre} 
          onChange={handleChange} 
        />

        <label htmlFor="contraseña">Contraseña</label>
        <input 
          type="password" 
          name="contraseña" 
          id="contraseña" 
          placeholder="Contraseña" 
          required 
          value={formData.contraseña} 
          onChange={handleChange} 
          minLength={6}
        />

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Registrando..." : "Registrarse"}
        </button>
      </form>
    </DefaultLayout>
  );
}

export default Signup;