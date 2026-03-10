import { useEffect, useState, useRef } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
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
  // Inizializziamo lo stato con gli alimenti che già esistono (se ci sono)
  const [listaAlimenti, setListaAlimenti] = useState(alimentiAttuali);
  const [singoloAlimento, setSingoloAlimento] = useState("");

  const aggiungiAllaLista = () => {
    if (singoloAlimento.trim() !== "") {
      setListaAlimenti([...listaAlimenti, singoloAlimento]);
      setSingoloAlimento(""); // Svuota l'input dopo l'aggiunta
    }
  };

  const rimuoviDallaLista = (index) => {
    const nuovaLista = listaAlimenti.filter((_, i) => i !== index);
    setListaAlimenti(nuovaLista);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-6 animate-in fade-in duration-300"> 
      <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-in zoom-in duration-300 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-black">
          <X size={24} />
        </button>
        
        <h1 className="text-2xl font-black text-gray-800 mb-2">Modifica {pastoSelezionato}</h1>
        <p className="text-gray-500 text-sm mb-6">Aggiungi uno o più alimenti</p>
        
        {/* LISTA DEGLI ALIMENTI CHE STAI AGGIUNGENDO */}
        <div className="max-h-40 overflow-y-auto mb-4 space-y-2 no-scrollbar">
          {listaAlimenti.map((item, index) => (
            <div key={index} className="flex justify-between items-center bg-blue-50 p-3 rounded-xl border border-blue-100 animate-in slide-in-from-right-2">
              <span className="text-sm font-bold text-blue-700">{item}</span>
              <button onClick={() => rimuoviDallaLista(index)} className="text-red-400">
                <X size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* INPUT PER NUOVO ALIMENTO */}
        <div className="flex gap-2 mb-6">
          <input 
            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Es: 150g Pollo"
            value={singoloAlimento}
            onChange={(e) => setSingoloAlimento(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && aggiungiAllaLista()} // Aggiunge con Invio
          />
          <button 
            onClick={aggiungiAllaLista}
            className="bg-blue-600 text-white p-3 rounded-xl shadow-lg shadow-blue-200"
          >
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
  titolo, Icona, coloreIcona, isImpostato, isChecked, onCheck, onTogglePasto, alimenti, onEdit 
}) => {
  return (
    <div className="mt-6 mx-4 bg-white rounded-2xl shadow-[0_0_20px_rgba(0,0,0,0.08)] overflow-hidden border border-gray-50">
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
          <button onClick={onTogglePasto} className="mt-2 text-blue-500 hover:scale-110 transition-transform">
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
  
  // Stati Popup
  const [showPopup, setShowPopup] = useState(false);
  const [pastoDaModificare, setPastoDaModificare] = useState("");

  // Gestione Giorni
  const giorniDellaSettimana = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];
  const oggiJS = new Date().getDay(); 
  const oggiIndex = oggiJS === 0 ? 6 : oggiJS - 1;
  const [giornoSelezionato, setGiornoSelezionato] = useState(oggiIndex);
  const giorniRefs = useRef([]);

  // Stati Pasti
  const [pastiImpostati, setPastiImpostati] = useState({ colazione: true, pranzo: true, spuntino: true, cena: true });
  const [completati, setCompletati] = useState({ colazione: false, pranzo: false, spuntino: false, cena: false });

  const centraGiorno = (index) => {
    setGiornoSelezionato(index);
    if (giorniRefs.current[index]) {
      giorniRefs.current[index].scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  };

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

  useEffect(() => {
    if (!loading) setTimeout(() => centraGiorno(oggiIndex), 200);
  }, [loading]);

  const handleSavePasto = (testo) => {
    console.log(`Salvataggio ${pastoDaModificare}:`, testo);
    setShowPopup(false);
    // Qui aggiungeremo updateDoc(doc(db...)) per salvare su Firebase
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white pb-32">
      
      {/* POPUP RENDER */}
      {showPopup && (
        <SetPasti 
          pastoSelezionato={pastoDaModificare} 
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
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200 scale-105" 
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {giorno}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CARD CALORIE */}
      <div className="mt-8 mx-4 p-6 bg-white rounded-3xl shadow-[0_15px_40px_rgba(0,0,0,0.06)] border border-gray-50">
        <div className="flex justify-between items-end mb-4">
            <div>
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">
                  Piano {giornoSelezionato === oggiIndex ? "Oggi" : giorniDellaSettimana[giornoSelezionato]}
                </p>
                <h2 className="text-3xl font-black text-gray-800">0 <span className="text-sm text-gray-400 font-normal">/ 2000 kcal</span></h2>
            </div>
            <span className="bg-red-50 text-red-500 font-black px-3 py-1 rounded-lg text-xs">0%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
          <div className="bg-blue-500 h-full rounded-full transition-all duration-1000" style={{ width: '10%' }}></div>
        </div>
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-50">
            <Macro label="Carb" color="text-orange-400" value="0g" />
            <Macro label="Prot" color="text-emerald-500" value="0g" />
            <Macro label="Grassi" color="text-blue-500" value="0g" />
        </div>
      </div>

      {/* LISTA PASTI */}
      <div className="mt-4">
        <SezionePasto 
          titolo="Colazione" Icona={Coffee} coloreIcona="text-yellow-500"
          isImpostato={pastiImpostati.colazione} isChecked={completati.colazione}
          onCheck={() => setCompletati({...completati, colazione: !completati.colazione})}
          onEdit={() => { setPastoDaModificare("Colazione"); setShowPopup(true); }}
          alimenti={["150g Albumi", "40g Avena"]}
        />

        <SezionePasto 
          titolo="Pranzo" Icona={ForkKnife} coloreIcona="text-orange-500"
          isImpostato={pastiImpostati.pranzo} isChecked={completati.pranzo}
          onCheck={() => setCompletati({...completati, pranzo: !completati.pranzo})}
          onEdit={() => { setPastoDaModificare("Pranzo"); setShowPopup(true); }}
          alimenti={["100g Riso", "150g Pollo"]}
        />

        <SezionePasto 
          titolo="Spuntino" Icona={NutIcon} coloreIcona="text-amber-600"
          isImpostato={pastiImpostati.spuntino} isChecked={completati.spuntino}
          onCheck={() => setCompletati({...completati, spuntino: !completati.spuntino})}
          onEdit={() => { setPastoDaModificare("Spuntino"); setShowPopup(true); }}
          alimenti={["30g Mandorle", "1 Mela"]}
        />

        <SezionePasto 
          titolo="Cena" Icona={Moon} coloreIcona="text-indigo-500"
          isImpostato={pastiImpostati.cena} isChecked={completati.cena}
          onCheck={() => setCompletati({...completati, cena: !completati.cena})}
          onEdit={() => { setPastoDaModificare("Cena"); setShowPopup(true); }}
          alimenti={["200g Salmone", "Asparagi"]}
        />
      </div>
    </div>
  );
};

const Macro = ({ label, color, value }) => (
  <div className="text-center">
    <p className={`${color} text-[10px] font-black uppercase`}>{label}</p>
    <p className="font-black text-gray-700">{value}</p>
  </div>
);

export default Dieta;