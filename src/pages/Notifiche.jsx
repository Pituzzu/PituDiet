import { useState, useEffect } from "react";
import { auth, db, messaging } from "../firebase"; // Assicurati che messaging sia esportato da firebase.js
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { getToken } from "firebase/messaging";
import { 
  Bell, 
  BellOff, 
  ShieldCheck, 
  Send, 
  ChevronRight,
  Settings,
  AlertCircle
} from "lucide-react";

const Notifiche = () => {
  const [permesso, setPermesso] = useState(Notification.permission);
  const [loading, setLoading] = useState(false);
  const [preferenze, setPreferenze] = useState({
    colazione: true,
    pranzo: true,
    spuntino: true,
    cena: true,
  });

  // 1. Funzione per attivare le notifiche e ottenere il Token FCM
  const attivaNotifiche = async () => {
    setLoading(true);
    try {
      const status = await Notification.requestPermission();
      setPermesso(status);

      if (status === "granted") {
        // Genera il Token FCM
        const token = await getToken(messaging, { 
          vapidKey: "INSERISCI_QUI_LA_TUA_VAPID_KEY_LUNGHISSIMA" 
        });

        if (token && auth.currentUser) {
          // Salva il token su Firestore nel profilo utente
          const userRef = doc(db, "users", auth.currentUser.uid);
          await updateDoc(userRef, { 
            fcmToken: token,
            notificheAttive: true 
          });
          console.log("Token FCM generato e salvato:", token);
        }
      } else {
        alert("Per ricevere i promemoria devi autorizzare le notifiche dal browser.");
      }
    } catch (error) {
      console.error("Errore durante l'attivazione:", error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Toggle per le preferenze dei singoli pasti
  const togglePreferenza = async (pasto) => {
    const nuovePreferenze = { ...preferenze, [pasto]: !preferenze[pasto] };
    setPreferenze(nuovePreferenze);

    if (auth.currentUser) {
      try {
        const userRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(userRef, { notifichePasti: nuovePreferenze });
      } catch (e) {
        console.error("Errore salvataggio preferenze:", e);
      }
    }
  };

  return (
    <div className="min-h-screen bg-white pb-32">
      {/* HEADER */}
      <div className="p-6 pt-10">
        <h1 className="text-3xl font-black text-gray-800 tracking-tight">Notifiche</h1>
        <p className="text-gray-500 mt-1 font-medium">Gestisci i tuoi promemoria</p>
      </div>

      <div className="px-4 space-y-6">
        
        {/* CARD STATO PERMESSO */}
        <div className={`p-6 rounded-3xl border transition-all duration-500 ${
          permesso === 'granted' 
          ? 'bg-emerald-50 border-emerald-100' 
          : 'bg-amber-50 border-amber-100'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl ${permesso === 'granted' ? 'bg-white text-emerald-500' : 'bg-white text-amber-500'} shadow-sm`}>
                {permesso === 'granted' ? <ShieldCheck size={24} /> : <BellOff size={24} />}
              </div>
              <div>
                <p className="font-bold text-gray-800">
                  {permesso === 'granted' ? 'Notifiche Attive' : 'Notifiche Disattivate'}
                </p>
                <p className="text-xs text-gray-500 font-medium">
                  {permesso === 'granted' ? 'Riceverai avvisi per i tuoi pasti' : 'L\'app non può inviarti avvisi'}
                </p>
              </div>
            </div>
            {permesso !== 'granted' && (
              <button 
                onClick={attivaNotifiche}
                disabled={loading}
                className="bg-amber-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-amber-200 active:scale-95 transition-transform"
              >
                {loading ? '...' : 'Attiva'}
              </button>
            )}
          </div>
        </div>

        {/* SEZIONE IMPOSTAZIONI PASTI */}
        <div className="bg-white rounded-3xl shadow-[0_0_25px_rgba(0,0,0,0.05)] border border-gray-50 overflow-hidden">
          <div className="p-5 border-b border-gray-50 flex items-center gap-2">
            <Settings size={18} className="text-gray-400" />
            <h2 className="font-black text-gray-400 uppercase text-[10px] tracking-widest">Promemoria Pasti</h2>
          </div>

          <div className="divide-y divide-gray-50">
            {Object.keys(preferenze).map((pasto) => (
              <div key={pasto} className="flex items-center justify-between p-5 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${preferenze[pasto] ? 'bg-blue-50 text-blue-500' : 'bg-gray-100 text-gray-300'}`}>
                    <Bell size={20} />
                  </div>
                  <span className="font-bold text-gray-700 capitalize">{pasto}</span>
                </div>
                
                {/* TOGGLE SWITCH */}
                <button 
                  onClick={() => togglePreferenza(pasto)}
                  className={`w-14 h-7 rounded-full transition-all duration-300 relative p-1 ${
                    preferenze[pasto] ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-all duration-300 ${
                    preferenze[pasto] ? 'translate-x-7' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* INFO EXTRA */}
        <div className="flex gap-3 p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
          <AlertCircle className="text-blue-500 shrink-0" size={20} />
          <p className="text-xs text-blue-700 font-medium leading-relaxed">
            Le notifiche push ti aiuteranno a rispettare gli orari della tua dieta. 
            Assicurati di non aver silenziato il browser nelle impostazioni del telefono.
          </p>
        </div>

        {/* TASTO TEST (Opzionale) */}
        <button 
          className="w-full bg-gray-900 text-white p-4 rounded-2xl flex items-center justify-center gap-3 font-bold shadow-xl shadow-gray-200 active:scale-95 transition-transform"
          onClick={() => alert("Funzione di test: Invierà un segnale a Firebase Cloud Functions!")}
        >
          <Send size={20} />
          Test Notifica Immediata
        </button>
      </div>
    </div>
  );
};

export default Notifiche;