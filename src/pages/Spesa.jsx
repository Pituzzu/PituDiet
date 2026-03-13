import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, Trash2, Plus } from 'lucide-react'; // Aggiunta Trash2 e Plus
import { auth, db } from '../firebase';
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useSpesa } from "../hooks/useSpesa";

const Spesa = () => {
    const [userData, setUserData] = useState(null);
    const [userLoading, setUserLoading] = useState(true); // Rinominata per non fare conflitto
    const [testoInput, setTestoInput] = useState("");

    // Rinominiamo loading dell'hook in spesaLoading
    const { lista, loading: spesaLoading, aggiungiProdotto, eliminaProdotto,aggiornaPrezzo ,aggiornaQuantita} = useSpesa();
    const navigate = useNavigate();

    const handleInvio = () => {
        if (testoInput.trim() !== "") {
            aggiungiProdotto(testoInput);
            setTestoInput("");
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const docRef = doc(db, "users", user.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setUserData(docSnap.data());
                    }
                } catch (error) {
                    console.error("Errore nel recupero dati:", error);
                }
            } else {
                navigate("/login");
            }
            setUserLoading(false);
        });
        return () => unsubscribe();
    }, [navigate]);

    // Se uno dei due caricamenti è attivo, mostra il loading
    if (userLoading || spesaLoading) return <div className="p-10 text-center">Caricamento...</div>;
const totale = lista.reduce((acc, item) => {
  const p = parseFloat(item.prezzo) || 0;
  const q = parseInt(item.quantita) || 1;
  return acc + (p * q);
}, 0);
    return (
        <div className="min-h-screen bg-white">
            {/* HEADER FISSO */}
            <div className='fixed left-0 top-0 flex flex-col justify-center w-full bg-amber-400 z-50 p-4 shadow-md'>
                <h1 className='font-bold text-2xl mt-6 px-2 uppercase'>Lista della Spesa</h1>
                <div className='mt-4 flex gap-2'>
                    <input
                        type="text"
                        placeholder='Cosa serve comprare?'
                        className='w-full border-none rounded-2xl p-3 outline-none shadow-inner'
                        value={testoInput}
                        onChange={(e) => setTestoInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleInvio()}
                    />
                    <button
                        onClick={handleInvio}
                        className='bg-red-500 text-white p-3 rounded-xl shadow-lg active:scale-90 transition-transform'
                    >
                        <Plus size={24} />
                    </button>
                </div>
            </div>

            {/* CONTENUTO LISTA (Fuori dall'header fixed) */}
            <div className='mt-52 px-6 pb-40'>
                <h2 className="text-amber-600 font-black text-xs tracking-widest uppercase mb-4">I tuoi prodotti:</h2>

                {lista.length === 0 ? (
                    <p className="text-gray-300 italic">Nessun prodotto in lista...</p>
                ) : (
                    lista.map((item, index) => (
                        <div key={index} className="flex justify-between items-center p-4 bg-gray-50 mb-3 rounded-2xl border border-gray-100">
  <div className="flex flex-col">
    <span className="font-bold text-gray-700">{item.nome}</span>
  </div>
  
  <div className="flex items-center gap-3">
    {/* Campo Quantità */}
    <div className="flex items-center bg-white border border-gray-200 rounded-lg overflow-hidden">
      <input 
        type="number" 
        className="w-12 p-1 text-center font-bold text-gray-600 outline-none"
        value={item.quantita || 1} 
        onChange={(e) => aggiornaQuantita(index, e.target.value)}
      />
      </div>

    {/* Campo Prezzo */}
    <div className="flex items-center gap-1">
      <span className="text-amber-600 font-bold">€</span>
      <input 
        type="number" 
        className="w-20 bg-white border border-gray-200 rounded-lg p-1 text-right font-bold text-amber-600 outline-none"
        value={item.prezzo || ""} 
        onChange={(e) => aggiornaPrezzo(index, e.target.value)}
      />
    </div>

    <button onClick={() => eliminaProdotto(index)} className="text-red-300">
      <Trash2 size={20}/>
    </button>
  </div>
</div>
                    ))
                )}
            </div>

            {/* FOOTER FISSO */}
            <div className='fixed left-0 bottom-0 mb-20 p-4 w-full z-50'>
                <div className='bg-amber-600 text-white rounded-3xl shadow-2xl p-6'>
                    <div className='flex justify-between items-center'>
                        <div>
                            <h2 className="text-xs font-bold opacity-80 uppercase tracking-tighter">Totale Stimato</h2>
                            <h1 className='text-3xl font-black'>€ {totale.toFixed(2)}</h1>
                        </div>
                        <div className="bg-amber-500 p-3 rounded-2xl">
                            <Wallet size={32} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Spesa;