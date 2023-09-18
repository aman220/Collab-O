import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/database";
import "firebase/compat/storage";


const firebaseConfig = {
    // apiKey: "AIzaSyDtoWjp8cu9ggnrONAv1RZ8RxNLIuLgyRs",
    // authDomain: "collab-o-452a2.firebaseapp.com",
    // projectId: "collab-o-452a2",
    // storageBucket: "collab-o-452a2.appspot.com",
    // messagingSenderId: "289580180962",
    // appId: "1:289580180962:web:a66f65df99d6fdb69005bb",
    // measurementId: "G-FVS0XWFXHM"
    apiKey: "AIzaSyADtGz7O9BfpoHFWJdP2MAu27yQn_UX7rE",
    authDomain: "collab-o2.firebaseapp.com",
    projectId: "collab-o2",
    storageBucket: "collab-o2.appspot.com",
    messagingSenderId: "756037419126",
    appId: "1:756037419126:web:3e978de9da98e2bd12df57",
    measurementId: "G-F9KMH094SV"
};

const app = firebase.initializeApp(firebaseConfig);

console.log(app);

export const firebaseAuth = firebase.auth();
export const database = firebase.database();
export const firestore = firebase.firestore();
export const storage = firebase.storage();
