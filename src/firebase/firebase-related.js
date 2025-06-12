import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your provided Firebase configuration
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
// Initialize and export auth so other parts of your app can use it
export const auth = getAuth(app);

/**
 * Fetches a list of all train stations.
 * @returns {Promise<Array>} A promise that resolves to an array of station objects.
 */
export const getStationList = async () => {
    const querySnapshot = await getDocs(collection(db, "stations"));
    const data = querySnapshot.docs.map((doc) => doc.data());
    return data;
};

/**
 * Fetches routes based on a specific departure station code.
 * @param {string} departureCode - The code of the departure station.
 * @returns {Promise<Array>} A promise that resolves to an array of route objects.
 */
export const getRouteByDepartureCode = async (departureCode) => {
    const q = query(collection(db, "routes"), where("fromCode", "==", departureCode));
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return data;
};

/**
 * Fetches the full timetable details.
 * This version queries the collection and uses the first document found,
 * instead of relying on a hardcoded document ID.
 * @returns {Promise<Object|null>} A promise that resolves to an object containing the train number and its schedule, or null if not found.
 */
export const getTimetable = async () => {
    try {
        // Query the "Timetable" collection instead of fetching a specific document by ID.
        const timetableCollection = collection(db, "Timetable");
        const querySnapshot = await getDocs(timetableCollection);

        // Check if the collection is empty.
        if (querySnapshot.empty) {
            console.error("No timetable documents found in the 'Timetable' collection!");
            return null;
        }

        // Use the data from the first document in the collection.
        const data = querySnapshot.docs[0].data();
        const timetableData = {
            trainNo: data.TrainNo || "N/A", // Get the TrainNo, with a fallback
            schedule: []
        };

        // Loop from 1 to 12 to gather all location and time fields
        for (let i = 1; i <= 12; i++) {
            const locationKey = `Location${i}`;
            const timeKey = `Time${i}`;

            // Only add the stop to the schedule if both the location and time exist
            if (data[locationKey] && data[timeKey]) {
                timetableData.schedule.push({
                    location: data[locationKey],
                    time: data[timeKey]
                });
            }
        }
        
        return timetableData;

    } catch (error) {
        console.error("Error fetching timetable:", error);
        return null;
    }
};


/**
 * Finds the next available train based on departure, destination, and current time.
 * @param {string} from - The departure location.
 * @param {string} to - The destination location.
 * @param {string} userTime - The current time in 'HH:MM' format.
 * @returns {Promise<Object|null>} A promise that resolves to the next train object or null if none is found.
 */
export const findNextTrain = async (from, to, userTime) => {
    try {
        const q = query(collection(db, "Train"), where("from", "==", from), where("to", "==", to));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return null;
        }

        // Map and sort trains by departure time
        const trains = querySnapshot.docs.map(doc => doc.data());
        trains.sort((a, b) => a.departureTime.localeCompare(b.departureTime));

        // Find the first train that departs after the user's time
        const nextTrain = trains.find(train => train.departureTime > userTime);

        return nextTrain || null;

    } catch (error) {
        console.error("Error finding next train:", error);
        return null;
    }
};
