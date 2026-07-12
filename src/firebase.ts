import { initializeApp } from 'firebase/app';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDyZsxPKGiJCazVqLJemLwFeuEyreKQS6w",
  authDomain: "gen-lang-client-0459155438.firebaseapp.com",
  databaseURL: "https://gen-lang-client-0459155438-default-rtdb.firebaseio.com",
  projectId: "gen-lang-client-0459155438",
  storageBucket: "gen-lang-client-0459155438.firebasestorage.app",
  messagingSenderId: "85657428468",
  appId: "1:85657428468:web:fd6c080666eb11792699a1"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app, "ai-studio-mevinserp-8508ed93-8dc1-47fa-8fdc-87ee68eae527");

// App Check is mandatory — without it, the verifyCertificate function will reject calls
const appCheck = initializeAppCheck(app, {
  // Make sure to replace this with your actual reCAPTCHA v3 site key
  provider: new ReCaptchaV3Provider('6Le69E8tAAAAAGTMQu2o0CsOZVqgChq4XGbZN7kq'), 
  isTokenAutoRefreshEnabled: true
});

const functions = getFunctions(app);

// Export the callable function for the verification page
export const verifyCertificate = httpsCallable(functions, 'verifyCertificate');

export { app, functions };