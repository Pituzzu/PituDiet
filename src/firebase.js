import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import { getMessaging, getToken, isSupported } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyC097zfJTujVoFLA-B-rFIaDIg2DKUV_VY",
  authDomain: "pitudiet-2d166.firebaseapp.com",
  projectId: "pitudiet-2d166",
  storageBucket: "pitudiet-2d166.firebasestorage.app",
  messagingSenderId: "492904065341",
  appId: "1:492904065341:web:327843f217d438597f7d54",
  measurementId: "G-0037KHGYWX"
};

// Funzione Helper per convertire la chiave VAPID (Risolve InvalidAccessError)
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Esportazione per Notifiche.jsx
export const messaging = typeof window !== "undefined" ? getMessaging(app) : null;

export const richiediTokenNotifiche = async (userId) => {
  console.log("Inizio procedura notifiche...");

  try {
    const supportato = await isSupported();
    if (!supportato) {
      console.warn("Browser non supportato per le notifiche.");
      return;
    }

    const currentMessaging = messaging || getMessaging(app);

    // Registrazione Service Worker
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
      scope: '/'
    });
    await navigator.serviceWorker.ready;

    const vapidKeyStr = "BMeyMztBU0IQ8cpyTcoQt1fiLK1iesrsczWaAqKU2omrOwmGN7JHrLax81GX5f2mf19c2ARNYwSw9TpVCGZTEIw";

    const token = await getToken(currentMessaging, { 
      vapidKey: urlBase64ToUint8Array(vapidKeyStr), // Conversione attiva
      serviceWorkerRegistration: registration 
    });

    if (token) {
      console.log("Token ottenuto:", token);
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { fcmToken: token });
      console.log("✅ TOKEN SALVATO SU FIRESTORE!");
      return token;
    } else {
      console.warn("Nessun token. Controlla i permessi cliccando sul lucchetto in alto.");
    }
  } catch (err) {
    console.error("Errore durante l'attivazione:", err);
  }
};