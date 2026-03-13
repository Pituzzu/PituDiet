// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyC097zfJTujVoFLA-B-rFIaDIg2DKUV_VY",
  projectId: "pitudiet-2d166",
  messagingSenderId: "492904065341",
  appId: "1:492904065341:web:327843f217d438597f7d54"
});

const messaging = firebase.messaging();

// Gestione notifiche in background
messaging.onBackgroundMessage((payload) => {
  console.log("Notifica ricevuta in background:", payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo192.png' // Metti un'icona che hai in public
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});