import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, UserPlus } from "lucide-react";

// Importiamo la configurazione Firebase
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const Register = () => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // 1. Crea l'account in Firebase Auth
      const res = await createUserWithEmailAndPassword(auth, email, password);

      // 2. Salva i dati aggiuntivi su Firestore usando l'UID dell'utente
      await setDoc(doc(db, "users", res.user.uid), {
        uid: res.user.uid,
        nome: nome,
        email: email,
        giornoDieta: 0,
        createdAt: new Date(),
        avatar: "https://randomuser.me/api/portraits/men/32.jpg", // Avatar default
      });

      alert("Account creato con successo!");
      navigate("/login"); // Torna al Login o vai alla Home
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        alert("Questa email è già registrata! Vai alla pagina di login.");
      } else {
        alert("Errore: " + err.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-10">
          <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus className="text-emerald-600" size={32} />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Crea Account</h2>
          <p className="text-gray-500 mt-2">Inizia oggi il tuo percorso</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Campo Nome */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome Completo
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition"
                placeholder="Matteo Salvaggio"
              />
            </div>
          </div>

          {/* Campo Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition"
                placeholder="esempio@mail.com"
              />
            </div>
          </div>

          {/* Campo Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition"
                placeholder="Almeno 6 caratteri"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition shadow-lg mt-4"
          >
            Registrati
          </button>
        </form>

        <p className="text-center mt-8 text-sm text-gray-600">
          Hai già un account?{" "}
          <Link to="/" className="text-emerald-600 font-bold hover:underline">
            Accedi
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
