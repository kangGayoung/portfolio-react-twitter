import { initializeApp, FirebaseApp, getApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore';
import {getStorage} from "firebase/storage";

// Initialize Firebase
export let app: FirebaseApp;
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGEING_SENTER_ID,
    appId: process.env.REACT_APP_ID
};

try {
    app = getApp("app");
} catch (e){
    app = initializeApp(firebaseConfig, "app");
}

const firebase = initializeApp(firebaseConfig);

// 파이어스토어 적용
export const db = getFirestore(app);

// 스토리지 적용
export const storage = getStorage(app);

export default firebase;