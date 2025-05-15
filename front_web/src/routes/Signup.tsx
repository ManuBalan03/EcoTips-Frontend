import React, { useState } from "react";
import DefaultLayout from "../components/layout/Defaultlayout";
import { registerUser } from "../api/services/UserService";
import { useNavigate } from "react-router-dom";
import "./Form.css";


function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    nombre: "",
    contraseña: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerUser(formData);
      alert("Usuario registrado exitosamente");
      navigate("/login");
    } catch (error) {
      alert("Error al registrar");
      console.error(error);
    }
  };

  return (
    <DefaultLayout>
      <form className="form-container" onSubmit={handleSubmit}>
        <h1>Registrarse</h1>
        <label htmlFor="email">Email</label>
        <input type="email" name="email" id="email" placeholder="Email" required value={formData.email} onChange={handleChange} />

        <label htmlFor="nombre">Nombre de Usuario</label>
        <input type="text" name="nombre" id="nombre" placeholder="Nombre" required value={formData.nombre} onChange={handleChange} />

        <label htmlFor="contraseña">Contraseña</label>
        <input type="password" name="contraseña" id="contraseña" placeholder="Contraseña" required value={formData.contraseña} onChange={handleChange} />

        <button type="submit">Registrarse</button>
      </form>
    </DefaultLayout>
  );
}

export default Signup;
