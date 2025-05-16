// Componente "App.tsx"
import React from 'react';
import Saludo from '../src/components/users/examplelistusers'; // Importamos el componente Saludo
import LandingPage from './components/pages/LandingPage';


const App: React.FC = () => {
  return (
    <div>
       
      <h2>Este es el componente App</h2> 

      <Saludo /> {/* Aquí usamos el componente Saludo */}
    </div>

  );
}

export default App;

