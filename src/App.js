import { useContext, useEffect } from 'react';
import './App.css';
import SantaForm from './components/SantaForm';
import { GlobalContext } from './contexts/GlobalContext';

function App() {  
  const ctx = useContext(GlobalContext);

  useEffect(() => {
    const emailInterval = setInterval(sendEmail, 15000);

    return () => clearInterval(emailInterval);
  });

  const sendEmail = async () => {
    const payload = ctx.children;
    console.log(payload);
    
    await fetch('http://localhost:8080/sendEmail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log(data);
    })
    .catch(error => {
      console.error('Error:', error);
    });

    console.log("Email sent");
    ctx.setChildren([]);

  }

  return (
      <div className="App">
        <SantaForm />
      </div>
  );
}

export default App;
