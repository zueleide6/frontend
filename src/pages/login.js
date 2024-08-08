import { useState } from 'react';
import { useAuth } from '../lib/AuthContext';
import '../lib/globals.css'; // Certifique-se de importar o arquivo CSS global

export default function Login() {
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const auth = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await auth.login(login, senha);
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="glass-container">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Login</label>
          <input
            type="text"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
          />
        </div>
        <div>
          <label>Senha</label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
