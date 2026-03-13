import { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth"; 
import { doc, getDoc, setDoc } from "firebase/firestore";

export const useSpesa = () => {
  const [lista, setLista] = useState([]);
  const [loading, setLoading] = useState(true);

  // Carica i dati
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid, "lista_spesa", "attuale");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) setLista(docSnap.data().elementi || []);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Funzione per salvare
  const salvaLista = async (nuovaLista) => {
    if (!auth.currentUser) return;
    const docRef = doc(db, "users", auth.currentUser.uid, "lista_spesa", "attuale");
    await setDoc(docRef, { elementi: nuovaLista }, { merge: true });
  };

  // Funzione per aggiungere
 const aggiungiProdotto = async (nome) => {
  const nuovo = { nome, preso: false, prezzo: 0, quantita: 1 }; // qta impostata a 1
  const nuovaLista = [...lista, nuovo];
  setLista(nuovaLista);
  await salvaLista(nuovaLista);
};
  // Funzione per eliminare
  const eliminaProdotto = async (index) => {
    const nuovaLista = lista.filter((_, i) => i !== index);
    setLista(nuovaLista);
    await salvaLista(nuovaLista);
  };

// Dentro useSpesa.js, aggiungi questa funzione:

const aggiornaPrezzo = async (index, nuovoPrezzo) => {
  const nuovaLista = [...lista];
  // Convertiamo la stringa dell'input in numero decimale
  nuovaLista[index].prezzo = parseFloat(nuovoPrezzo) || 0;
  
  setLista(nuovaLista);
  await salvaLista(nuovaLista); // Salva su Firestore così non lo perdi
};
const aggiornaQuantita = async (index, nuovaQta) => {
  const nuovaLista = [...lista];
  // Assicuriamoci che la quantità sia almeno 1
  const qtaNumerica = parseInt(nuovaQta) || 1;
  nuovaLista[index].quantita = qtaNumerica > 0 ? qtaNumerica : 1;
  
  setLista(nuovaLista);
  await salvaLista(nuovaLista);
};

// Ricordati di aggiungerla al return in fondo al file:
return { lista, loading, aggiungiProdotto, eliminaProdotto, aggiornaPrezzo ,aggiornaQuantita};
};