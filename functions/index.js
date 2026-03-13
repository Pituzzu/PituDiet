const { onDocumentWritten } = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");

admin.initializeApp();

exports.notificaNuovoPasto = onDocumentWritten("users/{userId}/piano_settimanale/{giorno}", async (event) => {
    const userId = event.params.userId;
    const giorno = event.params.giorno;
    const datiPasto = event.data.after.data();

    if (!datiPasto) return null; 

    try {
        const userDoc = await admin.firestore().doc(`users/${userId}`).get();
        const fcmToken = userDoc.data()?.fcmToken;

        if (!fcmToken) {
            console.log("Nessun token per l'utente:", userId);
            return null;
        }

        const messaggio = {
            notification: {
                title: "Piano Aggiornato! 🍎",
                body: `Hai salvato nuove informazioni per ${giorno}.`
            },
            token: fcmToken
        };

        await admin.messaging().send(messaggio);
        console.log("Notifica inviata con successo!");
    } catch (error) {
        console.error("Errore invio:", error);
    }
    return null;
});