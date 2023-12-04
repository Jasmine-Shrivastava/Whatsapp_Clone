import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyARUa8MHeUvK0vp0NxnZm2EBZMEQSMwhus",
    authDomain: "chatapp-72fe1.firebaseapp.com",
    projectId: "chatapp-72fe1",
    storageBucket: "chatapp-72fe1.appspot.com",
    messagingSenderId: "636330635479",
    appId: "1:636330635479:web:52b966ab6a5c2802130092",
    measurementId: "G-5JPBR8DKFL"
  };

  const app =  initializeApp(firebaseConfig);
  export const firebaseAuth = getAuth(app);