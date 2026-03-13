import { useEffect, useState, useRef } from "react";
import { auth, db } from "../firebase";
// 1. Sposta onAuthStateChanged qui (sotto auth)
import { onAuthStateChanged } from "firebase/auth"; 
// 2. Lascia solo le funzioni del database qui
import { doc, getDoc, setDoc } from "firebase/firestore"; 
import {
  Coffee,
  NutIcon,
  Moon,
  Pencil,
  CheckCircle,
  Circle,
  PlusCircle,
  ForkKnife,
  X
} from "lucide-react";

// --- 1. COMPONENTE POPUP (MODALE) ---
const SetPasti = ({ onClose, pastoSelezionato, onSave, alimentiAttuali = [] }) => {
  const [listaAlimenti, setListaAlimenti] = useState(alimentiAttuali);
  const [singoloAlimento, setSingoloAlimento] = useState("");

  const aggiungiAllaLista = () => {
    if (singoloAlimento.trim() !== "") {
      setListaAlimenti([...listaAlimenti, singoloAlimento]);
      setSingoloAlimento("");
    }
  };

  const rimuoviDallaLista = (index) => {
    setListaAlimenti(listaAlimenti.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-6 animate-in fade-in duration-300"> 
      <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-in zoom-in duration-300 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-black">
          <X size={24} />
        </button>
        
        <h1 className="text-2xl font-black text-gray-800 mb-2">Modifica {pastoSelezionato}</h1>
        <p className="text-gray-500 text-sm mb-6">Aggiungi uno o più alimenti</p>
        
        <div className="max-h-40 overflow-y-auto mb-4 space-y-2 no-scrollbar">
          {listaAlimenti.map((item, index) => (
            <div key={index} className="flex justify-between items-center bg-blue-50 p-3 rounded-xl border border-blue-100">
              <span className="text-sm font-bold text-blue-700">{item}</span>
              <button onClick={() => rimuoviDallaLista(index)} className="text-red-400">
                <X size={16} />
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mb-6">
          <input 
            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Es: 150g Pollo"
            value={singoloAlimento}
            onChange={(e) => setSingoloAlimento(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && aggiungiAllaLista()}
          />
          <button onClick={aggiungiAllaLista} className="bg-blue-600 text-white p-3 rounded-xl">
            <PlusCircle size={24} />
          </button>
        </div>

        <button 
          onClick={() => onSave(listaAlimenti)}
          className="w-full bg-gray-900 text-white font-bold py-4 rounded-2xl shadow-xl active:scale-95 transition-transform"
        >
          Salva Pasto Completo
        </button>
      </div>
    </div>
  );
};

// --- 2. COMPONENTE SEZIONE PASTO ---
const SezionePasto = ({ 
  titolo, Icona, coloreIcona, isImpostato, isChecked, onCheck, alimenti = [], onEdit 
}) => {
  return (
    <div className="mt-6 mx-4 bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-50">
      {isImpostato ? (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="flex justify-between p-4 items-center border-b border-gray-50">
            <div className="flex items-center">
              <Icona className={coloreIcona} size={26} />
              <h1 className="ml-3 text-lg font-black text-gray-800 uppercase tracking-tight">{titolo}</h1>
              <Pencil 
                className="text-gray-300 ml-3 cursor-pointer hover:text-blue-500 transition-colors" 
                size={18} 
                onClick={onEdit} 
              />
            </div>
            <div className="cursor-pointer" onClick={onCheck}>
              {isChecked ? <CheckCircle className="text-green-500" size={28} /> : <Circle className="text-gray-300" size={28} />}
            </div>
          </div>
          <div className="px-4 py-4 bg-gray-50/30">
            <ul className="space-y-2">
              {alimenti.map((alimento, index) => (
                <li key={index} className="flex items-center text-gray-600 text-sm font-medium">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></span>
                  {alimento}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center bg-gray-50/30">
          <div className="flex items-center justify-center mb-2 opacity-30">
            <Icona className={coloreIcona} size={30} />
            <h1 className="ml-2 text-xl font-bold uppercase">{titolo}</h1>
          </div>
          <button onClick={onEdit} className="mt-2 text-blue-500 hover:scale-110 transition-transform">
            <PlusCircle size={36} />
          </button>
        </div>
      )}
    </div>
  );
};

// --- 3. COMPONENTE PRINCIPALE ---
const Dieta = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pastiDelGiorno, setPastiDelGiorno] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [pastoDaModificare, setPastoDaModificare] = useState("");

  const giorniDellaSettimana = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];
  const oggiJS = new Date().getDay(); 
  const oggiIndex = oggiJS === 0 ? 6 : oggiJS - 1;
  const [giornoSelezionato, setGiornoSelezionato] = useState(oggiIndex);
  const giorniRefs = useRef([]);

  const centraGiorno = (index) => {
    setGiornoSelezionato(index);
    if (giorniRefs.current[index]) {
      giorniRefs.current[index].scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  };

  // Caricamento utente
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) setUserData(docSnap.data());
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Caricamento pasti ogni volta che cambia il giorno o l'utente
  useEffect(() => {
    const fetchPasti = async () => {
      if (!auth.currentUser) return;
      const nomeGiorno = giorniDellaSettimana[giornoSelezionato];
      const docRef = doc(db, "users", auth.currentUser.uid, "piano_settimanale", nomeGiorno);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setPastiDelGiorno(docSnap.data());
      } else {
        setPastiDelGiorno({}); 
      }
    };
    if (!loading) fetchPasti();
  }, [giornoSelezionato, loading]);

  useEffect(() => {
    if (!loading) setTimeout(() => centraGiorno(oggiIndex), 200);
  }, [loading]);

  const handleSavePasto = async (listaAlimenti) => {
    if (!auth.currentUser) return;
    const nomeGiorno = giorniDellaSettimana[giornoSelezionato];
    const campoPasto = pastoDaModificare.toLowerCase();
    const docRef = doc(db, "users", auth.currentUser.uid, "piano_settimanale", nomeGiorno);

    try {
      await setDoc(docRef, {
        [campoPasto]: listaAlimenti,
        [`${campoPasto}Check`]: false, // Resetta la spunta se modifichi il pasto
        ultimoAggiornamento: new Date()
      }, { merge: true });

      setPastiDelGiorno(prev => ({ ...prev, [campoPasto]: listaAlimenti }));
      setShowPopup(false);
    } catch (err) {
      console.error("Errore salvataggio:", err);
    }
  };

  const handleCheck = async (pastoId) => {
    if (!auth.currentUser) return;
    const nomeGiorno = giorniDellaSettimana[giornoSelezionato];
    const campoCheck = `${pastoId.toLowerCase()}Check`;
    const nuovoStato = !pastiDelGiorno[campoCheck];

    const docRef = doc(db, "users", auth.currentUser.uid, "piano_settimanale", nomeGiorno);
    
    try {
      await setDoc(docRef, { [campoCheck]: nuovoStato }, { merge: true });
      setPastiDelGiorno(prev => ({ ...prev, [campoCheck]: nuovoStato }));
    } catch (err) {
      console.error("Errore update check:", err);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white pb-32">
      {showPopup && (
        <SetPasti 
          pastoSelezionato={pastoDaModificare} 
          alimentiAttuali={pastiDelGiorno[pastoDaModificare.toLowerCase()] || []}
          onClose={() => setShowPopup(false)} 
          onSave={handleSavePasto}
        />
      )}

      {/* HEADER GIORNI */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md pb-4 w-full border-b border-gray-50 shadow-sm">
        <div className="flex items-center flex-col pt-6">
          <h1 className="text-xl font-black text-gray-800">
            Dieta di <span className="text-blue-600">{userData?.nome || "Matteo"}</span>
          </h1>
          <div className="overflow-x-auto mt-6 w-full px-4 flex gap-4 no-scrollbar">
            {giorniDellaSettimana.map((giorno, index) => (
              <button
                key={giorno}
                ref={(el) => (giorniRefs.current[index] = el)}
                onClick={() => centraGiorno(index)}
                className={`flex-shrink-0 px-6 py-2 rounded-2xl text-sm font-bold transition-all duration-300 ${
                  giornoSelezionato === index 
                    ? "bg-blue-600 text-white shadow-lg" 
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {giorno}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* LISTA PASTI */}
      <div className="mt-4">
        {[
          { id: "Colazione", icon: Coffee, color: "text-yellow-500" },
          { id: "Pranzo", icon: ForkKnife, color: "text-orange-500" },
          { id: "Spuntino", icon: NutIcon, color: "text-amber-600" },
          { id: "Cena", icon: Moon, color: "text-indigo-500" }
        ].map((p) => (
          <SezionePasto 
            key={p.id}
            titolo={p.id} Icona={p.icon} coloreIcona={p.color}
            isImpostato={pastiDelGiorno[p.id.toLowerCase()]?.length > 0} 
            isChecked={pastiDelGiorno[`${p.id.toLowerCase()}Check`] || false}
            onCheck={() => handleCheck(p.id)}
            onEdit={() => { setPastoDaModificare(p.id); setShowPopup(true); }}
            alimenti={pastiDelGiorno[p.id.toLowerCase()] || []}
          />
        ))}
      </div>
    </div>
  );
};

export default Dieta;