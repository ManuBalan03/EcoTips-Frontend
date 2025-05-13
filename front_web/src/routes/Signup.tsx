import DefaultLayout from "../components/layout/Defaultlayout";

function Signup(){
    return(
        <DefaultLayout>
            <form className="form-container">
            <h1>Registrasrse</h1>
            <label htmlFor="email">Email</label>
            <input type="email" name="email" id="email" placeholder="Email" required/>

            <label htmlFor="nombre">Nombre de Usuario</label>
            <input type="nombre" name="nombre" id="nombre" placeholder="nombre" required/>

            <label htmlFor="password">Contraseña</label>
            <input type="password" name="password" id="password" placeholder="Contraseña" required/>
            <button>Iniciar Sesión</button>
        </form>
        
        </DefaultLayout>
    )
}
export default Signup;