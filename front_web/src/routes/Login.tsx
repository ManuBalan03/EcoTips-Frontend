import DefaultLayout from "../components/layout/Defaultlayout";
import "./Form.css";

function Login(){
    return(
        <DefaultLayout>

            <form className="form-container">
                <h1>Iniciar sesión</h1>
                <label htmlFor="email">Email</label>
                <input type="email" name="email" id="email" placeholder="Email" required />

                <label htmlFor="nombre">Nombre de Usuario</label>
                <input type="nombre" name="nombre" id="nombre" placeholder="nombre" required />

                <label htmlFor="password">Contraseña</label>
                <input type="password" name="password" id="password" placeholder="Contraseña" required />
                <button>Iniciar Sesión</button>
            </form><footer className="footer-container">
                <h4>¿Aún no tienes una cuenta? <a href="/signup" style={{ color: '#45DF88' }}>Registrarse</a></h4>
                
            </footer>
         </DefaultLayout>
    )
}

export default Login;