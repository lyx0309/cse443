// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDGZEYVi6RYfNlrMW4xol4lE591vISWnDU",
    authDomain: "ktm-cse443.firebaseapp.com",
    projectId: "ktm-cse443",
    storageBucket: "ktm-cse443.firebasestorage.app",
    messagingSenderId: "617307193764",
    appId: "1:617307193764:web:869028e3d968491a8c4131",
    measurementId: "G-81Q9C66WN9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const getStationList = async () => {
    const querySnapshot = await getDocs(collection(db, "stations"));

    const data = querySnapshot.docs.map((doc) => doc.data());
    console.log(data);

    return data;
};

export const getRouteByDepartureCode = async (departureCode) => {
    const q = query(collection(db, "routes"), where("fromCode", "==", departureCode));

    const querySnapshot = await getDocs(q);

    const data = querySnapshot.docs.map((doc) => {
        return {
            id: doc.id,
            ...doc.data(),
        };
    });

    return data;
};
