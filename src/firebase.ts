import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "gen-lang-client-0459155438",
  apiKey: "dummy-key-to-bypass-sdk-checks",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, "ai-studio-mevinserp-8508ed93-8dc1-47fa-8fdc-87ee68eae527");
