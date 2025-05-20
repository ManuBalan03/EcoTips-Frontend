
import React, { useState } from "react";
import DefaultLayout from "../components/layout/Defaultlayout";
import { loginUser } from "../api/services/UserService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../api/AuthContext";

import "./Form.css";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      const response = await loginUser({
        email: loginData.email,
        password: loginData.password
      });
      
      // Ahora usamos el contexto de autenticación
      login(response.user, response.token);
      
      navigate("/Home"); // Asegúrate de que el path sea correcto
    } catch (error) {
      setError("Credenciales incorrectas. Por favor intenta de nuevo.");
      console.error("Error al iniciar sesión:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DefaultLayout>
      <form className="form-container" onSubmit={handleSubmit}>
        <h1>Iniciar sesión</h1>
        
        {error && <div className="error-message">{error}</div>}
        
        <label htmlFor="email">Email</label>
        <input 
          type="email" 
          name="email" 
          id="email" 
          placeholder="Email" 
          required 
          value={loginData.email} 
          onChange={handleChange} 
        />
        
        <label htmlFor="password">Contraseña</label>
        <input 
          type="password" 
          name="password" 
          id="password" 
          placeholder="Contraseña" 
          required 
          value={loginData.password} 
          onChange={handleChange} 
        />
        
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
        </button>
        
        <div className="register-link">
          ¿No tienes una cuenta? <a href="/signup">Regístrate aquí</a>
        </div>
      </form>
    </DefaultLayout>
  );
}

export default Login;