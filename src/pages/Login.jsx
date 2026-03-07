import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, LogIn } from 'lucide-react';

const Login = () => {
  // 1. Definiamo lo stato per i campi del form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // Per ora stampiamo in console, domani collegheremo Firebase qui!
    console.log("Tentativo di login con:", { email, password });
    alert("Dati inviati! Domani li collegheremo al database.");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        
        {/* Intestazione */}
        <div className="text-center mb-10">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogIn className="text-blue-600" size={32} />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Bentornato</h2>
          <p className="text-gray-500 mt-2">Inserisci le tue credenziali per accedere</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          
          {/* Campo Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="esempio@mail.com"
              />
            </div>
          </div>

          {/* Campo Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Bottone Submit */}
          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg active:transform active:scale-[0.98]"
          >
            Accedi
          </button>
        </form>

        {/* Footer del Login */}
        <p className="text-center mt-8 text-sm text-gray-600">
          Non hai un account?{' '}
          <Link to="/" className="text-blue-600 font-bold hover:underline">Registrati</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;