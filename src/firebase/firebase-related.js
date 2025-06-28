// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, where, getDoc, doc, updateDoc, setDoc } from "firebase/firestore";
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
    try {
        const querySnapshot = await getDocs(collection(db, "stations"));

        const data = querySnapshot.docs.map((doc) => doc.data());
        console.log(data);

        return data;
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
};

export const getRouteByDepartureCode = async (departureCode) => {
    try {
        const q = query(collection(db, "routes"), where("fromCode", "==", departureCode));

        const querySnapshot = await getDocs(q);

        const data = querySnapshot.docs.map((doc) => {
            return {
                id: doc.id,
                ...doc.data(),
            };
        });

        return data;
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
};

function parseTimeToMinutes(timeStr) {
    const [h, m] = timeStr.split(":").map(Number);
    return h * 60 + m;
}

function minutesToHHMM(minutes) {
    const h = Math.floor(minutes / 60)
        .toString()
        .padStart(2, "0");
    const m = (minutes % 60).toString().padStart(2, "0");
    return `${h}:${m}`;
}

export async function expandTrainTimesByStation() {
    const docRef = doc(db, "Timetable", "2JE6x7KbqTMrfbUEwYLB"); // adjust collection name
    const snap = await getDoc(docRef);
    if (!snap.exists()) {
        console.error("Document not found");
        return;
    }

    const fullData = snap.data();
    const baseField = "Padang Besar";
    const trainMap = fullData[baseField];

    if (!trainMap) {
        console.error('"Padang Besar" field missing in document');
        return;
    }

    // Known station times for train 2941
    const stationSchedule2941 = {
        "Bukit Ketri": "05:32",
        Arau: "05:39",
        Kodiang: "05:45",
        "Anak Bukit": "05:58",
        "Alor Setar": "06:03",
        Kobah: "06:14",
        Gurun: "06:24",
        "Sungai Petani": "06:37",
        "Tasek Gelugor": "06:48",
        "Bukit Mertajam": "07:00",
        "Bukit Tengah": "07:04",
        Butterworth: "07:11",
    };

    const baseTrainNo = "2941";
    const baseTime = trainMap[baseTrainNo];
    const baseMinutes = parseTimeToMinutes(baseTime);

    // Compute time offsets relative to Padang Besar
    const timeOffsets = {};
    for (const [station, time] of Object.entries(stationSchedule2941)) {
        timeOffsets[station] = parseTimeToMinutes(time) - baseMinutes;
    }

    // Build final structure
    const newStationMaps = {};
    for (const [station, offset] of Object.entries(timeOffsets)) {
        newStationMaps[station] = {};
        for (const [trainNo, padangTime] of Object.entries(trainMap)) {
            const padangMinutes = parseTimeToMinutes(padangTime);
            const stationTime = minutesToHHMM(padangMinutes + offset);
            newStationMaps[station][trainNo] = stationTime;
        }
    }

    // Add all new station fields and re-include Padang Besar
    const updatePayload = {
        "Padang Besar": trainMap,
        ...newStationMaps,
    };

    await updateDoc(docRef, updatePayload);
    console.log("Station fields added successfully.");
}

export async function insertBookingData(bookingData, bookingIdArr) {
    try {
        const expiryDate = new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000);

        delete bookingData.numOfPassengers;
        delete bookingData.price;

        for (let i = 0; i < bookingIdArr.length; i++) {
            const bookingId = bookingIdArr[i];
            const bookingRef = doc(db, "Bookings", bookingId);
            await setDoc(bookingRef, { ...bookingData, id: bookingId, expiryDate: expiryDate });
        }
    } catch (error) {
        console.error("Error inserting data:", error);
        throw error;
    }
}
