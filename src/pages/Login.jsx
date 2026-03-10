import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Aggiunto useNavigate per spostarti dopo il login
import { Mail, Lock, LogIn } from 'lucide-react';

// --- AGGIUNGI QUESTI IMPORT ---
import { auth, db } from '../firebase'; 
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
// ------------------------------

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Serve per mandare l'utente alla Home dopo il login

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // 1. Accedi con email e password
      const res = await signInWithEmailAndPassword(auth, email, password);
      
      // 2. Opzionale: Recupera i dati dal database per vedere se l'utente esiste
      const userDoc = await getDoc(doc(db, "users", res.user.uid));
      
      if (userDoc.exists()) {
        console.log("Dati utente:", userDoc.data());
        alert("Bentornato " + userDoc.data().nome);
        navigate("/"); // Dopo il login, vai alla Home
      }

    } catch (err) {
      console.error("Errore Login:", err.message);
      alert("Email o Password errati!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        
        <div className="text-center mb-10">
          <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogIn className="text-blue-600" size={32} />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Bentornato</h2>
          <p className="text-gray-500 mt-2">Inserisci le tue credenziali per accedere</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="esempio@mail.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg active:scale-[0.98]"
          >
            Accedi
          </button>
        </form>

        <p className="text-center mt-8 text-sm text-gray-600">
          Non hai un account?{' '}
          <Link to="/register" className="text-blue-600 font-bold hover:underline">Registrati</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;