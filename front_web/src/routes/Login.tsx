import React, { useState } from "react";
import DefaultLayout from "../components/layout/Defaultlayout";
import { loginUser } from "../api/services/UserService";
import { useNavigate } from "react-router-dom";
import "./Form.css";


function Login() {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    nombre:""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await loginUser(loginData);
      localStorage.setItem("token", response.data.token);
      alert("Inicio de sesión exitoso");
      navigate("/"); // o a /dashboard, etc.
    } catch (error) {
      alert("Credenciales incorrectas");
      console.error(error);
    }
  };

  return (
    <DefaultLayout>
      <form className="form-container" onSubmit={handleSubmit}>
        <h1>Iniciar sesión</h1>
        <label htmlFor="email">Email</label>
        <input type="email" name="email" id="email" placeholder="Email" required value={loginData.email} onChange={handleChange} />

        <label htmlFor="nombre">Nombre de Usuario</label>
        <input type="nombre" name="nombre" id="nombre" placeholder="nombre" required value={loginData.nombre} onChange={handleChange}/>

        <label htmlFor="password">Contraseña</label>
        <input type="password" name="password" id="password" placeholder="Contraseña" required value={loginData.password} onChange={handleChange} />

        <button type="submit">Iniciar Sesión</button>
      </form>

      <footer className="footer-container">
        <h4>
          ¿Aún no tienes una cuenta?{" "}
          <a href="/signup" style={{ color: "#45DF88" }}>Registrarse</a>
        </h4>
      </footer>
    </DefaultLayout>
  );
}

export default Login;
