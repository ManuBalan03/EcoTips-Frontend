
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
    
    login(response.user, response.token);
    navigate("/Home");
  } catch (error: any) {
    // Mensaje más específico basado en el tipo de error
    if (error.message.includes('Credenciales inválidas')) {
      setError("Email o contraseña incorrectos");
    } else if (error.message.includes('Usuario no encontrado')) {
      setError("No existe una cuenta con este email");
    } else {
      setError("Error de conexión. Inténtalo más tarde");
    }
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