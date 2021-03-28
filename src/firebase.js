import firebase from 'firebase/app';
import 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyC-VZ6UXBtya_8pcLt2AWXrWExViKiTKZU",
    authDomain: "where-s-waldo-1cd92.firebaseapp.com",
    projectId: "where-s-waldo-1cd92",
    storageBucket: "where-s-waldo-1cd92.appspot.com",
    messagingSenderId: "177751621669",
    appId: "1:177751621669:web:d108c475a4c8fbc63affcc"
};

firebase.initializeApp(firebaseConfig);

export const firestore = firebase.firestore();

export default firebase;