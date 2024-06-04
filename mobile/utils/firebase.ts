import { getApps, getApp, initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth, getReactNativePersistence, initializeAuth } from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const FIREBASE_API_KEY = "AIzaSyDcWxvdySkScbdc75OVwBOI3jH_K9ezJWs";
const FIREBASE_AUTH_DOMAIN = "mobile-assistant-56277.firebaseapp.com";
const FIREBASE_PROJECT_ID = "mobile-assistant-56277";
const FIREBASE_STORAGE_BUCKET = "mobile-assistant-56277.appspot.com";
const FIREBASE_MESSAGING_SENDER_ID = "774952322865";
const FIREBASE_APP_ID = "1:774952322865:web:5e247b917c27cbf6e71210";
const FIREBASE_MEASUREMENT_ID = "G-9FFDHSPJ0G"

export {
    FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN,
    FIREBASE_PROJECT_ID,
    FIREBASE_STORAGE_BUCKET,
    FIREBASE_MESSAGING_SENDER_ID,
    FIREBASE_APP_ID,
    FIREBASE_MEASUREMENT_ID
};

const firebaseConfig = {
    apiKey: FIREBASE_API_KEY,
    authDomain: FIREBASE_AUTH_DOMAIN,
    projectId: FIREBASE_PROJECT_ID,
    storageBucket: FIREBASE_STORAGE_BUCKET,
    messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
    appId: FIREBASE_APP_ID,
    measurementId: FIREBASE_MEASUREMENT_ID
};

let app;
// Initialize Firebase
if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApp();
}

const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
const storage = getStorage(app);

export { auth, storage };
